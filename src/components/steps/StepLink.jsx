const isValidUrl = (val) => /^https?:\/\/.+\..+/.test(val.trim())

export default function StepLink({ value, onChange }){
  const select = (type) => {
    if (type === 'custom') {
      if (value?.type !== 'custom') onChange({ type: 'custom', url: '' })
    } else {
      onChange({ type, url: null })
    }
  }

  const setUrl = (url) => onChange({ type: 'custom', url })

  const url = value?.type === 'custom' ? (value.url || '') : ''
  const showUrlError = url.length > 0 && !isValidUrl(url)

  return (
    <div>
      <div className="step-head">
        <div className="eyebrow">STEP 3 OF 6</div>
        <h2>Choose your ring's companion link.</h2>
        <p>
          Every Vibe Shift Ring ships ready to connect — touch it to any
          phone and a page opens instantly, no app needed.
        </p>
      </div>

      <div className="link-options">
        <div
          className={`link-option ${value?.type === 'affirmation' ? 'active' : ''}`}
          onClick={() => select('affirmation')}
          role="button" tabIndex={0}
          onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') select('affirmation') }}
        >
          <div className="link-icon">✨</div>
          <div className="link-body">
            <h4>Daily Affirmation</h4>
            <p>A new spoken affirmation every day — warm, personal, beautifully voiced. A moment of nourishment whenever you need it. Touch your ring, receive your affirmation.</p>
            <span className="link-tag">Included · Rotates daily</span>
          </div>
          <div className="link-check">{value?.type === 'affirmation' ? '✓' : ''}</div>
        </div>

        <div
          className={`link-option ${value?.type === 'default' ? 'active' : ''}`}
          onClick={() => select('default')}
          role="button" tabIndex={0}
          onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') select('default') }}
        >
          <div className="link-icon">🙏</div>
          <div className="link-body">
            <h4>2AM Companion · Daily Prayer</h4>
            <p>A new prayer every day — spoken in a warm, human voice. For the 2AM moments, the hard days, and the quiet Tuesdays. You are not praying alone.</p>
            <span className="link-tag">Included · Rotates daily</span>
          </div>
          <div className="link-check">{value?.type === 'default' ? '✓' : ''}</div>
        </div>

        <div
          className={`link-option ${value?.type === 'custom' ? 'active' : ''}`}
          onClick={() => select('custom')}
          role="button" tabIndex={0}
          onKeyDown={(e) => { if(e.key==='Enter'||e.key===' ') select('custom') }}
        >
          <div className="link-icon">🔗</div>
          <div className="link-body">
            <h4>Personalized Companion Link <span className="link-price">+$6.00</span></h4>
            <p>Connect to any page — your Spotify playlist, a personal prayer, a family video, anything you want your ring to open.</p>

            {value?.type === 'custom' && (
              <div className="link-url-box" onClick={(e) => e.stopPropagation()}>
                <label htmlFor="companion-url" style={{marginTop:0}}>Your link</label>
                <input
                  id="companion-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://open.spotify.com/playlist/... or any web address"
                />
                {showUrlError && (
                  <p style={{color:'#a33', fontSize:'.78rem', marginTop:6, marginBottom:0}}>
                    Please enter a full address starting with https://
                  </p>
                )}
                {!showUrlError && url && (
                  <p className="sizing-tip" style={{marginTop:6}}>
                    ✓ We'll confirm this link opens correctly before your ring ships.
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="link-check">{value?.type === 'custom' ? '✓' : ''}</div>
        </div>
      </div>
    </div>
  )
}

export { isValidUrl }
