import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { stats, recentReports } from '../data/mockData.js'

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Overview</div>
          <h1>Welcome to AI Report Generator</h1>
          <p>Track your reports and jump back into your workflow.</p>
        </div>
        <Link to="/create" className="btn btn--primary">
          + Create New Report
        </Link>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.id} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="section-title">Recent Reports</div>
      <div className="section-subtitle">Your most recently created and edited reports.</div>

      <div className="card report-table">
        <div className="report-row report-row--head">
          <span>Report Name</span>
          <span>Status</span>
          <span>Date</span>
        </div>
        {recentReports.map((r) => (
          <div className="report-row" key={r.id}>
            <span className="report-row__name">{r.name}</span>
            <StatusBadge status={r.status} />
            <span className="report-row__date">{r.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
