export default function MappingCard({ section, source }) {
  return (
    <div className="card mapping-card">
      <div>
        <div className="mapping-card__target-label">Template section</div>
        <div className="mapping-card__target">{section}</div>
      </div>
      <div className="mapping-card__arrow">←</div>
      <div className="mapping-card__source">{source}</div>
    </div>
  )
}
