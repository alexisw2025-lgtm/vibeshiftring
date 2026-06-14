import { GROUP_PHOTO } from '../data/rings'

export default function Hero(){
  return (
    <section className="hero wrap">
      <div>
        <div className="eyebrow" style={{marginBottom:22}}>WEARABLE INTENTION &middot; MERIDIAN INFUSION</div>
        <h1 className="hero-h1">Spin your<br/><em>focus</em> back.</h1>
        <p className="hero-p">
          Precision-engineered fidget rings, hand-finished and infused with one
          of nine sacred frequencies during our Meridian Infusion process.
          Made to order, one ring at a time.
        </p>
        <div className="hero-ctas">
          <a href="#reserve" className="btn btn-primary">Build Your Ring</a>
          <a href="#frequencies" className="btn-text">Explore Frequencies</a>
        </div>
      </div>
      <div className="hero-art">
        <div className="orbit"/>
        <div className="orbit orbit-2"/>
        <div className="orbit orbit-3">
          <svg viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg">
            <circle cx="240" cy="240" r="238" fill="none" stroke="#7A9E7E" strokeWidth="1" strokeDasharray="2 10" opacity="0.6"/>
          </svg>
        </div>
        <div className="hero-photo"><img src={GROUP_PHOTO} alt="Vibe Shift Rings collection"/></div>
        <div className="hz-tick" style={{top:'2%', left:'50%'}}>417 Hz</div>
        <div className="hz-tick" style={{top:'50%', left:'99%'}}>528 Hz</div>
        <div className="hz-tick" style={{top:'98%', left:'50%'}}>639 Hz</div>
        <div className="hz-tick" style={{top:'50%', left:'1%'}}>285 Hz</div>
      </div>
    </section>
  )
}
