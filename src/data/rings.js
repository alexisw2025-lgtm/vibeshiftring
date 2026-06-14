import spiral from '../assets/rings/spiral.jpg'
import sage from '../assets/rings/sage.jpg'
import anchor from '../assets/rings/anchor.jpg'
import whisper from '../assets/rings/whisper.jpg'
import interrupt from '../assets/rings/interrupt.jpg'
import flux from '../assets/rings/flux.jpg'
import group from '../assets/rings/group.jpg'
import heroAnchor from '../assets/rings/hero_anchor.jpg'

export const GROUP_PHOTO = group
export const HERO_PHOTO = heroAnchor

export const RINGS = [
  {
    id: 'spiral',
    name: 'The Spiral',
    tagline: 'Spin your focus back',
    color: 'Cream',
    price: 38,
    photo: spiral,
    desc: "Our original. Smooth-spinning outer band over a solid inner core — precision-engineered for the overthinker who needs quiet, tactile grounding on demand.",
  },
  {
    id: 'sage',
    name: 'The Sage',
    tagline: 'For the quiet overthinker',
    color: 'Electric Blue',
    price: 52,
    photo: sage,
    desc: "Subtle and refined. Built for those who think deeply and need an equally refined tool to match. Spins so smoothly you'll forget it's a fidget ring.",
  },
  {
    id: 'anchor',
    name: 'The Anchor',
    tagline: 'Grounded. Present. Locked in.',
    color: 'Blue with red inner',
    price: 44,
    photo: anchor,
    desc: "Wider band, heavier spin, with vibrant red revealed through circular cutouts. Made for high-stimulation days when you need more tactile weight to refocus.",
  },
  {
    id: 'whisper',
    name: 'The Whisper',
    tagline: 'Carry your calm quietly',
    color: 'Ghost White',
    price: 42,
    photo: whisper,
    desc: "The lightest, most discreet of the collection. Open lattice crosshatch — looks purely like fine jewelry. Nobody in the meeting knows. You just feel better.",
  },
  {
    id: 'interrupt',
    name: 'The Interrupt',
    tagline: 'Break the pattern. Right now.',
    color: 'Matte Black with red inner',
    price: 48,
    photo: interrupt,
    desc: "The statement piece. Dark navy with angular cuts and a vivid red inner band. Maximum interrupt energy for when anxiety is loud and you need a hard reset.",
  },
  {
    id: 'flux',
    name: 'The Flux',
    tagline: 'Flow through the noise',
    color: 'Electric Blue, slim',
    price: 46,
    photo: flux,
    desc: "Slim profile with variable-depth dot cutouts. Built for the minimalist who still needs a tactile outlet — understated but unmistakably intentional.",
  },
]

export const CUSTOM_DESIGN = {
  id: 'custom',
  name: 'Custom Design',
  tagline: 'Tell us your vision',
  color: 'Your choice',
  price: null,
  photo: null,
  desc: "Want a specific colour combination or pattern? Describe it and we'll create something made just for you.",
}

export const RING_SIZES = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

export const SIZE_CHART = [
  { size: 5, mm: 15.7 }, { size: 6, mm: 16.5 }, { size: 7, mm: 17.3 },
  { size: 8, mm: 18.2 }, { size: 9, mm: 19.0 }, { size: 10, mm: 19.8 },
  { size: 11, mm: 20.6 }, { size: 12, mm: 21.4 }, { size: 13, mm: 22.2 },
  { size: 14, mm: 23.0 }, { size: 15, mm: 23.8 },
]
