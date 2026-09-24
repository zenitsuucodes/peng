import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { categories, site } from '../utils/articles'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  function onSearch(e) {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }

  return (
    <header className="site-header">
      <div className="container masthead-inner">
        <button
          type="button"
          className="menu-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
        <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label={`${site.name} home`}>
          <span className="brand-word" aria-hidden>
            {site.name}
          </span>
        </Link>
        <form className="search-form" onSubmit={onSearch} role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search stories"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      <nav className={`cat-nav ${open ? 'is-open' : ''}`} aria-label="Categories">
        <div className="container">
          <ul>
            <li>
              <NavLink to="/" end onClick={() => setOpen(false)}>
                Home
              </NavLink>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <NavLink to={`/category/${c.id}`} onClick={() => setOpen(false)}>
                  {c.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}
