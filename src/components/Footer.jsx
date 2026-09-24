import { Link } from 'react-router-dom'
import { categories, site, allArticles } from '../utils/articles'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">{site.name}</p>
          <p className="footer-tagline">{site.tagline}</p>
          <p className="footer-meta">{allArticles.length} stories · Updated daily</p>
        </div>
        <div>
          <p className="footer-heading">Categories</p>
          <ul className="footer-links">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.id}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {site.name}. Stories written for readers who love the living world.</p>
      </div>
    </footer>
  )
}
