import HandIcon from './HandIcon'
import { SIZE_CHART } from '../data/rings'

export default function SizingGuide(){
  return (
    <section className="section" id="sizing">
      <div className="sec-head">
        <div className="eyebrow">BEFORE YOU CHOOSE</div>
        <h2>Find your ring size at home.</h2>
        <p>
          No ring sizer? No problem. Here are two simple ways to find your
          size right now, using things you already have.
        </p>
      </div>

      <div className="sizing-grid wrap">
        <div className="sizing-card">
          <h4>The string or paper strip method</h4>
          <ol>
            <li>Wrap a thin strip of paper or a piece of string snugly around the base of the finger you plan to wear the ring on.</li>
            <li>Mark where the ends meet, then lay it flat against a ruler.</li>
            <li>Measure the length in millimeters — this is your finger's circumference.</li>
            <li>Match that number to the chart below.</li>
          </ol>
          <p className="sizing-tip">
            Tip: measure at the end of the day, when fingers are slightly
            larger, and make sure the strip is snug but not tight.
          </p>
        </div>

        <div className="sizing-card">
          <h4>The ring-you-already-own method</h4>
          <ol>
            <li>Find a ring that already fits the finger you plan to wear your Vibe Shift Ring on.</li>
            <li>Place it on a ruler and measure the <strong>inside diameter</strong> (edge to edge through the center).</li>
            <li>Match that measurement to the chart below.</li>
          </ol>
          <p className="sizing-tip">
            Tip: a kitchen ruler, sewing tape measure, or a printed mm ruler
            from your phone screen all work well for this.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="size-chart">
          <div className="size-chart-row size-chart-header">
            <div>US Size</div>
            {SIZE_CHART.map(s => <div key={s.size}>{s.size}</div>)}
          </div>
          <div className="size-chart-row">
            <div>Diameter</div>
            {SIZE_CHART.map(s => <div key={s.size}>{s.mm} mm</div>)}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="finger-tip">
          <HandIcon size={140}/>
          <div>
            <h4 style={{marginBottom:8}}>Where to wear it</h4>
            <p>
              We've found the <strong>left hand pointer (index) finger</strong> works
              best — easy to reach for spinning, out of the way day-to-day.
              Of course, wear it wherever feels most natural to you.
            </p>
            <p className="finger-quote">A hand of every color, a ring for every story.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
