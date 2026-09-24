import { Link } from 'react-router-dom'
import { getBreaking } from '../utils/articles'

export default function BreakingBar() {
  const items = getBreaking()
  return (
    <div className="breaking-bar">
      <div className="container breaking-inner">
        <span className="breaking-label">Latest</span>
        <div className="breaking-track">
          {items.map((a) => (
            <Link key={a.id} to={`/article/${a.slug}`}>
              {a.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
