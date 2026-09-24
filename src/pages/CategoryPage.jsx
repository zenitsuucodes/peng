import { useParams, Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard'
import { getArticlesByCategory, getCategory } from '../utils/articles'

export default function CategoryPage() {
  const { id } = useParams()
  const cat = getCategory(id)
  const articles = getArticlesByCategory(id)

  if (!cat) {
    return (
      <div className="container page-pad">
        <h1>Category not found</h1>
        <Link to="/">Back home</Link>
      </div>
    )
  }

  return (
    <div className="page-pad">
      <div className="container">
        <header className="category-header" style={{ borderColor: cat.color }}>
          <span className="category-pill" style={{ background: cat.color }}>
            {cat.name}
          </span>
          <h1>{cat.name}</h1>
          <p>{articles.length} stories in this section</p>
        </header>
        <div className="card-grid">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
