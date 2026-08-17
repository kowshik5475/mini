import { Link } from 'react-router-dom'

const workflow = [
  { title: 'Upload Template', desc: 'Give it a report you already trust the structure of.' },
  { title: 'Add Your Content', desc: 'Drop in your raw files, data, and project notes.' },
  { title: 'AI Maps Content', desc: 'Your material is matched to the template\u2019s sections.' },
  { title: 'Generate Report', desc: 'Review and export a fully structured document.' },
]

export default function Home() {
  return (
    <div>
      <section className="hero">
        <span className="hero__eyebrow">Template-guided report writing</span>
        <h1>AI Report Generator</h1>
        <p>
          Transform your raw project information into structured reports using an existing
          report template.
        </p>
        <div className="hero__actions">
          <Link to="/create" className="btn btn--primary">
            Create New Report
          </Link>
          <Link to="/dashboard" className="btn btn--secondary">
            View Dashboard
          </Link>
        </div>
      </section>

      <section className="workflow-strip">
        <div className="workflow-strip__title">How it works</div>
        <div className="workflow-strip__row">
          {workflow.map((step, i) => (
            <div key={step.title} style={{ display: 'flex', alignItems: 'center' }}>
              <div className="workflow-node">
                <div className="workflow-node__index">0{i + 1}</div>
                <div className="workflow-node__title">{step.title}</div>
                <div className="workflow-node__desc">{step.desc}</div>
              </div>
              {i < workflow.length - 1 && <div className="workflow-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        AI Report Generator &mdash; Phase 1 prototype. No files are processed by an AI model yet.
      </footer>
    </div>
  )
}
