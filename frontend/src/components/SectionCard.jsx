export default function SectionCard({ index, title }) {
  return (
    <div className="card section-card">
      <span className="section-card__index">{index}</span>
      <span className="section-card__title">{title}</span>
    </div>
  )
}
