import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useLayoutEffect, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticlePage from './pages/ArticlePage'
import SearchPage from './pages/SearchPage'
import { site } from './utils/articles'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function DocumentTitle() {
  useEffect(() => {
    document.title = `${site.name} — ${site.tagline}`
  }, [])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <ScrollToTop />
        <DocumentTitle />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/article/:slug" element={<ArticlePage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
