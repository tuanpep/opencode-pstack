import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const skip = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'vendor', 'target'])
const manifests = ['package.json', 'go.mod', 'pyproject.toml', 'Cargo.toml', 'pom.xml']
const anchors = new Set(['src', 'app', 'apps', 'packages', 'services', 'frontend', 'backend', 'internal', 'cmd', 'lib', 'features', 'modules'])
const groups = new Set(['features', 'modules', 'packages', 'services', 'apps'])
const sourceExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.svelte', '.go', '.py', '.rs', '.java', '.css'])
const decisionDirs = ['docs/adr', 'docs/decisions', 'adr']

function entries(path) {
  if (!existsSync(path)) return []
  return readdirSync(path, { withFileTypes: true }).filter((entry) => !skip.has(entry.name) && !entry.name.startsWith('.'))
}

function isDir(path) {
  return existsSync(path) && statSync(path).isDirectory()
}

function hasFile(path, depth) {
  if (depth < 0 || !isDir(path)) return false
  for (const entry of entries(path)) {
    const child = join(path, entry.name)
    if (entry.isFile()) return true
    if (entry.isDirectory() && hasFile(child, depth - 1)) return true
  }
  return false
}

function hasSource(path, depth) {
  if (depth < 0 || !isDir(path)) return false
  for (const entry of entries(path)) {
    const child = join(path, entry.name)
    if (entry.isFile()) {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'))
      if (sourceExt.has(ext)) return true
    } else if (entry.isDirectory() && hasSource(child, depth - 1)) return true
  }
  return false
}

function findAnchors(path, rel, depth, found) {
  if (depth > 4 || !isDir(path)) return
  for (const entry of entries(path)) {
    if (!entry.isDirectory()) continue
    const childRel = rel ? `${rel}/${entry.name}` : entry.name
    if (anchors.has(entry.name)) found.add(childRel)
    findAnchors(join(path, entry.name), childRel, depth + 1, found)
  }
}

function codeChildren(rel) {
  const path = join(root, rel)
  const listed = []
  for (const entry of entries(path)) {
    if (!entry.isDirectory()) continue
    const childRel = `${rel}/${entry.name}`
    if (groups.has(entry.name)) {
      for (const nested of entries(join(root, childRel))) {
        if (!nested.isDirectory()) continue
        const nestedRel = `${childRel}/${nested.name}`
        if (hasSource(join(root, nestedRel), 3)) listed.push(nestedRel)
      }
      continue
    }
    if (hasSource(join(root, childRel), 2)) listed.push(childRel)
  }
  if (listed.length === 0 && hasSource(path, 2)) listed.push(rel)
  return listed
}

const root = process.argv[2] ?? process.cwd()
const foundManifests = []
for (const name of manifests) {
  if (existsSync(join(root, name))) foundManifests.push(name)
}
for (const entry of entries(root)) {
  if (!entry.isDirectory()) continue
  for (const manifest of manifests) {
    if (existsSync(join(root, entry.name, manifest))) foundManifests.push(`${entry.name}/${manifest}`)
  }
}

const anchorRels = new Set()
findAnchors(root, '', 0, anchorRels)
const candidates = new Set()
for (const rel of anchorRels) {
  for (const item of codeChildren(rel)) candidates.add(item)
}
for (const rel of [...candidates]) {
  if ([...candidates].some((item) => item.startsWith(`${rel}/`))) candidates.delete(rel)
}
if (candidates.size === 0) {
  for (const entry of entries(root)) {
    if (entry.isDirectory() && hasFile(join(root, entry.name), 4)) candidates.add(entry.name)
  }
}

const decisions = []
for (const relative of decisionDirs) {
  const path = join(root, relative)
  if (!isDir(path)) continue
  decisions.push(relative)
  for (const name of readdirSync(path)) {
    if (name.endsWith('.md')) decisions.push(`${relative}/${name}`)
  }
}

console.log(`manifests: ${foundManifests.join(', ') || 'none'}`)
console.log(`candidates: ${[...candidates].sort().join(', ') || 'none'}`)
console.log('pick: choose the candidate that matches the task. This list is not a chosen home.')
console.log(`decisions: ${decisions.join(', ') || 'none'}`)
