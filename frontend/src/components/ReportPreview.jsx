export default function ReportPreview({ report }) {
  return (
    <div className="document-page">
      <div className="document-page__title">{report.title}</div>
      <div className="document-page__subtitle">{report.subtitle}</div>
      <div className="document-page__divider" />
      {report.sections.map((section) => (
        <div className="document-section" key={section.heading}>
          <h3>{section.heading}</h3>
          <p>{section.body}</p>
        </div>
      ))}
    </div>
  )
}
