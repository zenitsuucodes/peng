import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const customDir = join(__dirname, '../src/data/custom')

export function loadCustomArticles() {
  if (!existsSync(customDir)) return []
  const files = readdirSync(customDir).filter((f) => f.endsWith('.json'))
  return files.map((f) => JSON.parse(readFileSync(join(customDir, f), 'utf8')))
}

export function mergeCustomArticles(articles) {
  const custom = loadCustomArticles()
  if (!custom.length) return articles

  const bySlug = new Map(articles.map((a) => [a.slug, a]))
  for (const c of custom) {
    bySlug.delete(c.slug)
    bySlug.set(c.slug, c)
  }

  const merged = [...bySlug.values()].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
  )

  return merged.map((a, i) => ({ ...a, id: i + 1 }))
}
