import { Link } from 'react-router-dom'
import BreakingBar from '../components/BreakingBar'
import FeaturedHero from '../components/FeaturedHero'
import ArticleCard from '../components/ArticleCard'
import RankingList from '../components/RankingList'
import {
  getFeatured,
  getLatest,
  getPopular,
  groupByCategory,
  allArticles,
} from '../utils/articles'

export default function Home() {
  const featured = getFeatured()
  const [hero, ...restFeatured] = featured
  const latest = getLatest(10)
  const popular = getPopular(7)
  const groups = groupByCategory(6)

  return (
    <div className="page-home">
      <BreakingBar />
      <div className="container">
        <FeaturedHero article={hero} secondary={restFeatured.slice(0, 4)} />
      </div>

      <div className="container home-layout">
        <aside className="home-sidebar">
          <RankingList articles={popular} />
          <section className="aside-box aside-box--accent">
            <h2 className="section-title section-title--sm">The Peng brief</h2>
            <p>
              Sharp daily coverage of wildlife, oceans, birds, and conservation — written for
              readers who want the living world explained clearly.
            </p>
          </section>
        </aside>

        <div className="home-stream">
          <section className="block block--feed">
            <div className="block-head block-head--rule">
              <h2 className="section-title">Latest dispatch</h2>
              <span className="block-count">{allArticles.length} stories</span>
            </div>
            <div className="feed-list">
              {latest.map((a) => (
                <ArticleCard key={a.id} article={a} variant="row" />
              ))}
            </div>
          </section>

          {groups.map((g) => (
            <section className="block block--strip" key={g.id}>
              <div className="block-head block-head--rule">
                <h2 className="section-title">{g.name}</h2>
                <Link to={`/category/${g.id}`} className="more-link">
                  All {g.name.toLowerCase()} →
                </Link>
              </div>
              <div className="strip-scroll">
                {g.articles.map((a) => (
                  <ArticleCard key={a.id} article={a} variant="strip" />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
