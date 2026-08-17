import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__mark">R</span>
        AI Report Generator
      </Link>
      <nav className="navbar__links">
        <Link
          to="/"
          className={`navbar__link ${location.pathname === '/' ? 'navbar__link--active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className={`navbar__link ${location.pathname === '/dashboard' ? 'navbar__link--active' : ''}`}
        >
          Dashboard
        </Link>
        <Link to="/create" className="btn btn--primary btn--sm">
          + Create New Report
        </Link>
      </nav>
    </header>
  )
}
