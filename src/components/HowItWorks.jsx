const FEATURES = [
  {
    icon: '🔄',
    title: 'Spinning outer band',
    desc: "The textured outer band spins freely around the solid inner core. Smooth, silent rotation — no clicking, no noise.",
  },
  {
    icon: '✋',
    title: 'Tactile grounding',
    desc: "The physical sensation of spinning pulls your nervous system's attention to your hands — quieting the mental noise.",
  },
  {
    icon: '✨',
    title: 'Meridian Infused',
    desc: "After crafting, every ring receives our proprietary Meridian Infusion Frequency finishing process. Intention in every piece.",
  },
  {
    icon: '🔗',
    title: 'Tap to Connect',
    desc: "Touch your ring to any phone and your companion link opens instantly — a daily affirmation, a prayer, or anything you've personalized it to. No app needed.",
  },
]

export default function HowItWorks(){
  return (
    <section className="section" id="how-it-works">
      <div className="sec-head">
        <div className="eyebrow">THE RING</div>
        <h2>How it actually works.</h2>
        <p>
          Four small things working together — a spinning band, a grounding
          sensation, an infused frequency, and a connection that's always
          with you.
        </p>
      </div>
      <div className="how-grid wrap">
        {FEATURES.map(f => (
          <div key={f.title} className="how-card">
            <div className="how-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
