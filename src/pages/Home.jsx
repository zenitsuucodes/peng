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
  const latest = getLatest(12)
  const popular = getPopular(8)
  const groups = groupByCategory(4)

  return (
    <div className="page-home">
      <BreakingBar />
      <div className="container">
        <FeaturedHero article={hero} secondary={restFeatured.slice(0, 4)} />

        <div className="home-grid">
          <div className="home-main">
            <section className="block">
              <div className="block-head">
                <h2 className="section-title">Latest stories</h2>
                <span className="block-count">{allArticles.length} articles</span>
              </div>
              <div className="card-grid">
                {latest.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>

            {groups.map((g) => (
              <section className="block category-block" key={g.id}>
                <div className="block-head">
                  <h2 className="section-title">
                    <span className="cat-bar" style={{ background: g.color }} />
                    {g.name}
                  </h2>
                  <Link to={`/category/${g.id}`} className="more-link">
                    View all
                  </Link>
                </div>
                <div className="card-grid card-grid--4">
                  {g.articles.map((a) => (
                    <ArticleCard key={a.id} article={a} variant="compact" />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="home-aside">
            <RankingList articles={popular} />
            <section className="aside-box">
              <h2 className="section-title">About Peng</h2>
              <p>
                Peng is your daily feed of wildlife, ocean life, birds, pets, and the strange
                wonders of the animal kingdom — told in plain language with room for every species.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
