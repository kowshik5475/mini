export default function StatusBadge({ status }) {
  const variant = status === 'Completed' ? 'completed' : 'draft'
  return (
    <span className={`badge badge--${variant}`}>
      <span className="badge__dot" />
      {status}
    </span>
  )
}
