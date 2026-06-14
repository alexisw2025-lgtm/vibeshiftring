import { RINGS, CUSTOM_DESIGN } from '../data/rings'

export default function Gallery({ selected, onSelect }){
  const allDesigns = [...RINGS, CUSTOM_DESIGN]

  return (
    <section className="section" id="collection">
      <div className="sec-head">
        <div className="eyebrow">THE COLLECTION</div>
        <h2>Six designs. One ritual.</h2>
        <p>
          Each ring is hand-finished and infused to order — made just for
          you, in the design, frequency, and size you choose.
        </p>
      </div>
      <div className="gallery wrap">
        {allDesigns.map(r => {
          const isSelected = selected?.id === r.id
          return (
            <div
              key={r.id}
              className={`card ${isSelected ? 'card-selected' : ''}`}
              onClick={() => onSelect && onSelect(r)}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
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
              {onSelect && (
                <div className="card-cta">
                  {isSelected ? 'Selected ✓' : 'Select for your ring →'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
