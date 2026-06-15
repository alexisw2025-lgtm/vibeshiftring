import { useState } from 'react'
import { useShopify, shopifyIsConfigured, ringVariantMapped } from '../../useShopify'

const RAILWAY_URL = 'https://chai-api-production.up.railway.app'

export default function StepInfo({ order, form, onFormChange, status, onSubmit }){
  const { design, outerColor, innerColor, companionLink, frequency, size } = order
  const isCustom = design?.id === 'custom'
  const isAsShown = outerColor?.asShown

  const { configured, loading: shopifyLoading, error: shopifyError, addRingToCart, goToCheckout } = useShopify()
  const [shopifyStatus, setShopifyStatus] = useState('idle') // idle | loading | error

  const canShopifyCheckout = !isCustom && shopifyIsConfigured() && ringVariantMapped(design?.name)

  const update = (field) => (e) => onFormChange({ ...form, [field]: e.target.value })

  const linkLabel = companionLink?.type === 'affirmation'
    ? 'Daily Affirmation (Included)'
    : companionLink?.type === 'default'
      ? '2AM Companion Prayer (Included)'
      : companionLink?.type === 'custom'
        ? `Personalized Link — ${companionLink.url} (+$6.00)`
        : ''

  const linkSurcharge = companionLink?.type === 'custom' ? 6 : 0
  const totalPrice = (design?.price || 0) + linkSurcharge

  const colorsLabel = isAsShown
    ? 'As shown in photos'
    : isCustom
      ? (outerColor ? `${outerColor.name} / ${innerColor?.name || outerColor.name}` : 'See notes')
      : `${outerColor?.name} outer · ${innerColor?.name} inner`

  const buildAttributes = () => {
    const attrs = [
      { key: 'Colors', value: colorsLabel },
      { key: 'Companion Link', value: linkLabel },
      { key: 'Frequency', value: `${frequency?.hz} Hz — ${frequency?.name}` },
      { key: 'Ring Size (US)', value: String(size) },
    ]
    if (form.notes?.trim()) attrs.push({ key: 'Notes', value: form.notes.trim() })
    if (form.shipTo?.trim()) attrs.push({ key: 'Ship to', value: form.shipTo.trim() })
    return attrs
  }

  const handleShopifyCheckout = async () => {
    setShopifyStatus('loading')
    const url = await addRingToCart(design.name, buildAttributes())
    if (url) {
      goToCheckout(url)
    } else {
      setShopifyStatus('error')
    }
  }

  if(status === 'success'){
    return (
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
    )
  }

  return (
    <div>
      <div className="step-head">
        <div className="eyebrow">STEP 6 OF 6</div>
        <h2>Bring it all together.</h2>
        <p>Confirm your selections, then check out securely on chaiholistic.com.</p>
      </div>

      <div className="reserve-grid">
        <div className="reserve-summary">
          <h4>Your selections</h4>

          <div className="summary-row">
            <span className="summary-label">Design</span>
            <span className="summary-value">{design?.name}{design?.price ? ` — $${design.price}` : ''}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Colors</span>
            <span className="summary-value">{colorsLabel}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Companion Link</span>
            <span className="summary-value">{linkLabel}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Frequency</span>
            <span className="summary-value">{frequency?.hz} Hz · {frequency?.name}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Size</span>
            <span className="summary-value">US {size}</span>
          </div>

          {canShopifyCheckout && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                style={{marginTop:24, width:'100%'}}
                onClick={handleShopifyCheckout}
                disabled={shopifyLoading}
              >
                {shopifyLoading ? 'Preparing checkout…' : `Checkout — $${totalPrice}`}
              </button>
              <p style={{fontSize:'.78rem', color:'var(--muted)', marginTop:10, marginBottom:0}}>
                You'll complete payment securely on chaiholistic.com.
                Your colors, companion link, frequency, and size are included with the order.
                {linkSurcharge > 0 && ' The $6 personalized link add-on is included in this total.'}
              </p>
              {shopifyStatus === 'error' && (
                <p style={{color:'#a33', fontSize:'.85rem', marginTop:10}}>
                  {shopifyError || 'Something went wrong starting checkout — please try again.'}
                </p>
              )}
            </>
          )}

          {!canShopifyCheckout && !isCustom && (
            <p style={{fontSize:'.78rem', color:'var(--muted)', marginTop:24, marginBottom:0}}>
              Online checkout for this design is being set up. Send a
              request below and we'll follow up to arrange payment.
            </p>
          )}
        </div>

        <form className="reserve-form" onSubmit={onSubmit}>
          <h4>{canShopifyCheckout ? 'Prefer we contact you first?' : 'Your information'}</h4>

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
            required={isCustom && !form.notes.trim()}
            placeholder={isCustom ? 'Colors, patterns, anything else we should know…' : 'An intention, a gift recipient, a special date…'}
            value={form.notes}
            onChange={update('notes')}
          />

          <button type="submit" className={`btn ${canShopifyCheckout ? 'btn-ghost' : 'btn-primary'}`} disabled={status==='sending'} style={{marginTop:18, width:'100%'}}>
            {status === 'sending' ? 'Sending…' : 'Request This Ring'}
          </button>

          {status === 'error' && (
            <p style={{color:'#a33', fontSize:'.85rem', marginTop:10}}>
              Something went wrong sending your request — please try again, or
              email us directly.
            </p>
          )}

          <p style={{fontSize:'.78rem', color:'var(--muted)', marginTop:14}}>
            {canShopifyCheckout
              ? "No payment is collected here — we'll reach out to arrange next steps."
              : "No payment is collected here. We'll confirm pricing and timeline with you directly before your ring is made."}
          </p>
        </form>
      </div>
    </div>
  )
}

export { RAILWAY_URL }
