import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import ArticleCard from '../components/ArticleCard'
import { getArticleBySlug, getRelated, getCategory, site } from '../utils/articles'
import { formatDate } from '../utils/format'

function isSubheading(text) {
  return text.length < 56 && !/[.!?]$/.test(text) && /^[A-Z]/.test(text)
}

export default function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug)
  const cat = article ? getCategory(article.category) : null
  const related = article ? getRelated(article) : []

  useEffect(() => {
    if (!article) return
    document.title = `${article.title} — ${site.name}`
    return () => {
      document.title = `${site.name} — ${site.tagline}`
    }
  }, [article])

  if (!article) {
    return (
      <div className="container page-pad">
        <h1>Story not found</h1>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  return (
    <article className="page-article">
      <div className="container article-narrow">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          {cat && (
            <>
              <span>/</span>
              <Link to={`/category/${cat.id}`}>{cat.name}</Link>
            </>
          )}
        </nav>
        <header className="article-header">
          {cat && (
            <Link to={`/category/${cat.id}`} className="article-cat" style={{ color: cat.color }}>
              {cat.name}
            </Link>
          )}
          <h1>{article.title}</h1>
          <p className="article-lead">{article.lead}</p>
          <div className="article-meta">
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span>{article.readMinutes} min read</span>
          </div>
        </header>
        <figure className="article-figure">
          <img src={article.image.url} alt={article.image.alt} />
        </figure>
        <div className="article-body">
          {article.body.map((p, i) =>
            isSubheading(p) ? (
              <h2 key={i} className="article-subhead">
                {p}
              </h2>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </div>
      </div>
      {related.length > 0 && (
        <section className="container related-block">
          <h2 className="section-title">Related in {cat?.name}</h2>
          <div className="card-grid card-grid--4">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
