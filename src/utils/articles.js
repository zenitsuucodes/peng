import data from '../data/articles.json'

export const site = data.site
export const categories = data.categories
export const allArticles = [...data.articles].sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt),
)

export function getArticleBySlug(slug) {
  return allArticles.find((a) => a.slug === slug)
}

export function getArticlesByCategory(categoryId) {
  return allArticles.filter((a) => a.category === categoryId)
}

export function getFeatured() {
  const featured = allArticles.filter((a) => a.featured)
  return featured.length ? featured : allArticles.slice(0, 5)
}

export function getBreaking() {
  return allArticles.slice(0, 6)
}

export function getLatest(limit = 20) {
  return allArticles.slice(0, limit)
}

export function getPopular(limit = 10) {
  return [...allArticles].sort((a, b) => b.popularScore - a.popularScore).slice(0, limit)
}

export function getRelated(article, limit = 4) {
  return allArticles
    .filter((a) => a.category === article.category && a.id !== article.id)
    .slice(0, limit)
}

export function searchArticles(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return allArticles.filter((a) => {
    const cat = getCategory(a.category)?.name.toLowerCase() ?? ''
    return (
      a.title.toLowerCase().includes(q) ||
      a.lead.toLowerCase().includes(q) ||
      cat.includes(q) ||
      a.body.some((p) => p.toLowerCase().includes(q))
    )
  })
}

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}

export function groupByCategory(limitPer = 4) {
  return categories.map((cat) => ({
    ...cat,
    articles: getArticlesByCategory(cat.id).slice(0, limitPer),
  }))
}
