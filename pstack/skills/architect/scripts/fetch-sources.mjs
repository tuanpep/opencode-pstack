import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

export function extract(html, url) {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || url
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 600)
  return { title, text }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href
const urls = isCli ? process.argv.slice(2).filter((url) => url.startsWith('https://')).slice(0, 3) : []

if (isCli && urls.length === 0) {
  console.error('usage: node fetch-sources.mjs <https-url> [https-url] [https-url]')
  process.exit(2)
}

for (const url of urls) {
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
    headers: { 'user-agent': 'pstack-fetch-sources' },
  })
  const { title, text } = extract(await response.text(), url)
  console.log(`# ${title}`)
  console.log(url)
  console.log(text)
  console.log('')
}
