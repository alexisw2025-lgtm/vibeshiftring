import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import FrequencyDial from './components/FrequencyDial'
import Gallery from './components/Gallery'
import SizingGuide from './components/SizingGuide'
import Configurator from './components/Configurator'
import Footer from './components/Footer'

export default function App(){
  const [design, setDesign] = useState(null)
  const [frequency, setFrequency] = useState(null)
  const [size, setSize] = useState(null)

  return (
    <>
      <Nav/>
      <Hero/>
      <Gallery selected={design} onSelect={setDesign}/>
      <FrequencyDial selected={frequency} onSelect={setFrequency}/>
      <SizingGuide/>
      <Configurator
        design={design}
        frequency={frequency}
        size={size}
        onSizeChange={setSize}
      />
      <Footer/>
    </>
  )
}
