import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { expandArticleBody, estimateReadMinutes } from './expandArticleBody.mjs'
import { buildStoryList } from './storySeeds.mjs'
import { resolveWebImage, sleep } from './webImage.mjs'
import { mergeCustomArticles, loadCustomArticles } from './mergeCustomArticles.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const out = join(__dirname, '../src/data/articles.json')
const cachePath = join(__dirname, '../src/data/articleImageCache.json')

const site = {
  name: 'Peng',
  tagline: 'Animal news from every corner of the living world',
}

const categories = [
  { id: 'wildlife', name: 'Wildlife', color: '#0d9488' },
  { id: 'marine', name: 'Marine Life', color: '#0284c7' },
  { id: 'birds', name: 'Birds', color: '#7c3aed' },
  { id: 'pets', name: 'Pets & Companions', color: '#db2777' },
  { id: 'conservation', name: 'Conservation', color: '#059669' },
  { id: 'oddities', name: 'Odd & Amazing', color: '#ea580c' },
  { id: 'reptiles', name: 'Reptiles & Amphibians', color: '#65a30d' },
  { id: 'insects', name: 'Insects & Spiders', color: '#ca8a04' },
]

const categoryFallbackQuery = {
  wildlife: ['wildlife mammal nature'],
  marine: ['marine animal ocean'],
  birds: ['wild bird nature'],
  pets: ['pet dog cat'],
  conservation: ['wildlife conservation nature reserve'],
  oddities: ['unusual animal behavior'],
  reptiles: ['reptile amphibian nature'],
  insects: ['insect macro nature'],
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 72)
}

function daysAgo(n) {
  const d = new Date('2026-09-24')
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function loadCache() {
  if (!existsSync(cachePath)) return {}
  try {
    const raw = JSON.parse(readFileSync(cachePath, 'utf8'))
    const cleaned = {}
    for (const [key, url] of Object.entries(raw)) {
      if (typeof url === 'string' && !/wikimedia|wikipedia/i.test(url)) {
        cleaned[key] = url
      }
    }
    return cleaned
  } catch {
    return {}
  }
}

function cacheKey(seed) {
  return `${seed.category}::${seed.imageQuery.join('|')}`
}

async function imageForStory(seed, cache, usedUrls, articleId) {
  const key = cacheKey(seed)
  if (cache[key]) {
    usedUrls.add(cache[key])
    return cache[key]
  }

  const queries = [...seed.imageQuery, ...(categoryFallbackQuery[seed.category] ?? ['animal nature'])]
  let url = await resolveWebImage(queries, usedUrls, articleId)
  if (!url) {
    url = await resolveWebImage(categoryFallbackQuery[seed.category] ?? ['animal wildlife'], usedUrls, articleId + 1000)
  }
  if (!url) {
    throw new Error(`No image found for story: ${seed.title}`)
  }
  cache[key] = url
  await sleep(200)
  return url
}

const stories = buildStoryList()
const cache = loadCache()
const usedUrls = new Set(Object.values(cache))
const articles = []

for (let i = 0; i < stories.length; i++) {
  const seed = stories[i]
  const validCategory = categories.some((c) => c.id === seed.category)
  if (!validCategory) {
    throw new Error(`Invalid category "${seed.category}" on: ${seed.title}`)
  }

  const body = expandArticleBody(seed.category, seed.title, seed.lead, seed.core, i)
  const imageUrl = await imageForStory(seed, cache, usedUrls, i + 1)
  const topicTag = seed.imageQuery[0]?.split(/\s+/).slice(0, 2).join('-') ?? seed.category

  articles.push({
    id: i + 1,
    slug: `${slugify(seed.title)}-${i + 1}`,
    title: seed.title,
    lead: seed.lead,
    body,
    category: seed.category,
    publishedAt: daysAgo(i * 2),
    readMinutes: estimateReadMinutes(body),
    image: {
      url: imageUrl,
      alt: seed.title.split(':')[0],
    },
    tags: [seed.category, topicTag.replace(/[^a-z0-9-]/gi, '')].filter(Boolean),
    featured: i < 5,
    popularScore: 1000 - i * 7 + (i % 13) * 3,
  })
}

const mergedArticles = mergeCustomArticles(articles)
const customCount = loadCustomArticles().length

const payload = {
  site,
  categories,
  generatedAt: new Date().toISOString(),
  articles: mergedArticles,
}

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8')
writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8')
console.log(`Wrote ${mergedArticles.length} articles (${customCount} custom) to ${out}`)
console.log(`Image cache: ${Object.keys(cache).length} entries`)
