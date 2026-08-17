import { Link } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'

export default function CreateReport() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">New Report</div>
          <h1>Create a New Report</h1>
          <p>Follow the steps below to turn your project files into a structured report.</p>
        </div>
      </div>

      <StepProgress current={1} />

      <div className="card intro-card">
        <div className="intro-card__text">
          <h2>Start with a template</h2>
          <p>
            First, upload a sample report whose structure you want your new report to follow.
            We&rsquo;ll analyze its sections next.
          </p>
        </div>
        <Link to="/template" className="btn btn--primary">
          Continue →
        </Link>
      </div>
    </div>
  )
}
