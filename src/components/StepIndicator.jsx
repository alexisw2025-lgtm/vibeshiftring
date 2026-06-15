const STEPS = ['Design', 'Colors', 'Link', 'Frequency', 'Size', 'Your Info']

export default function StepIndicator({ current, maxReached, onJump }){
  return (
    <div className="step-indicator">
      {STEPS.map((label, i) => {
        const n = i + 1
        const state = n === current ? 'active' : n < current ? 'done' : 'todo'
        const reachable = n <= maxReached
        return (
          <div key={label} className="step-item">
            <button
              type="button"
              className={`step-dot ${state}`}
              disabled={!reachable}
              onClick={() => reachable && onJump(n)}
              aria-current={n === current ? 'step' : undefined}
              aria-label={`Step ${n}: ${label}`}
            >
              {state === 'done' ? '✓' : n}
            </button>
            <span className={`step-label ${state}`}>{label}</span>
            {i < STEPS.length - 1 && <span className="step-line"/>}
          </div>
        )
      })}
    </div>
  )
}
