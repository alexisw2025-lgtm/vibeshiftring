import { useState, useRef, useEffect, useCallback } from 'react'
import { FREQUENCIES, SKEPTIC_FACTS } from '../data/frequencies'

const DEFAULT_INDEX = FREQUENCIES.findIndex(f => f.hz === 417)

export default function FrequencyDial({ selected, onSelect }){
  const [activeIdx, setActiveIdx] = useState(DEFAULT_INDEX)
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

  const handleSelect = (idx) => {
    setActiveIdx(idx)
    if (onSelect) onSelect(FREQUENCIES[idx])
  }

  const current = FREQUENCIES[activeIdx]

  return (
    <section className="section section-alt" id="frequencies">
      <div className="dial-area wrap">
        <div className="dial" ref={dialRef}>
          <div className="dial-ring"/>
          <div className="dial-ring dial-ring-inner"/>
          <div className="dial-center">
            <div className="dc-hz">{current.hz} Hz</div>
            <div className="dc-name">{current.name}</div>
            <div className="dc-desc">{current.desc}</div>
          </div>
          {FREQUENCIES.map((f, i) => (
            <div
              key={f.hz}
              className={`dial-marker ${i === activeIdx ? 'active' : ''}`}
              style={{
                left: positions[i] ? positions[i].x : '50%',
                top: positions[i] ? positions[i].y : '50%',
              }}
              onClick={() => handleSelect(i)}
              role="button"
              tabIndex={0}
              aria-label={`${f.hz} Hz — ${f.name}`}
              onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') handleSelect(i) }}
            >
              <span className="hz">{f.hz}</span>
              <span className="unit">HZ</span>
            </div>
          ))}
        </div>

        <div className="dial-copy">
          <div className="eyebrow" style={{marginBottom:16}}>THE MERIDIAN INFUSION PROCESS</div>
          <h3>Nine frequencies. One ring, infused for you.</h3>
          <p>
            Every material has a natural vibration — documented science used
            in fields from forensic plastics identification to ultrasonic
            welding. During Meridian Infusion, your ring is exposed to the
            frequency you choose: a small, physical anchor for the intention
            you carry.
          </p>
          <p>Turn the dial. Find the one that speaks to what you need most right now.</p>

          {onSelect && (
            <button
              className={`btn ${selected?.hz === current.hz ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onSelect(current)}
              style={{marginBottom: 8}}
            >
              {selected?.hz === current.hz ? 'Selected for your ring ✓' : `Choose ${current.hz} Hz for your ring`}
            </button>
          )}

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
    </section>
  )
}
