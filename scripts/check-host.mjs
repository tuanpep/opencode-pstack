import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globalConfigDir, packageRoot } from '../install.js'

export function inspectHost({ version, config = {}, installedWorkflow, installedDeep, installedPure, expectedWorkflow, expectedDeep, expectedPure }) {
  const findings = []
  const differs = (installed, expected) => installed?.replaceAll('\r\n', '\n') !== expected.replaceAll('\r\n', '\n')
  const major = Number(/^\D*(\d+)\./.exec(version)?.[1])
  if (!Number.isInteger(major) || major < 2) {
    findings.push(`Unsupported OpenCode host ${version}: this package targets V2; installation alone does not activate V2 hooks or permissions.`)
  }
  const legacy = ['plugin', 'agent', 'permission', 'instructions', 'subagent_depth'].filter((key) => Object.hasOwn(config, key))
  if (legacy.length) findings.push(`Legacy config keys detected: ${legacy.join(', ')}. Review before migrating; no configuration was changed.`)
  const plugins = Array.isArray(config.plugins) ? config.plugins : []
  if (plugins.filter((entry) => JSON.stringify(entry).includes('opencode-pstack')).length > 1) {
    findings.push('Multiple opencode-pstack plugin entries detected. Keep one after confirming which package is active.')
  }
  if (installedWorkflow !== undefined && differs(installedWorkflow, expectedWorkflow)) {
    findings.push('Installed WORKFLOW.md differs from the bundled copy. V2 injects the bundled text; avoid treating the installed copy as authoritative.')
  }
  if (installedDeep === undefined) findings.push('Installed deep.md is missing.')
  else if (differs(installedDeep, expectedDeep)) findings.push('Installed deep.md differs from the bundled agent.')
  if (installedPure === undefined) findings.push('Installed pure.md is missing.')
  else if (differs(installedPure, expectedPure)) findings.push('Installed pure.md differs from the bundled agent.')
  return findings
}

function optionalRead(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : undefined
}

function run() {
  const root = packageRoot()
  const destination = globalConfigDir()
  const configPath = ['opencode.json', 'opencode.jsonc'].map((name) => join(destination, name)).find(existsSync)
  let config = {}
  if (configPath) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf8'))
    } catch {
      console.error(`Cannot parse ${configPath} as JSON; inspect it manually (JSONC is not supported by this check).`)
      process.exitCode = 1
      return
    }
  }
  let version
  try {
    const result = spawnSync('opencode --version', { encoding: 'utf8', timeout: 10000, shell: true })
    if (result.error || result.status !== 0) throw result.error ?? new Error(result.stderr)
    version = result.stdout.trim()
  } catch {
    console.error('Cannot execute opencode --version. Install a supported OpenCode V2 host before smoke testing.')
    process.exitCode = 1
    return
  }
  const findings = inspectHost({
    version,
    config,
    installedWorkflow: optionalRead(join(destination, 'WORKFLOW.md')),
    installedDeep: optionalRead(join(destination, 'agents', 'deep.md')),
    installedPure: optionalRead(join(destination, 'agents', 'pure.md')),
    expectedWorkflow: readFileSync(join(root, 'opencode-workflow', 'WORKFLOW.md'), 'utf8'),
    expectedDeep: readFileSync(join(root, 'opencode-workflow', 'opencode', 'agent', 'deep.md'), 'utf8'),
    expectedPure: readFileSync(join(root, 'opencode-workflow', 'opencode', 'agent', 'pure.md'), 'utf8'),
  })
  console.log(`Host: OpenCode ${version}; config: ${destination}`)
  if (findings.length) {
    for (const finding of findings) console.error(`- ${finding}`)
    process.exitCode = 1
  } else {
    console.log('No obvious version, legacy-config, or installed-asset mismatch. Verify the live V2 hook and permissions in an isolated session before relying on them.')
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) run()
