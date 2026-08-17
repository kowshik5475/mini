import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'
import FileUpload from '../components/FileUpload.jsx'
import { uploadTemplate } from '../services/api.js'
import { useReportWorkflow } from '../context/ReportWorkflowContext.jsx'

export default function TemplateUpload() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  const { setTemplate } = useReportWorkflow()

  const hasSuccess = items.some((item) => item.status === 'success')
  const isUploading = items.some((item) => item.status === 'uploading')

  const handleItemsChange = (nextItems) => {
    setItems(nextItems)
    const success = [...nextItems].reverse().find((item) => item.status === 'success')
    if (success?.result) {
      setTemplate({
        filename: success.result.filename,
        originalFilename: success.result.original_filename || success.name,
        size: success.result.size,
        type: success.result.type,
      })
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Step 1 of 5</div>
          <h1>Upload Sample Report</h1>
          <p>Upload a report that you want to use as a structural template.</p>
        </div>
      </div>

      <StepProgress current={1} />

      <div className="card panel">
        <FileUpload
          title="Upload Sample Report"
          description="Upload a report that you want to use as a structural template."
          formats="DOCX • PDF"
          accept=".docx,.pdf"
          inputId="template-input"
          uploadFn={uploadTemplate}
          onItemsChange={handleItemsChange}
        />

        <div className="actions-row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={!hasSuccess || isUploading}
            style={{
              opacity: hasSuccess && !isUploading ? 1 : 0.45,
              cursor: hasSuccess && !isUploading ? 'pointer' : 'not-allowed',
            }}
            onClick={() => navigate('/files')}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
