import { useNavigate } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'
import ReportPreview from '../components/ReportPreview.jsx'
import { generatedReport } from '../data/mockData.js'

export default function ReportPreviewPage() {
  const navigate = useNavigate()

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Step 5 of 5</div>
          <h1>Generated Report</h1>
          <p>This is a preview of your report, structured to match the uploaded template.</p>
        </div>
      </div>

      <StepProgress current={5} />

      <div className="preview-toolbar">
        <button type="button" className="btn btn--ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="preview-toolbar__actions">
          <button type="button" className="btn btn--secondary">
            Edit
          </button>
          <button type="button" className="btn btn--secondary">
            Regenerate
          </button>
          <button type="button" className="btn btn--primary">
            Download DOCX
          </button>
        </div>
      </div>

      <ReportPreview report={generatedReport} />
    </div>
  )
}
