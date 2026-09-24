import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '../src/data/imageUrls.json')

const UA = 'PengNewsSite/1.0 (local; image catalog)'

const SEARCHES = [
  'wildlife mammal nature photograph -logo',
  'bird wildlife nature photograph',
  'marine ocean animal photograph',
  'insect macro nature photograph',
  'reptile amphibian nature photograph',
  'dog cat pet photograph',
  'elephant lion tiger wildlife',
  'whale dolphin seal ocean',
  'butterfly bee dragonfly',
  'frog turtle snake wildlife',
]

async function searchCommons(term, limit = 60) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: term,
    gsrlimit: String(limit),
    gsrnamespace: '6',
    prop: 'imageinfo',
    iiprop: 'url|mime|thumburl',
    iiurlwidth: '1280',
    format: 'json',
  })
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { 'User-Agent': UA },
  })
  if (!res.ok) throw new Error(`Commons API ${res.status}`)
  const json = await res.json()
  return Object.values(json.query?.pages ?? {})
}

function cleanUrl(url) {
  if (!url) return null
  const u = url.split('?')[0]
  if (!u.startsWith('https://upload.wikimedia.org/') && !u.startsWith('https://thumb.wikimedia.org/')) {
    return null
  }
  return u
}

async function urlOk(url) {
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'User-Agent': UA, Range: 'bytes=0-2048' },
    redirect: 'follow',
  })
  return res.ok
}

async function mapPool(items, limit, fn) {
  const results = []
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()))
  return results
}

const seen = new Set()
const candidates = []

for (const term of SEARCHES) {
  if (candidates.length >= 220) break
  let pages
  try {
    pages = await searchCommons(term)
  } catch (e) {
    console.warn('Search failed:', term, e.message)
    continue
  }
  for (const page of pages) {
    if (candidates.length >= 220) break
    const info = page.imageinfo?.[0]
    if (!info?.mime?.startsWith('image/')) continue
    if (info.mime === 'image/svg+xml' || info.mime === 'image/gif') continue

    const candidate =
      cleanUrl(info.thumburl) ?? cleanUrl(info.url?.replace('/commons/', '/commons/thumb/'))
    if (!candidate || seen.has(candidate)) continue

    const title = (page.title ?? '').toLowerCase()
    if (title.includes('logo') || title.includes('icon') || title.includes('svg')) continue
    if (title.includes('geograph.org.uk') || title.includes('panoramio') || title.includes('flickr'))
      continue

    seen.add(candidate)
    candidates.push(candidate)
  }
}

const checks = await mapPool(candidates, 20, async (url) => ((await urlOk(url)) ? url : null))
const verified = []
for (const url of checks) {
  if (!url || verified.includes(url)) continue
  verified.push(url)
  if (verified.length >= 100) break
}

if (verified.length < 100) {
  throw new Error(`Only verified ${verified.length}/100 images. Re-run fetch or add search terms.`)
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ fetchedAt: new Date().toISOString(), urls: verified }, null, 2))
console.log(`Wrote ${verified.length} image URLs to ${out}`)
