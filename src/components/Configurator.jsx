import { useState } from 'react'
import { RING_SIZES, CUSTOM_DESIGN } from '../data/rings'

const RAILWAY_URL = 'https://web-production-4c84.up.railway.app'

export default function Configurator({ design, frequency, onSizeChange, size }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', shipTo:'', notes:'' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const isCustom = design?.id === 'custom'
  const canSubmit = !!design && !!frequency && !!size && form.name.trim() && form.email.trim()
    && (!isCustom || form.notes.trim())

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!canSubmit || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(`${RAILWAY_URL}/ring-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: design?.name,
          designId: design?.id,
          price: design?.price,
          frequency: `${frequency?.hz} Hz — ${frequency?.name}`,
          size,
          customer: form,
        }),
      })
      if(!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  if(status === 'success'){
    return (
      <section className="section section-alt" id="reserve">
        <div className="wrap">
          <div className="reserve-success">
            <div className="eyebrow" style={{marginBottom:16}}>YOUR RITUAL IS WAITING</div>
            <h2>Request received.</h2>
            <p>
              Thank you, {form.name.split(' ')[0]}. We've received your ring
              request and will be in touch at <strong>{form.email}</strong> to
              confirm pricing and timeline before we begin your Meridian
              Infusion process.
            </p>
            <a href="https://chaiholistic.com" className="btn btn-primary" style={{marginTop:24}}>
              Continue to chaiholistic.com
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-alt" id="reserve">
      <div className="sec-head">
        <div className="eyebrow">RESERVE YOUR RING</div>
        <h2>Bring it all together.</h2>
        <p>
          Confirm your design, frequency, and size below, then leave your
          details. We'll follow up to confirm pricing and timeline before
          your ring is made.
        </p>
      </div>

      <div className="reserve-grid wrap">
        <div className="reserve-summary">
          <h4>Your selections</h4>

          <div className="summary-row">
            <span className="summary-label">Design</span>
            <span className="summary-value">
              {design ? design.name : <span className="summary-empty">Choose a design above</span>}
              {design?.price ? ` — $${design.price}` : ''}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Frequency</span>
            <span className="summary-value">
              {frequency ? `${frequency.hz} Hz · ${frequency.name}` : <span className="summary-empty">Choose a frequency above</span>}
            </span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Size</span>
            <span className="summary-value">
              {size ? `US ${size}` : <span className="summary-empty">Select below</span>}
            </span>
          </div>

          <div className="size-grid">
            {RING_SIZES.map(s => (
              <button
                key={s}
                type="button"
                className={`size-btn ${size === s ? 'active' : ''}`}
                onClick={() => onSizeChange(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="sizing-tip" style={{marginTop:10}}>
            Not sure? See the <a href="#sizing">sizing guide</a> above.
          </p>
        </div>

        <form className="reserve-form" onSubmit={handleSubmit}>
          <h4>Your information</h4>

          <div className="form-row">
            <div>
              <label htmlFor="name">Name</label>
              <input id="name" required value={form.name} onChange={update('name')}/>
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update('email')}/>
            </div>
          </div>

          <div className="form-row">
            <div>
              <label htmlFor="phone">Phone</label>
              <input id="phone" value={form.phone} onChange={update('phone')}/>
            </div>
            <div>
              <label htmlFor="shipTo">Ship to <span className="optional">(only if mailed)</span></label>
              <input id="shipTo" value={form.shipTo} onChange={update('shipTo')}/>
            </div>
          </div>

          <label htmlFor="notes">
            {isCustom ? 'Describe your custom design' : 'Notes (optional)'}
          </label>
          <textarea
            id="notes"
            required={isCustom}
            placeholder={isCustom ? 'Colors, patterns, anything else we should know…' : 'An intention, a gift recipient, a special date…'}
            value={form.notes}
            onChange={update('notes')}
          />

          <button type="submit" className="btn btn-primary" disabled={!canSubmit || status==='sending'} style={{marginTop:18, width:'100%'}}>
            {status === 'sending' ? 'Sending…' : 'Request This Ring'}
          </button>

          {status === 'error' && (
            <p style={{color:'#a33', fontSize:'.85rem', marginTop:10}}>
              Something went wrong sending your request — please try again, or
              email us directly.
            </p>
          )}

          <p style={{fontSize:'.78rem', color:'var(--muted)', marginTop:14}}>
            No payment is collected here. We'll confirm pricing and timeline
            with you directly before your ring is made.
          </p>
        </form>
      </div>
    </section>
  )
}
