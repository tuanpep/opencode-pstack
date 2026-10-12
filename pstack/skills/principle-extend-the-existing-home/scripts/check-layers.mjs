import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

const skip = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.next', 'vendor', 'target'])
const source = new Set(['.ts', '.tsx', '.js', '.jsx', '.vue', '.svelte'])
const leak = /(?:from|import)\s*\(?\s*['"](?:@prisma\/client|prisma(?=['"/])|typeorm|knex|mongoose|drizzle-orm|[^'"]*[\\/](?:infrastructure|persistence|db)[\\/])/

export function isUi(filePath) {
  const path = filePath.replace(/\\/g, '/')
  if (/\/(api|routes|server)\//.test(path)) return false
  if (/(^|\/)route\.(tsx|ts|jsx|js)$/.test(path)) return false
  if (/\.(test|spec|stories)\./.test(path)) return false
  if (/\.(tsx|jsx|vue|svelte)$/.test(path)) return true
  return /\/(components|views|ui)\//.test(path)
}

export function leaksIn(text, filePath) {
  if (!isUi(filePath)) return []
  const hits = []
  const lines = text.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    if (leak.test(lines[index])) hits.push(`${filePath}:${index + 1}`)
  }
  return hits
}

function walk(dir, root, hits) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name) || entry.name.startsWith('.')) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(path, root, hits)
      continue
    }
    const ext = entry.name.slice(entry.name.lastIndexOf('.'))
    if (!source.has(ext) || !statSync(path).isFile()) continue
    const rel = relative(root, path).split(sep).join('/')
    const text = readFileSync(path, 'utf8')
    hits.push(...leaksIn(text, rel))
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = process.argv[2] ?? process.cwd()
  const hits = []
  if (existsSync(root)) walk(root, root, hits)
  if (hits.length === 0) {
    console.log('layer check: no UI import of infrastructure')
    process.exit(0)
  }
  console.log('layer check failed. Move the infrastructure import out of the UI file and into the module that already owns persistence.')
  for (const hit of hits) console.log(hit)
  process.exit(1)
}
