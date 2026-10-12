import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { leaksIn } from './check-layers.mjs'
import { extract } from '../../architect/scripts/fetch-sources.mjs'

test('find-home lists manifests, nested features, top-level roots, and decisions', () => {
  const root = mkdtempSync(join(tmpdir(), 'find-home-'))
  mkdirSync(join(root, 'src', 'features', 'orders'), { recursive: true })
  mkdirSync(join(root, 'services', 'billing'), { recursive: true })
  mkdirSync(join(root, 'pstack', 'skills'), { recursive: true })
  mkdirSync(join(root, 'docs', 'adr'), { recursive: true })
  writeFileSync(join(root, 'package.json'), '{}\n')
  writeFileSync(join(root, 'src', 'features', 'orders', 'OrderForm.tsx'), 'export {}\n')
  writeFileSync(join(root, 'services', 'billing', 'main.go'), 'package billing\n')
  writeFileSync(join(root, 'pstack', 'skills', 'note.mjs'), 'export {}\n')
  writeFileSync(join(root, 'docs', 'adr', 'orders.md'), '# orders\n')
  const result = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'find-home.mjs'), root], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  assert.match(result.stdout, /package\.json/)
  assert.match(result.stdout, /src\/features\/orders/)
  assert.match(result.stdout, /services\/billing/)
  assert.match(result.stdout, /docs\/adr\/orders\.md/)
  assert.match(result.stdout, /not a chosen home/)
})

test('find-home lists a top-level root when no src or packages tree exists', () => {
  const root = mkdtempSync(join(tmpdir(), 'find-home-root-'))
  mkdirSync(join(root, 'pstack', 'skills'), { recursive: true })
  writeFileSync(join(root, 'pstack', 'skills', 'note.mjs'), 'export {}\n')
  const result = spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'find-home.mjs'), root], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  assert.match(result.stdout, /candidates: pstack/)
})

test('check-layers flags UI imports and ignores API routes', () => {
  const prisma = "import { db } from '@prisma/client'\n"
  assert.deepEqual(leaksIn(prisma, 'src/components/OrderList.tsx'), ['src/components/OrderList.tsx:1'])
  assert.deepEqual(leaksIn(prisma, 'src/features/orders/OrderForm.tsx'), ['src/features/orders/OrderForm.tsx:1'])
  assert.deepEqual(leaksIn(prisma, 'app/orders/page.tsx'), ['app/orders/page.tsx:1'])
  assert.deepEqual(leaksIn(prisma, 'pages/api/orders.ts'), [])
  assert.deepEqual(leaksIn(prisma, 'src/routes/orders.ts'), [])
  assert.deepEqual(leaksIn(prisma, 'src/orders/repo.ts'), [])
})

test('fetch-sources extract keeps the title and a short text', () => {
  const { title, text } = extract('<html><title>Orders</title><style>x{}</style><p>Keep this</p></html>', 'https://example.com')
  assert.equal(title, 'Orders')
  assert.match(text, /Keep this/)
  assert.equal(text.includes('x{}'), false)
})
