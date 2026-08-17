const STEPS = [
  { id: 1, label: 'Template' },
  { id: 2, label: 'Raw Files' },
  { id: 3, label: 'Analysis' },
  { id: 4, label: 'Mapping' },
  { id: 5, label: 'Preview' },
]

export default function StepProgress({ current }) {
  return (
    <div className="step-progress">
      {STEPS.map((step, i) => {
        const isDone = step.id < current
        const isActive = step.id === current
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`step-item ${isDone ? 'step-item--done' : ''} ${
                isActive ? 'step-item--active' : ''
              }`}
            >
              <span className="step-item__circle">{isDone ? '✓' : step.id}</span>
              <span className="step-item__label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <span className={`step-connector ${isDone ? 'step-connector--done' : ''}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
