import { useState } from 'react'
import StepIndicator from './StepIndicator'
import StepDesign from './steps/StepDesign'
import StepColors from './steps/StepColors'
import StepLink from './steps/StepLink'
import StepFrequency from './steps/StepFrequency'
import StepSize from './steps/StepSize'
import StepInfo, { RAILWAY_URL } from './steps/StepInfo'
import { isValidUrl } from './steps/StepLink'

const TOTAL_STEPS = 6
const initialForm = { name:'', email:'', phone:'', shipTo:'', notes:'' }

export default function Wizard(){
  const [step, setStep] = useState(1)
  const [maxReached, setMaxReached] = useState(1)

  const [design, setDesign] = useState(null)
  const [outerColor, setOuterColor] = useState(null)
  const [innerColor, setInnerColor] = useState(null)
  const [companionLink, setCompanionLink] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [size, setSize] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const isCustom = design?.id === 'custom'

  const canAdvance = {
    1: !!design,
    2: isCustom ? true : (!!outerColor && !!innerColor),
    3: !!companionLink && (companionLink.type !== 'custom' || isValidUrl(companionLink.url || '')),
    4: !!frequency,
    5: !!size,
    6: false, // final step advances via form submit / checkout, not Next
  }[step]

  const goTo = (n) => {
    if(n <= maxReached){
      setStep(n)
      scrollToTop()
    }
  }

  const next = () => {
    if(!canAdvance) return
    const n = Math.min(step + 1, TOTAL_STEPS)
    setStep(n)
    setMaxReached(m => Math.max(m, n))
    scrollToTop()
  }

  const back = () => {
    setStep(s => Math.max(s - 1, 1))
    scrollToTop()
  }

  const scrollToTop = () => {
    const el = document.getElementById('configurator')
    if(el){
      setTimeout(() => el.scrollIntoView({ behavior:'smooth', block:'start' }), 30)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(`${RAILWAY_URL}/ring-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: design?.name ?? '',
          designId: design?.id ?? '',
          price: design?.price ?? null,
          colors: outerColor?.asShown
            ? 'As shown in photos'
            : isCustom
              ? (form.notes ? 'See notes' : 'Custom — see notes')
              : `${outerColor?.name ?? '—'} outer / ${innerColor?.name ?? '—'} inner`,
          companionLink: companionLink
            ? { type: companionLink.type, url: companionLink.url ?? null, verified: null, attempts: null }
            : null,
          frequency: frequency
            ? `${frequency.hz} Hz — ${frequency.name}`
            : '',
          size: size ? parseInt(size, 10) : 0,
          customer: {
            name: form.name ?? '',
            email: form.email ?? '',
            phone: form.phone ?? '',
            shipTo: form.shipTo ?? '',
            notes: form.notes ?? '',
          },
        }),
      })
      if(!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <section className="section section-alt" id="configurator">
      <div className="wrap">
        <StepIndicator current={step} maxReached={maxReached} onJump={goTo}/>

        {step === 1 && <StepDesign value={design} onChange={(d) => { setDesign(d); if(d.id!=='custom'){ setOuterColor(null); setInnerColor(null);} }}/>}
        {step === 2 && <StepColors design={design} outerColor={outerColor} innerColor={innerColor} onChangeOuter={setOuterColor} onChangeInner={setInnerColor}/>}
        {step === 3 && <StepLink value={companionLink} onChange={setCompanionLink}/>}
        {step === 4 && <StepFrequency value={frequency} onChange={setFrequency}/>}
        {step === 5 && <StepSize value={size} onChange={setSize}/>}
        {step === 6 && (
          <StepInfo
            order={{ design, outerColor, innerColor, companionLink, frequency, size }}
            form={form}
            onFormChange={setForm}
            status={status}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {status !== 'success' && (
        <div className="wizard-nav-bar">
          <div className="wrap wizard-nav">
            <button type="button" className="btn btn-ghost" onClick={back} disabled={step === 1}>
              ← Back
            </button>
            {step < TOTAL_STEPS && (
              <button type="button" className={`btn btn-primary ${canAdvance ? 'pulse' : ''}`} onClick={next} disabled={!canAdvance}>
                {step === TOTAL_STEPS - 1 ? 'Finish →' : 'Next →'}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
