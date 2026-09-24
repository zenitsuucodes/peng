import { useSearchParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { searchArticles } from '../utils/articles'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = searchArticles(q)

  return (
    <div className="page-pad">
      <div className="container">
        <header className="search-header">
          <h1>Search</h1>
          {q ? (
            <p>
              {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{q}&rdquo;
            </p>
          ) : (
            <p>Type a keyword in the header search box.</p>
          )}
        </header>
        {results.length > 0 && (
          <div className="card-grid">
            {results.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
