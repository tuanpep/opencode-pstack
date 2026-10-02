import assert from 'node:assert/strict'
import { test } from 'node:test'
import { inspectHost } from './check-host.mjs'

const assets = { expectedWorkflow: 'workflow', expectedDeep: 'deep', expectedPure: 'pure' }

test('flags v1 host, legacy config and stale assets without modifying anything', () => {
  const findings = inspectHost({ version: '1.18.34', config: { plugin: ['github:tuanpep/opencode-pstack'], permission: { '*': 'allow' } }, installedWorkflow: 'old', installedDeep: 'old', installedPure: 'pure', ...assets })
  assert.match(findings.join('\n'), /Unsupported OpenCode host/)
  assert.match(findings.join('\n'), /Legacy config keys/)
  assert.match(findings.join('\n'), /WORKFLOW.md differs/)
  assert.match(findings.join('\n'), /deep.md differs/)
})

test('accepts v2 with one plugin and matching installed assets', () => {
  assert.deepEqual(inspectHost({ version: '2.0.0', config: { plugins: ['github:tuanpep/opencode-pstack'] }, installedWorkflow: 'workflow', installedDeep: 'deep', installedPure: 'pure', ...assets }), [])
})

test('ignores platform line endings but reports missing installed agents', () => {
  assert.deepEqual(inspectHost({ version: '2.0.0', config: {}, installedWorkflow: 'a\r\nb', installedDeep: 'a\r\nb', installedPure: 'pure', expectedWorkflow: 'a\nb', expectedDeep: 'a\nb', expectedPure: 'pure' }), [])
  assert.match(inspectHost({ version: '2.0.0', ...assets }).join('\n'), /Installed deep.md is missing/)
})

test('flags duplicate v2 plugin registrations', () => {
  const findings = inspectHost({ version: '2.0.0', config: { plugins: ['github:tuanpep/opencode-pstack', { package: 'github:tuanpep/opencode-pstack' }] }, ...assets })
  assert.match(findings.join('\n'), /Multiple opencode-pstack/)
})
