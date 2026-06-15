import { RING_COLORS, AS_SHOWN } from '../../data/colors'

export default function StepColors({ design, outerColor, innerColor, onChangeOuter, onChangeInner }){
  const isCustom = design?.id === 'custom'
  const isAsShown = outerColor?.asShown

  const pickAsShown = () => {
    onChangeOuter(AS_SHOWN)
    onChangeInner(AS_SHOWN)
  }

  return (
    <div>
      <div className="step-head">
        <div className="eyebrow">STEP 2 OF 5</div>
        <h2>Choose your colors.</h2>
        <p>
          Pick a band color for the outer ring and the inner band — or keep
          {design?.name ? ` ${design.name} ` : ' '}exactly as shown in the gallery.
        </p>
      </div>

      {isCustom && (
        <div className="skeptic" style={{marginBottom: 32}}>
          <div className="sk-q">Designing something custom?</div>
          <p style={{marginBottom:0}}>
            Pick a starting palette below if it helps, or skip ahead — you'll
            have a chance to describe your full color vision in the notes on
            the last step.
          </p>
        </div>
      )}

      <div className="color-preview-row">
        <div className="color-preview-ring">
          <div className="cpr-outer" style={{ background: isAsShown || !outerColor ? 'var(--dust)' : outerColor.hex }}/>
          <div className="cpr-inner" style={{ background: isAsShown || !innerColor ? 'var(--gold-p)' : innerColor.hex }}/>
        </div>
        <div>
          <button type="button" className={`btn ${isAsShown ? 'btn-primary' : 'btn-ghost'}`} onClick={pickAsShown}>
            {isAsShown ? 'Using colors as shown ✓' : 'Use colors as shown in photos'}
          </button>
          <p style={{fontSize:'.82rem', color:'var(--muted)', marginTop:10, marginBottom:0}}>
            Or choose your own outer and inner band colors below.
          </p>
        </div>
      </div>

      <div className="color-section">
        <div className="color-section-label">
          Outer band {outerColor && !isAsShown && <span className="color-section-value">— {outerColor.name}</span>}
        </div>
        <div className="color-grid">
          {RING_COLORS.map(col => (
            <button
              type="button"
              key={col.name + 'o'}
              className={`color-swatch ${outerColor?.name === col.name && !isAsShown ? 'active' : ''}`}
              onClick={() => onChangeOuter(col)}
            >
              <span className="swatch-circle" style={{ background: col.hex }}/>
              <span className="swatch-name">{col.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-section-label" style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
          <span>
            Inner band {innerColor && !isAsShown && <span className="color-section-value">— {innerColor.name}</span>}
          </span>
          <button
            type="button"
            className="btn-text"
            style={{fontSize:'.7rem'}}
            disabled={!outerColor || isAsShown}
            onClick={() => onChangeInner(outerColor)}
          >
            Same as outer
          </button>
        </div>
        <div className="color-grid">
          {RING_COLORS.map(col => (
            <button
              type="button"
              key={col.name + 'i'}
              className={`color-swatch ${innerColor?.name === col.name && !isAsShown ? 'active' : ''}`}
              onClick={() => onChangeInner(col)}
            >
              <span className="swatch-circle" style={{ background: col.hex }}/>
              <span className="swatch-name">{col.name}</span>
            </button>
          ))}
        </div>
      </div>

      {outerColor && innerColor && !isAsShown && outerColor.name === innerColor.name && (
        <p className="sizing-tip">✓ Solid {outerColor.name} — both bands matching.</p>
      )}
    </div>
  )
}
