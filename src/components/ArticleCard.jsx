import { Link } from 'react-router-dom'
import { getCategory } from '../utils/articles'
import { formatDate } from '../utils/format'

export default function ArticleCard({ article, variant = 'default' }) {
  const cat = getCategory(article.category)
  return (
    <article className={`article-card article-card--${variant}`}>
      <Link to={`/article/${article.slug}`} className="article-card-link">
        <div className="article-card-media">
          <img src={article.image.url} alt={article.image.alt} loading="lazy" />
          {cat && (
            <span className="article-card-cat" style={{ background: cat.color }}>
              {cat.name}
            </span>
          )}
        </div>
        <div className="article-card-body">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          <h3>{article.title}</h3>
          {variant !== 'compact' && <p>{article.lead}</p>}
          <span className="read-time">{article.readMinutes} min read</span>
        </div>
      </Link>
    </article>
  )
}
