import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeCustomArticles } from './mergeCustomArticles.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalog = join(__dirname, '../src/data/articles.json')

const data = JSON.parse(readFileSync(catalog, 'utf8'))
data.articles = mergeCustomArticles(data.articles)
data.generatedAt = new Date().toISOString()
writeFileSync(catalog, JSON.stringify(data, null, 2), 'utf8')
console.log(`Merged custom articles. Total: ${data.articles.length}`)
