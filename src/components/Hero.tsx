import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { Arrow } from './Logo'
import { HeroCanvas } from './HeroCanvas'
import { MagneticButton } from './MagneticButton'
import './Hero.css'

type Props = { play: boolean }

export function Hero({ play }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [fallback, setFallback] = useState(false)
  const onFallback = useCallback(() => setFallback(true), [])

  useGSAP(
    () => {
      if (!play) return
      const reduced = prefersReducedMotion()
      if (reduced) {
        gsap.set('.hero__copy > *, .hero__meta, .hero__index', { opacity: 1 })
        return
      }
      const split = SplitText.create('.hero__title', { type: 'lines', mask: 'lines', linesClass: 'hero__line' })
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09, onComplete: () => split.revert() }, 0.1)
        .from('.hero__eyebrow', { opacity: 0, x: -14, duration: 0.9 }, 0.2)
        .from('.hero__intro', { opacity: 0, y: 18, duration: 1 }, 0.55)
        .from('.hero__actions > *', { opacity: 0, y: 14, duration: 0.9, stagger: 0.1 }, 0.75)
        .from('.hero__meta > *, .hero__index', { opacity: 0, y: 8, duration: 0.8, stagger: 0.08 }, 1.1)
      if (fallback) tl.from('.hero__fallback img', { opacity: 0, y: 40, duration: 1.4, stagger: 0.15 }, 0.2)

      gsap.to('.hero__copy', {
        y: -60,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    },
    { scope: ref, dependencies: [play, fallback] },
  )

  return (
    <section className="hero" id="home" ref={ref}>
      <div className="hero__stage">
        {!fallback && <HeroCanvas play={play} onFallback={onFallback} />}
        {fallback && (
          <div className="hero__fallback" aria-hidden="true">
            <img src="/gallery/moringa.jpeg" alt="" />
            <img src="/gallery/beetroot.jpeg" alt="" />
          </div>
        )}
      </div>

      <div className="hero__copy">
        <p className="eyebrow hero__eyebrow">
          <span>
            Cultivated organic<span className="hero__eyebrow-extra"> · Powders &amp; pantry</span>
          </span>
        </p>
        <h1 className="display display--xl hero__title">
          Nature, in <em>your rhythm.</em>
        </h1>
        <p className="lede hero__intro">Thoughtful organic ingredients for the little rituals that make a day feel good. Grown slowly, dried gently, kept simple.</p>
        <div className="hero__actions">
          <MagneticButton
            as="a"
            href="#shop"
            className="btn"
            onClick={(e: MouseEvent) => {
              e.preventDefault()
              scrollToTarget('#shop', -40)
            }}
          >
            Shop the collection <Arrow className="btn__arrow" />
          </MagneticButton>
          <a
            className="link-arrow"
            href="#story"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#story')
            }}
          >
            Our story <Arrow />
          </a>
        </div>
      </div>

      <div className="hero__meta">
        <span>Rooted in nature</span>
        <span>Made for everyday</span>
      </div>
      <div className="hero__index" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
