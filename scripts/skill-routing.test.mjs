import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { installPlugins } from '../install.js'

const root = new URL('../', import.meta.url)
const read = (path) => readFileSync(new URL(path, root), 'utf8')
const skill = (id) => read(`pstack/skills/${id}/SKILL.md`)
const frontmatter = (text) => text.split(/^---\s*$/m)[1]

// These are asset-contract checks, not model selection or permission-enforcement tests.
test('heavy workflows and principle references remain explicit-only assets', () => {
  const ids = [
    'architect', 'arena', 'automate-me', 'blast-radius', 'bro',
    'control-ui', 'create-verification-skill', 'figure-it-out', 'interrogate',
    'maintain-verification-skill', 'no-comments', 'poteto-mode',
    'recall', 'reflect', 'show-me-your-work', 'swarm', 'tdd',
    'teach', 'technical-writing',
    ...readdirSync(new URL('pstack/skills/', root)).filter((id) => id.startsWith('principle-')),
  ]
  for (const id of ids) {
    assert.match(frontmatter(skill(id)), /^disable-model-invocation: true$/m, id)
  }
})

test('why keeps bounded research in its advertised description and instructions', () => {
  const text = skill('why')
  assert.doesNotMatch(text, /queries (?:each evidence category|all seven) .*parallel|readonly`?: `?false|Default to the full parallel investigation/)
  assert.match(text, /at most two research agents concurrently/)
  assert.match(text, /leaf agent investigates inline and must not spawn children/)
  const investigator = read('pstack/skills/why/references/investigator-prompt.md')
  assert.match(investigator, /read-only leaves and must not spawn children/)
  assert.doesNotMatch(investigator, /one-investigator-per-category design|Cast a wide net first/)
})

test('teaching reuses evidence without mandatory dual investigation or image generation', () => {
  const text = skill('teach')
  assert.match(text, /Do not require both skills or parallel investigations/)
  assert.match(text, /Generate images only when the user explicitly asks/)
  assert.match(text, /Preserve uncertainty and citations/)
})

test('shipping discovery requires intent and the workflow gates each external action', () => {
  const text = skill('review-and-ship')
  assert.match(frontmatter(text), /explicit request to review and ship/)
  assert.match(text, /review alone does not authorize edits or shipping/)
  assert.match(text, /If the user explicitly asked for a commit/)
  assert.match(text, /If the user explicitly asked to push or open or update a PR/)
})

test('installation preserves explicit-only skills and bounded investigator resources', () => {
  const destination = mkdtempSync(join(tmpdir(), 'opencode-routing-'))
  try {
    installPlugins({ destination, plugins: ['pstack'], configure: false, cleanup: false })
    for (const id of ['architect', 'teach', 'control-ui', 'frontend-ui', 'poteto-mode', 'principle-extend-the-existing-home']) {
      assert.equal(readFileSync(join(destination, 'skills', id, 'SKILL.md'), 'utf8'), skill(id))
    }
    const resource = 'skills/why/references/investigator-prompt.md'
    assert.equal(readFileSync(join(destination, resource), 'utf8'), read(`pstack/${resource}`))
  } finally {
    rmSync(destination, { recursive: true, force: true })
  }
})

test('frontend verification does not require advanced control tooling', () => {
  const frontend = skill('frontend-ui')
  assert.match(frontmatter(frontend), /Not for backend-only changes, non-UI TypeScript, or read-only explanations/)
  assert.match(frontend, /No separate control skill or new automation framework is required/)
  assert.match(frontend, /load its `browser` skill when available/)
  const control = skill('control-ui')
  assert.match(control, /bind it to loopback/)
  assert.match(control, /Close only processes/)
  assert.doesNotMatch(control, /\/tmp\/|chromium\.launch\(/)
})

test('placement allows cohesive extraction while preserving ownership and behavior', () => {
  const text = skill('principle-extend-the-existing-home')
  assert.doesNotMatch(text, /new file is justified only when neighbors/)
  assert.match(text, /Safe extraction within the owner/)
  assert.match(text, /Move one responsibility at a time/)
  assert.match(text, /Preserve public interfaces, error behavior, side-effect ordering, and state lifetime/)
  assert.match(text, /avoid circular imports/)
  assert.match(text, /Compilation alone does not prove equivalence/)
  assert.match(text, /not frontend bundle splitting/)
})

test('quality review requires structural evidence rather than a file-size finding', () => {
  const text = read('thermos/skills/thermo-nuclear-code-quality-review/SKILL.md')
  assert.match(text, /A line count alone is not a finding/)
  assert.match(text, /name the existing owner, responsibility to move, proposed interface, and behavior checks/)
  assert.match(text, /does not authorize implementation/)
  assert.doesNotMatch(text, /Do not let a PR push a file from under 1k|file crossing 1000 lines due to the PR/)
})
