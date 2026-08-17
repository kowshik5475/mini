const ICONS = {
  docx: '📄',
  pdf: '📄',
  csv: '📊',
  txt: '📝',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
}

export function formatBytes(bytes) {
  if (bytes === 0 || bytes === undefined || bytes === null) return '0 KB'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  const precision = unitIndex === 0 ? 0 : 1
  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

function extensionFromName(name = '') {
  const parts = name.split('.')
  return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

/**
 * status: 'uploading' | 'success' | 'error'
 * size: bytes (number) -- formatted internally
 */
export default function FileCard({ name, size, status = 'success', errorMessage, kind }) {
  const icon = ICONS[kind || extensionFromName(name)] || '📄'

  return (
    <div className={`card file-card file-card--${status}`}>
      <div className="file-card__icon">{icon}</div>
      <div className="file-card__info">
        <div className="file-card__name">{name}</div>
        {status === 'uploading' && (
          <div className="progress-track">
            <div className="progress-track__fill" />
          </div>
        )}
        {status === 'error' && (
          <div className="file-card__meta file-card__meta--error">{errorMessage}</div>
        )}
        {status === 'success' && <div className="file-card__meta">{formatBytes(size)}</div>}
      </div>
      {status === 'uploading' && (
        <div className="file-card__status file-card__status--pending">Uploading…</div>
      )}
      {status === 'success' && <div className="file-card__status">✓ Uploaded</div>}
      {status === 'error' && <div className="file-card__status file-card__status--error">✕ Failed</div>}
    </div>
  )
}
