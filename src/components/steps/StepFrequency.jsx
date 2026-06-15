import { useState, useRef, useEffect, useCallback } from 'react'
import { FREQUENCIES, SKEPTIC_FACTS } from '../../data/frequencies'

export default function StepFrequency({ value, onChange }){
  const dialRef = useRef(null)
  const [positions, setPositions] = useState([])

  const layout = useCallback(() => {
    const el = dialRef.current
    if(!el) return
    const size = el.clientWidth
    const radius = size * 0.42
    const center = size / 2
    const next = FREQUENCIES.map((f, i) => {
      const angle = (i / FREQUENCIES.length) * 2 * Math.PI - Math.PI/2
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
      }
    })
    setPositions(next)
  }, [])

  useEffect(() => {
    layout()
    window.addEventListener('resize', layout)
    return () => window.removeEventListener('resize', layout)
  }, [layout])

  const activeIdx = value ? FREQUENCIES.findIndex(f => f.hz === value.hz) : -1
  const display = value || FREQUENCIES[3] // show 417 Hz as a neutral preview before selection

  return (
    <div>
      <div className="step-head">
        <div className="eyebrow">STEP 3 OF 5</div>
        <h2>Choose your frequency.</h2>
        <p>Turn the dial — each of the nine carries a different intention.</p>
      </div>

      <div className="dial-area">
        <div className="dial" ref={dialRef}>
          <div className="dial-ring"/>
          <div className="dial-ring dial-ring-inner"/>
          <div className="dial-center">
            {value ? (
              <>
                <div className="dc-hz">{display.hz} Hz</div>
                <div className="dc-name">{display.name}</div>
                <div className="dc-desc">{display.desc}</div>
              </>
            ) : (
              <>
                <div className="dc-hz" style={{color:'var(--dust)'}}>?</div>
                <div className="dc-name" style={{color:'var(--parch)'}}>Pick a frequency</div>
                <div className="dc-desc">Tap any of the nine markers around the dial.</div>
              </>
            )}
          </div>
          {FREQUENCIES.map((f, i) => (
            <div
              key={f.hz}
              className={`dial-marker ${i === activeIdx ? 'active' : ''}`}
              style={{
                left: positions[i] ? positions[i].x : '50%',
                top: positions[i] ? positions[i].y : '50%',
              }}
              onClick={() => onChange(f)}
              role="button"
              tabIndex={0}
              aria-label={`${f.hz} Hz — ${f.name}`}
              onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') onChange(f) }}
            >
              <span className="hz">{f.hz}</span>
              <span className="unit">HZ</span>
            </div>
          ))}
        </div>

        <div className="dial-copy">
          <h3>Nine frequencies. One ring, infused for you.</h3>
          <p>
            Every material has a natural vibration — documented science used
            in fields from forensic plastics identification to ultrasonic
            welding. During Meridian Infusion, your ring is exposed to the
            frequency you choose: a small, physical anchor for the intention
            you carry.
          </p>
          <p>
            {value
              ? <>You've chosen <strong>{value.hz} Hz — {value.name}</strong>: {value.tags.toLowerCase()}.</>
              : 'Turn the dial. Find the one that speaks to what you need most right now.'}
          </p>

          <div className="skeptic">
            <div className="sk-q">&ldquo;Isn't this just plastic?&rdquo;</div>
            <p style={{marginBottom: 12}}>
              We'd ask the same question. So before we say anything else about
              intention, here's what's already true about frequency and matter:
            </p>
            {SKEPTIC_FACTS.map(f => (
              <div key={f.title} style={{marginBottom: 10}}>
                <div className="sk-fact-title">{f.title}</div>
                <p style={{fontSize: '.86rem', marginBottom: 0}}>{f.body}</p>
              </div>
            ))}
            <p style={{
              fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontWeight: 500,
              fontSize: '.95rem', color: 'var(--bark)', marginTop: 14, marginBottom: 0,
              borderTop: '1px solid var(--dust)', paddingTop: 14,
            }}>
              "Everything vibrates. Rocks. Wood. Water. Plastic. Nothing is
              inert. Meridian Infusion doesn't require an organic ring — only
              a vibrational field. All matter already has one."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
