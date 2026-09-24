import { Link } from 'react-router-dom'

export default function RankingList({ articles }) {
  return (
    <section className="ranking-box">
      <h2 className="section-title">Most read</h2>
      <ol className="ranking-list">
        {articles.map((a, i) => (
          <li key={a.id}>
            <span className="rank-num">{i + 1}</span>
            <Link to={`/article/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ol>
    </section>
  )
}
