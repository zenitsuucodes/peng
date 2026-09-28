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
      <div className="header-top">
        <div className="container header-top-inner">
          <span className="header-edition">Animal news · Daily</span>
          <span className="header-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
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
          <img src="/logo.svg" alt={site.name} className="brand-logo" width={132} height={40} />
        </Link>
        <form className="search-form" onSubmit={onSearch} role="search">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the archive…"
            aria-label="Search stories"
          />
          <button type="submit">Go</button>
        </form>
      </div>
      <nav className={`cat-nav ${open ? 'is-open' : ''}`} aria-label="Categories">
        <div className="container">
          <ul>
            <li>
              <NavLink to="/" end onClick={() => setOpen(false)}>
                Front page
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
