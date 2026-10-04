import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { Arrow } from './Logo'
import { MagneticButton } from './MagneticButton'
import './Rituals.css'

const rituals = [
  {
    step: 'Start',
    title: 'A softer morning',
    text: 'Stir a spoonful of moringa or beetroot into a smoothie or breakfast bowl and ease into the day.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path className="draw" d="M8 32h32" />
        <path className="draw" d="M14 32a10 10 0 0 1 20 0" />
        <path className="draw" d="M24 12v4M12 16l2.5 2.5M36 16l-2.5 2.5M6 26h4M38 26h4" />
      </svg>
    ),
  },
  {
    step: 'Pause',
    title: 'A moment to yourself',
    text: 'Warm milk, a pinch of ashwagandha or shatavari, and ten minutes where nothing is asked of you.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw" d="M10 20h22v10a8 8 0 0 1-8 8h-6a8 8 0 0 1-8-8z" />
        <path className="draw" d="M32 23h3a4 4 0 0 1 0 8h-3" />
        <path className="draw" d="M17 12c0 2-2 2-2 4s2 2 2 4M23 10c0 2-2 2-2 4s2 2 2 4" />
      </svg>
    ),
  },
  {
    step: 'Share',
    title: 'Pass the goodness on',
    text: 'Amla candy in the jar on the counter, a pouch in a friend’s bag. Small things taste better shared.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw" d="M8 30c4-6 10-6 14-2M8 30l6 8h12l10-8" />
        <path className="draw" d="M22 28l6 2a2 2 0 0 1-1 4l-7-1" />
        <path className="draw" d="M30 14c2-4 8-4 8 0 0 4-8 8-8 8s-8-4-8-8c0-4 6-4 8 0Z" />
      </svg>
    ),
  },
]

export function Rituals() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.rituals__head > *', { opacity: 0, y: 24, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.rituals__head', start: 'top 80%' } })
      gsap.from('.rituals__list .rule', { scaleX: 0, duration: 1.2, ease: 'power3.inOut', stagger: 0.15, scrollTrigger: { trigger: '.rituals__list', start: 'top 80%' } })
      gsap.utils.toArray<HTMLElement>('.ritual').forEach((item) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 82%' } })
        tl.from(item.querySelectorAll('.draw'), { drawSVG: '0%', duration: 1.2, stagger: 0.15, ease: 'power2.inOut' }).from(
          item.querySelectorAll('.ritual__text > *'),
          { opacity: 0, y: 14, stagger: 0.08, duration: 0.8 },
          '-=0.9',
        )
      })
      gsap.from('.rituals__cta', { opacity: 0, y: 16, duration: 0.9, scrollTrigger: { trigger: '.rituals__cta', start: 'top 92%' } })
    },
    { scope: ref },
  )

  return (
    <section className="rituals section" id="rituals" ref={ref}>
      <div className="wrap">
        <header className="rituals__head">
          <p className="eyebrow">Make a moment of it</p>
          <h2 className="display display--lg">
            Your day,
            <br />
            <em>your kind of good.</em>
          </h2>
        </header>

        <ol className="rituals__list">
          {rituals.map((r, i) => (
            <li className="ritual" key={r.step}>
              <div className="rule" />
              <div className="ritual__grid">
                <span className="ritual__step">
                  0{i + 1} <small>/ {r.step}</small>
                </span>
                <div className="ritual__icon">{r.icon}</div>
                <div className="ritual__text">
                  <h3>{r.title}</h3>
                  <p>{r.text}</p>
                </div>
              </div>
            </li>
          ))}
          <div className="rule" />
        </ol>

        <div className="rituals__cta">
          <MagneticButton
            as="a"
            href="#shop"
            className="btn"
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault()
              scrollToTarget('#shop', -40)
            }}
          >
            Find your everyday <Arrow className="btn__arrow" />
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
