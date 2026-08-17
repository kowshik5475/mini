import { Link, useLocation } from 'react-router-dom'

const mainLinks = [{ to: '/dashboard', label: 'Dashboard' }]

const workflowLinks = [
  { to: '/create', label: 'Create report' },
  { to: '/template', label: 'Upload template' },
  { to: '/files', label: 'Upload raw files' },
  { to: '/analysis', label: 'Template analysis' },
  { to: '/mapping', label: 'Content mapping' },
  { to: '/preview', label: 'Report preview' },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  const renderLink = ({ to, label }) => (
    <Link
      key={to}
      to={to}
      className={`sidebar__link ${pathname === to ? 'sidebar__link--active' : ''}`}
    >
      <span className="sidebar__dot" />
      {label}
    </Link>
  )

  return (
    <aside className="sidebar">
      <div className="sidebar__label">Overview</div>
      {mainLinks.map(renderLink)}
      <div className="sidebar__label" style={{ marginTop: 24 }}>
        Report workflow
      </div>
      {workflowLinks.map(renderLink)}
    </aside>
  )
}
