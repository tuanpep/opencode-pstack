import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { applyConfig, globalConfigDir, installPlugins, loadWorkflowTemplate, mergeConfig, packageRoot, samePath } from '../install.js'

test('plugin module exports a V2 definition', async () => {
  const mod = await import('../index.js')
  assert.equal(mod.default.id, 'opencode-pstack')
  assert.equal(typeof mod.default.setup, 'function')
})

test('V2 setup installs assets and activates workflow without changing config or AGENTS.md', async () => {
  const destination = mkdtempSync(join(tmpdir(), 'opencode-plugins-'))
  const original = process.env.OPENCODE_CONFIG_DIR
  try {
    process.env.OPENCODE_CONFIG_DIR = destination
    const config = join(destination, 'opencode.json')
    writeFileSync(config, '{"plugins":["other"]}\n')
    writeFileSync(join(destination, 'AGENTS.md'), 'user instructions\n')
    writeFileSync(join(destination, 'WORKFLOW.md'), 'my workflow\n')
    mkdirSync(join(destination, 'agents'), { recursive: true })
    writeFileSync(join(destination, 'agents', 'fox.md'), 'existing\n')
    const hooks = []
    const { default: plugin } = await import('../index.js')
    await plugin.setup({ options: {}, session: { hook: async (name, fn) => hooks.push([name, fn]) } })
    assert.equal(hooks.length, 1)
    assert.equal(hooks[0][0], 'context')
    const event = { system: [{ type: 'text', text: 'existing system' }] }
    hooks[0][1](event)
    assert.equal(event.system[0].text, 'existing system')
    assert.match(event.system[1].text, /# OpenCode development workflow/)
    assert.equal(readFileSync(config, 'utf8'), '{"plugins":["other"]}\n')
    assert.equal(readFileSync(join(destination, 'AGENTS.md'), 'utf8'), 'user instructions\n')
    assert.equal(readFileSync(join(destination, 'WORKFLOW.md'), 'utf8'), 'my workflow\n')
    assert.equal(readFileSync(join(destination, 'agents', 'fox.md'), 'utf8'), 'existing\n')
    assert.equal(existsSync(join(destination, 'agents', 'code.md')), true)
    assert.equal(existsSync(join(destination, 'commands', 'setup-pstack.md')), true)
    const code = join(destination, 'agents', 'code.md')
    const modified = statSync(code).mtimeMs
    installPlugins({ destination, configure: false, cleanup: false })
    assert.equal(statSync(code).mtimeMs, modified)
  } finally {
    if (original === undefined) delete process.env.OPENCODE_CONFIG_DIR
    else process.env.OPENCODE_CONFIG_DIR = original
    rmSync(destination, { recursive: true, force: true })
  }
})

test('mergeConfig preserves existing configuration and V2 leaf restrictions', () => {
  const template = loadWorkflowTemplate()
  const merged = mergeConfig(
    { providers: { openai: { options: { apiKey: 'sk-live' } } }, default_agent: 'build', permissions: [{ action: 'shell', resource: '*', effect: 'ask' }], agents: { worker: { model: 'openai/model', permissions: [{ action: 'shell', resource: '*', effect: 'ask' }] } } },
    template,
  )
  assert.equal(merged.providers.openai.options.apiKey, 'sk-live')
  assert.equal(merged.default_agent, 'build')
  assert.deepEqual(merged.permissions, [{ action: 'shell', resource: '*', effect: 'ask' }])
  assert.equal(merged.agents.worker.model, 'openai/model')
  assert.deepEqual(merged.agents.worker.permissions.at(-1), { action: 'subagent', resource: '*', effect: 'deny' })
  assert.deepEqual(mergeConfig(merged, template), merged)
  assert.equal('permission' in template, false)
  assert.equal('agent' in template, false)
  assert.equal('instructions' in template, false)
  assert.equal('tail_turns' in (template.compaction ?? {}), false)
})

test('applyConfig mutates the runtime config object', () => {
  const config = { plugins: ['other'], default_agent: 'build' }
  applyConfig(config, loadWorkflowTemplate())
  assert.equal(config.default_agent, 'build')
  assert.deepEqual(config.plugins, ['other'])
  assert.equal(config.agents.research.mode, 'subagent')
})

test('workflow can be excluded from plugin context injection', async () => {
  const destination = mkdtempSync(join(tmpdir(), 'opencode-plugins-'))
  const original = process.env.OPENCODE_CONFIG_DIR
  try {
    process.env.OPENCODE_CONFIG_DIR = destination
    const { default: plugin } = await import('../index.js')
    await plugin.setup({ options: { plugins: ['pstack'] }, session: { hook: () => { throw new Error('unexpected hook') } } })
    assert.equal(existsSync(join(destination, 'WORKFLOW.md')), false)
  } finally {
    if (original === undefined) delete process.env.OPENCODE_CONFIG_DIR
    else process.env.OPENCODE_CONFIG_DIR = original
    rmSync(destination, { recursive: true, force: true })
  }
})

test('installPlugins copies skills, agents, commands, and WORKFLOW.md', () => {
  const destination = mkdtempSync(join(tmpdir(), 'opencode-plugins-'))
  try {
    const result = installPlugins({ destination, plugins: ['pstack', 'thermos', 'opencode-workflow'] })
    assert.equal(result.destination, destination)
    assert.equal(existsSync(join(destination, 'skills', 'poteto-mode', 'SKILL.md')), true)
    assert.equal(existsSync(join(destination, 'agents', 'deep.md')), true)
    assert.equal(existsSync(join(destination, 'agents', 'code.md')), true)
    assert.equal(existsSync(join(destination, 'agents', 'review.md')), true)
    assert.equal(existsSync(join(destination, 'agents', 'worker.md')), true)
    assert.equal(existsSync(join(destination, 'agents', 'thermos-review.md')), true)
    assert.equal(existsSync(join(destination, 'commands', 'review.md')), true)
    assert.equal(existsSync(join(destination, 'WORKFLOW.md')), true)
    const configPath = existsSync(join(destination, 'opencode.json'))
      ? join(destination, 'opencode.json')
      : join(destination, 'opencode.jsonc')
    const config = JSON.parse(readFileSync(configPath, 'utf8'))
    assert.equal(config.default_agent, 'code')
    assert.deepEqual(config.agents.worker.permissions, [{ action: 'subagent', resource: '*', effect: 'deny' }])
    assert.equal(existsSync(join(destination, 'AGENTS.md')), false)
  } finally {
    rmSync(destination, { recursive: true, force: true })
  }
})

test('installPlugins removes stale owned files', () => {
  const destination = mkdtempSync(join(tmpdir(), 'opencode-plugins-'))
  try {
    mkdirSync(join(destination, 'agents'), { recursive: true })
    mkdirSync(join(destination, 'skills', 'weekly-review'), { recursive: true })
    writeFileSync(join(destination, 'agents', 'coding-agent.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'fox.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'hawk.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'wolf.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'rigor.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'dev.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'audit.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'pip.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'owl.md'), 'stale\n')
    writeFileSync(join(destination, 'agents', 'bear.md'), 'stale\n')
    writeFileSync(join(destination, 'skills', 'weekly-review', 'SKILL.md'), 'stale\n')
    installPlugins({ destination, plugins: ['pstack'], cleanup: true })
    assert.equal(existsSync(join(destination, 'agents', 'coding-agent.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'fox.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'hawk.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'wolf.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'rigor.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'dev.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'audit.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'pip.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'owl.md')), false)
    assert.equal(existsSync(join(destination, 'agents', 'bear.md')), false)
    assert.equal(existsSync(join(destination, 'skills', 'weekly-review')), false)
  } finally {
    rmSync(destination, { recursive: true, force: true })
  }
})

test('globalConfigDir honors OPENCODE_CONFIG_DIR and XDG_CONFIG_HOME', () => {
  const originalConfigDir = process.env.OPENCODE_CONFIG_DIR
  const originalXdg = process.env.XDG_CONFIG_HOME
  try {
    process.env.OPENCODE_CONFIG_DIR = join(tmpdir(), 'opencode-config-dir')
    delete process.env.XDG_CONFIG_HOME
    assert.equal(samePath(globalConfigDir(), join(tmpdir(), 'opencode-config-dir')), true)

    delete process.env.OPENCODE_CONFIG_DIR
    process.env.XDG_CONFIG_HOME = join(tmpdir(), 'xdg-config')
    assert.equal(samePath(globalConfigDir(), join(tmpdir(), 'xdg-config', 'opencode')), true)
  } finally {
    if (originalConfigDir === undefined) {
      delete process.env.OPENCODE_CONFIG_DIR
    } else {
      process.env.OPENCODE_CONFIG_DIR = originalConfigDir
    }
    if (originalXdg === undefined) {
      delete process.env.XDG_CONFIG_HOME
    } else {
      process.env.XDG_CONFIG_HOME = originalXdg
    }
  }
})

test('packageRoot is the repository root', () => {
  assert.equal(existsSync(join(packageRoot(), 'pstack', 'skills', 'poteto-mode', 'SKILL.md')), true)
})
