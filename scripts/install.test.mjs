import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { applyConfig, globalConfigDir, installPlugins, mergeConfig, packageRoot, samePath } from '../install.js'

test('mergeConfig keeps a real API key', () => {
  const merged = mergeConfig(
    { provider: { openai: { options: { apiKey: 'sk-live' } } } },
    { provider: { openai: { options: { apiKey: '{env:OPENAI_API_KEY}' } } }, default_agent: 'code' },
  )
  assert.equal(merged.provider.openai.options.apiKey, 'sk-live')
  assert.equal(merged.default_agent, 'code')
})

test('applyConfig mutates the runtime config object', () => {
  const config = { plugin: ['other'] }
  applyConfig(config, { default_agent: 'code', instructions: ['WORKFLOW.md'] })
  assert.equal(config.default_agent, 'code')
  assert.deepEqual(config.instructions, ['WORKFLOW.md'])
  assert.deepEqual(config.plugin, ['other'])
})

test('mergeConfig re-enables primaries that a prior template disabled', () => {
  const merged = mergeConfig(
    {
      agent: {
        code: { disable: true, mode: 'primary' },
        deep: { disable: true, mode: 'primary' },
        review: { disable: true, mode: 'primary' },
      },
    },
    {
      agent: {
        code: { disable: false, mode: 'primary' },
        deep: { disable: false, mode: 'primary' },
        review: { disable: false, mode: 'primary' },
      },
    },
  )
  assert.equal(merged.agent.code.disable, false)
  assert.equal(merged.agent.deep.disable, false)
  assert.equal(merged.agent.review.disable, false)
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
    assert.deepEqual(config.instructions, ['WORKFLOW.md'])
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
    installPlugins({ destination, plugins: ['pstack'] })
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

