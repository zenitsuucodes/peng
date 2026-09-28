import { Link } from 'react-router-dom'
import { getCategory } from '../utils/articles'
import { formatDate } from '../utils/format'

export default function FeaturedHero({ article, secondary = [] }) {
  if (!article) return null
  const cat = getCategory(article.category)

  return (
    <section className="hero-magazine" aria-label="Featured stories">
      <Link to={`/article/${article.slug}`} className="hero-feature">
        <div className="hero-feature-media">
          <img src={article.image.url} alt={article.image.alt} />
        </div>
        <div className="hero-feature-copy">
          <div className="hero-feature-meta">
            {cat && <span className="hero-kicker">{cat.name}</span>}
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
          <h1>{article.title}</h1>
          <p>{article.lead}</p>
          <span className="hero-cta">Read full story →</span>
        </div>
      </Link>

      {secondary.length > 0 && (
        <div className="hero-picks">
          <h2 className="hero-picks-label">Also trending</h2>
          <ul className="hero-picks-list">
            {secondary.map((a, i) => {
              const c = getCategory(a.category)
              return (
                <li key={a.id}>
                  <Link to={`/article/${a.slug}`}>
                    <span className="pick-rank">{String(i + 1).padStart(2, '0')}</span>
                    <img src={a.image.url} alt="" loading="lazy" />
                    <div>
                      {c && <span className="pick-cat">{c.name}</span>}
                      <h3>{a.title}</h3>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
