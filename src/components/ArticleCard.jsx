import { Link } from 'react-router-dom'
import { getCategory } from '../utils/articles'
import { formatDate } from '../utils/format'

export default function ArticleCard({ article, variant = 'default' }) {
  const cat = getCategory(article.category)

  if (variant === 'row') {
    return (
      <article className="article-card article-card--row">
        <Link to={`/article/${article.slug}`} className="article-card-link">
          <div className="article-card-media">
            <img src={article.image.url} alt={article.image.alt} loading="lazy" />
          </div>
          <div className="article-card-body">
            <div className="article-card-top">
              {cat && <span className="article-card-cat">{cat.name}</span>}
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </div>
            <h3>{article.title}</h3>
            <p>{article.lead}</p>
            <span className="read-time">{article.readMinutes} min read</span>
          </div>
        </Link>
      </article>
    )
  }

  if (variant === 'strip') {
    return (
      <article className="article-card article-card--strip">
        <Link to={`/article/${article.slug}`} className="article-card-link">
          <div className="article-card-media">
            <img src={article.image.url} alt={article.image.alt} loading="lazy" />
            {cat && <span className="article-card-cat">{cat.name}</span>}
          </div>
          <div className="article-card-body">
            <h3>{article.title}</h3>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className={`article-card article-card--${variant}`}>
      <Link to={`/article/${article.slug}`} className="article-card-link">
        <div className="article-card-media">
          <img src={article.image.url} alt={article.image.alt} loading="lazy" />
          {cat && <span className="article-card-cat">{cat.name}</span>}
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
