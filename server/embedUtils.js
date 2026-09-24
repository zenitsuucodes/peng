export function getRequestOrigin(req) {
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const proto = req.headers['x-forwarded-proto'] || 'https'
  if (!host) return 'https://peng-dusky.vercel.app'
  return `${proto}://${host}`
}

export function absoluteUrl(origin, path) {
  if (!path) return `${origin}/images/maru-pygmy-hippopotamus.jpg`
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function findArticle(catalog, slugOrId) {
  if (!catalog?.articles?.length || !slugOrId) return null
  return catalog.articles.find((a) => a.slug === slugOrId || String(a.id) === String(slugOrId))
}

export async function loadCatalog(origin) {
  const res = await fetch(`${origin}/articles.json`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildMetaTags(article, origin, siteName = 'Peng') {
  const title = escapeHtml(article.title)
  const description = escapeHtml(article.lead || article.title)
  const slug = article.slug
  const pageUrl = `${origin}/article/${slug}`
  const imagePath = typeof article.image === 'object' ? article.image.url : article.image
  const imageAlt = escapeHtml(article.image?.alt || article.title)
  const imageUrl = escapeHtml(absoluteUrl(origin, imagePath))

  return `
    <title>${title} | ${escapeHtml(siteName)}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeHtml(siteName)}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta property="og:url" content="${pageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />
    <link rel="canonical" href="${pageUrl}" />
  `
}

export function injectArticleMeta(indexHtml, article, origin) {
  const siteName = 'Peng'
  const meta = buildMetaTags(article, origin, siteName)
  return indexHtml
    .replace(/<meta name="description"[^>]*>\s*/i, '')
    .replace(/<meta property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/i, meta.trim())
}
