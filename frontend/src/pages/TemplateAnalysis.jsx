import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StepProgress from '../components/StepProgress.jsx'
import SectionTree from '../components/SectionTree.jsx'
import { formatBytes } from '../components/FileCard.jsx'
import { analyzeTemplate, ApiError } from '../services/api.js'
import { useReportWorkflow } from '../context/ReportWorkflowContext.jsx'

const PARAGRAPH_PAGE_SIZE = 6

export default function TemplateAnalysis() {
  const { template } = useReportWorkflow()
  const navigate = useNavigate()

  const [status, setStatus] = useState('idle') // idle | analyzing | success | error
  const [analysis, setAnalysis] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [visibleParagraphs, setVisibleParagraphs] = useState(PARAGRAPH_PAGE_SIZE)

  const isDocx = template?.type === 'docx' || (template?.filename || '').toLowerCase().endsWith('.docx')

  const runAnalysis = async () => {
    if (!template) return
    setStatus('analyzing')
    setErrorMessage('')
    try {
      const result = await analyzeTemplate(template.filename)
      setAnalysis(result)
      setVisibleParagraphs(PARAGRAPH_PAGE_SIZE)
      setStatus('success')
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  // No template uploaded yet in this session.
  if (!template) {
    return (
      <div>
        <div className="page-header">
          <div>
            <div className="page-header__eyebrow">Step 3 of 5</div>
            <h1>Template Analysis</h1>
            <p>Upload a template first so it can be analyzed.</p>
          </div>
        </div>
        <StepProgress current={3} />
        <div className="card panel" style={{ textAlign: 'center' }}>
          <p className="section-subtitle" style={{ marginBottom: 20 }}>
            No template has been uploaded in this session yet.
          </p>
          <Link to="/template" className="btn btn--primary">
            Upload a Template
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Step 3 of 5</div>
          <h1>Template Analysis</h1>
          <p>Here&rsquo;s what we found in your uploaded template.</p>
        </div>
      </div>

      <StepProgress current={3} />

      <div className="card panel">
        {!isDocx && (
          <div className="analysis-banner analysis-banner--warning">
            DOCX analysis is currently supported. This file is a {(template.type || 'unknown').toUpperCase()}.
          </div>
        )}

        {isDocx && status === 'idle' && (
          <div className="analysis-banner analysis-banner--pending">
            Ready to analyze {template.originalFilename}
          </div>
        )}

        {status === 'analyzing' && (
          <div className="analysis-banner analysis-banner--pending">
            <span className="spinner" /> Analyzing document…
          </div>
        )}

        {status === 'error' && (
          <div className="analysis-banner analysis-banner--error">✕ {errorMessage}</div>
        )}

        {status === 'success' && <div className="analysis-banner">✓ Analysis completed</div>}

        <div className="section-subtitle" style={{ marginBottom: 18 }}>
          Template: <strong style={{ color: 'var(--ink)' }}>{template.originalFilename}</strong>
          {template.size !== undefined && <> &middot; {formatBytes(template.size)}</>}
        </div>

        {isDocx && status !== 'success' && (
          <div className="actions-row actions-row--split" style={{ marginTop: 0, marginBottom: 8 }}>
            <div />
            <button
              type="button"
              className="btn btn--primary"
              disabled={status === 'analyzing'}
              style={{
                opacity: status === 'analyzing' ? 0.6 : 1,
                cursor: status === 'analyzing' ? 'not-allowed' : 'pointer',
              }}
              onClick={runAnalysis}
            >
              {status === 'error' ? 'Retry Analysis' : 'Analyze Template'}
            </button>
          </div>
        )}

        {status === 'success' && analysis && (
          <>
            <div className="analysis-meta">
              <div className="card analysis-meta__item">
                <div className="analysis-meta__value">{analysis.statistics.paragraphs}</div>
                <div className="analysis-meta__label">Paragraphs</div>
              </div>
              <div className="card analysis-meta__item">
                <div className="analysis-meta__value">{analysis.statistics.headings}</div>
                <div className="analysis-meta__label">Headings</div>
              </div>
              <div className="card analysis-meta__item">
                <div className="analysis-meta__value">{analysis.statistics.tables}</div>
                <div className="analysis-meta__label">Tables</div>
              </div>
              <div className="card analysis-meta__item">
                <div className="analysis-meta__value">{analysis.statistics.images}</div>
                <div className="analysis-meta__label">Images</div>
              </div>
            </div>

            <div className="section-title">Document Structure</div>
            <div className="section-subtitle">
              {analysis.title ? (
                <>
                  Detected title: <strong style={{ color: 'var(--ink)' }}>{analysis.title}</strong>
                </>
              ) : (
                'No document title could be confidently detected.'
              )}
            </div>
            <div className="card" style={{ padding: '20px 24px', marginBottom: 32 }}>
              <SectionTree structure={analysis.structure} />
            </div>

            <div className="section-title">Tables Detected</div>
            <div className="section-subtitle">
              {analysis.tables.length === 0
                ? 'No tables were found in this document.'
                : `${analysis.tables.length} table${analysis.tables.length === 1 ? '' : 's'} found.`}
            </div>
            {analysis.tables.length > 0 && (
              <div className="table-grid">
                {analysis.tables.map((t) => (
                  <div className="card table-summary" key={t.index}>
                    <div className="table-summary__title">Table {t.index + 1}</div>
                    <div className="table-summary__dims">
                      {t.rows} rows × {t.columns} columns
                    </div>
                    {t.headers.length > 0 && (
                      <div className="table-summary__headers">
                        {t.headers.filter(Boolean).join(' | ') || '—'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="section-title" style={{ marginTop: 32 }}>
              Images Detected
            </div>
            <div className="section-subtitle">
              {analysis.images.length === 0
                ? 'No images were found in this document.'
                : `${analysis.images.length} image${analysis.images.length === 1 ? '' : 's'} found.`}
            </div>
            {analysis.images.length > 0 && (
              <div className="image-list">
                {analysis.images.map((img) => (
                  <div className="card image-list__item" key={img.index}>
                    <span>Image {img.index + 1}</span>
                    <span className="image-list__type">{(img.type || 'unknown').toUpperCase()}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="section-title" style={{ marginTop: 32 }}>
              Paragraph Content
            </div>
            <div className="section-subtitle">A preview of the extracted text, in document order.</div>
            <div className="paragraph-preview">
              {analysis.paragraphs.slice(0, visibleParagraphs).map((p, i) => (
                <div className="paragraph-preview__item" key={i}>
                  {p.style && p.style.startsWith('Heading') || p.style === 'Title' ? (
                    <div className="paragraph-preview__heading">{p.text}</div>
                  ) : (
                    <p className="paragraph-preview__text">{p.text}</p>
                  )}
                </div>
              ))}
            </div>
            {visibleParagraphs < analysis.paragraphs.length && (
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                style={{ marginTop: 12 }}
                onClick={() => setVisibleParagraphs((n) => n + PARAGRAPH_PAGE_SIZE)}
              >
                Show More
              </button>
            )}

            <div className="actions-row">
              <button type="button" className="btn btn--primary" onClick={() => navigate('/mapping')}>
                Continue to Content Mapping →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
