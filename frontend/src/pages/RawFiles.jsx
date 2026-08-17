import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'
import FileUpload from '../components/FileUpload.jsx'
import { uploadRawFile } from '../services/api.js'

export default function RawFiles() {
  const [items, setItems] = useState([])
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const hasSuccess = items.some((item) => item.status === 'success')
  const isUploading = items.some((item) => item.status === 'uploading')

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Step 2 of 5</div>
          <h1>Add Your Project Materials</h1>
          <p>Upload the information and files that will be used to create your new report.</p>
        </div>
      </div>

      <StepProgress current={2} />

      <div className="card panel">
        <FileUpload
          title="Add Your Project Materials"
          description="Upload the information and files that will be used to create your new report."
          formats="DOCX • PDF • TXT • CSV • Images"
          accept=".docx,.pdf,.txt,.csv,.jpg,.jpeg,.png"
          multiple
          inputId="raw-files-input"
          uploadFn={uploadRawFile}
          onItemsChange={setItems}
        />

        <div style={{ marginTop: 28 }}>
          <label className="field-label" htmlFor="additional-info">
            Additional Project Information
          </label>
          <textarea
            id="additional-info"
            className="textarea"
            placeholder="Enter any additional information about your project..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="actions-row">
          <button
            type="button"
            className="btn btn--primary"
            disabled={!hasSuccess || isUploading}
            style={{
              opacity: hasSuccess && !isUploading ? 1 : 0.45,
              cursor: hasSuccess && !isUploading ? 'pointer' : 'not-allowed',
            }}
            onClick={() => navigate('/analysis')}
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  )
}
