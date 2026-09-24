import { Link } from 'react-router-dom'
import { getCategory } from '../utils/articles'
import { formatDate } from '../utils/format'

export default function FeaturedHero({ article, secondary = [] }) {
  if (!article) return null
  const cat = getCategory(article.category)

  return (
    <section className="hero">
      <Link to={`/article/${article.slug}`} className="hero-main">
        <img src={article.image.url} alt={article.image.alt} />
        <div className="hero-overlay">
          {cat && (
            <span className="hero-cat" style={{ background: cat.color }}>
              {cat.name}
            </span>
          )}
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <h1>{article.title}</h1>
          <p>{article.lead}</p>
        </div>
      </Link>
      <ul className="hero-secondary">
        {secondary.map((a) => {
          const c = getCategory(a.category)
          return (
            <li key={a.id}>
              <Link to={`/article/${a.slug}`}>
                <img src={a.image.url} alt="" loading="lazy" />
                <div>
                  {c && <span style={{ color: c.color }}>{c.name}</span>}
                  <h2>{a.title}</h2>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
