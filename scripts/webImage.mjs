const UA = 'PengNewsSite/1.0 (local; article images)'

export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function isBlockedHost(url) {
  const u = url.toLowerCase()
  return (
    u.includes('wikimedia.org') ||
    u.includes('wikipedia.org') ||
    u.includes('geograph.org.uk') ||
    u.includes('.svg')
  )
}

function skipResult(item) {
  const title = (item.title ?? '').toLowerCase()
  if (title.includes('logo') || title.includes('icon') || title.includes('diagram')) return true
  if (item.url && isBlockedHost(item.url)) return true
  if (item.thumbnail && isBlockedHost(item.thumbnail)) return true
  return false
}

async function urlOk(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': UA, Range: 'bytes=0-2048' },
      redirect: 'follow',
    })
    const type = res.headers.get('content-type') ?? ''
    return res.ok && type.startsWith('image/')
  } catch {
    return false
  }
}

async function searchOpenverse(term, page = 1) {
  const params = new URLSearchParams({
    q: term,
    page: String(page),
    page_size: '20',
    license: 'cc0,by,by-sa',
    mature: 'false',
  })
  const res = await fetch(`https://api.openverse.org/v1/images/?${params}`, {
    headers: { 'User-Agent': UA },
  })
  if (res.status === 429) {
    await sleep(2500)
    return searchOpenverse(term, page)
  }
  if (!res.ok) return []
  const json = await res.json()
  return json.results ?? []
}

function loremFlickrUrl(term, lockId) {
  const tags = term
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, '')
    .split(/\s+/)
    .slice(0, 3)
    .join(',')
  return `https://loremflickr.com/1200/675/${tags || 'animal,wildlife'}?lock=${lockId}`
}

export async function resolveWebImage(searchTerms, usedUrls, lockId = 1) {
  const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms]

  for (const term of terms) {
    let results
    try {
      results = await searchOpenverse(term)
    } catch {
      results = []
    }

    for (const item of results) {
      if (skipResult(item)) continue
      const candidate = item.url || item.thumbnail
      if (!candidate || isBlockedHost(candidate) || usedUrls.has(candidate)) continue
      if (await urlOk(candidate)) {
        usedUrls.add(candidate)
        return candidate
      }
    }
    await sleep(350)
  }

  const fallbackTerm = terms[0] ?? 'wildlife animal'
  const flickr = loremFlickrUrl(fallbackTerm, lockId)
  if (!usedUrls.has(flickr) && (await urlOk(flickr))) {
    usedUrls.add(flickr)
    return flickr
  }

  return null
}
