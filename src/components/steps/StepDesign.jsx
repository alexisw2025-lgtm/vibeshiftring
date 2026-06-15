import { RINGS, CUSTOM_DESIGN } from '../../data/rings'

export default function StepDesign({ value, onChange }){
  const allDesigns = [...RINGS, CUSTOM_DESIGN]

  return (
    <div>
      <div className="step-head">
        <div className="eyebrow">STEP 1 OF 5</div>
        <h2>Choose your design.</h2>
        <p>Each ring is hand-finished and infused to order — made just for you.</p>
      </div>
      <div className="gallery">
        {allDesigns.map(r => {
          const isSelected = value?.id === r.id
          return (
            <div
              key={r.id}
              className={`card ${isSelected ? 'card-selected' : ''}`}
              onClick={() => onChange(r)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') onChange(r) }}
            >
              <div className="card-photo">
                {r.photo
                  ? <img src={r.photo} alt={r.name}/>
                  : (
                    <div className="card-photo-custom">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8L12 3z"/>
                        <path d="M19 14l.9 2.3L22 17.2l-2.1.9L19 20.4l-.9-2.3L16 17.2l2.1-.9L19 14z"/>
                      </svg>
                    </div>
                  )
                }
              </div>
              <h4>{r.name}</h4>
              <div className="tagline">{r.tagline}</div>
              <div className="price">{r.price ? `$${r.price}` : 'Ask'}</div>
              <p className="card-desc">{r.desc}</p>
              <div className="card-cta">{isSelected ? 'Selected ✓' : 'Select this design'}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
