import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const src = join(root, '../src/data/articles.json')
const dest = join(root, '../public/articles.json')

mkdirSync(dirname(dest), { recursive: true })
copyFileSync(src, dest)
console.log('Copied articles catalog to public/articles.json')
