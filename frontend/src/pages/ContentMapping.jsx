import { Link } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'
import MappingCard from '../components/MappingCard.jsx'
import { contentMappings } from '../data/mockData.js'

export default function ContentMapping() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Step 4 of 5</div>
          <h1>Content Mapping</h1>
          <p>Review how your project information will be organized in the report.</p>
        </div>
      </div>

      <StepProgress current={4} />

      <div className="card panel">
        <div className="mapping-list">
          {contentMappings.map((m) => (
            <MappingCard key={m.section} section={m.section} source={m.source} />
          ))}
        </div>

        <div className="actions-row">
          <Link to="/preview" className="btn btn--primary">
            Generate Report →
          </Link>
        </div>
      </div>
    </div>
  )
}
