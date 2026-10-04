import { useRef } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { Arrow, Logo } from './Logo'
import './Story.css'

export function Story() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // the big line crawls sideways as you pass it
      gsap.fromTo('.story__crawl', { xPercent: 6 }, { xPercent: -22, ease: 'none', scrollTrigger: { trigger: '.story__crawl', start: 'top bottom', end: 'bottom top', scrub: 1 } })

      gsap.fromTo('.story__photo img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.story__photo', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.story__photo', { clipPath: 'inset(12% 8% 12% 8% round 4px)', duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: '.story__photo', start: 'top 75%' } })
      gsap.to('.story__stamp', { rotation: 360, duration: 24, ease: 'none', repeat: -1 })

      const split = SplitText.create('.story__copy p.body-copy', { type: 'lines' })
      gsap.from(split.lines, { opacity: 0, y: 16, stagger: 0.06, duration: 0.9, scrollTrigger: { trigger: '.story__copy', start: 'top 75%' } })
      gsap.from('.story__copy > :not(p.body-copy)', { opacity: 0, y: 22, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.story__copy', start: 'top 75%' } })
      gsap.from('.story__facts li', { opacity: 0, x: -12, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.story__facts', start: 'top 85%' } })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <section className="story" id="story" ref={ref}>
      <div className="story__crawl" aria-hidden="true">
        Grown with care <Logo /> Rooted in goodness <Logo /> Always growing <Logo /> Grown with care <Logo /> Rooted in goodness
      </div>

      <div className="wrap story__inner">
        <figure className="story__photo">
          <img src="/gallery/amla-candy.jpeg" alt="A pouch of Roots & Rays Amla Candy" loading="lazy" />
          <div className="story__stamp" aria-hidden="true">
            <svg viewBox="0 0 100 100">
              <defs>
                <path id="stamp-arc" d="M50 50 m-36 0 a36 36 0 1 1 72 0 a36 36 0 1 1 -72 0" />
              </defs>
              <text>
                <textPath href="#stamp-arc">cultivated organic · grown with care · cultivated organic ·</textPath>
              </text>
            </svg>
            <Logo className="story__stamp-mark" />
          </div>
          <figcaption>Amla candy, 250 g</figcaption>
        </figure>

        <div className="story__copy">
          <p className="eyebrow">About Roots &amp; Rays</p>
          <h2 className="display display--lg">
            Goodness that
            <br />
            feels <em>like home.</em>
          </h2>
          <p className="body-copy">
            We believe the best daily rituals begin with ingredients you recognise. Roots &amp; Rays brings together organic staples and time-honoured botanicals: moringa for the mornings, ashwagandha for the
            evenings, amla for everything in between. Each pouch holds one ingredient and nothing to read twice.
          </p>
          <ul className="story__facts">
            <li>
              <b>Cultivated organic</b>
              <span>Grown without synthetic inputs</span>
            </li>
            <li>
              <b>Single ingredient</b>
              <span>No additives, non-GMO</span>
            </li>
            <li>
              <b>Gently dried</b>
              <span>To keep colour, taste and character</span>
            </li>
          </ul>
          <a
            className="link-arrow"
            href="#rituals"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#rituals')
            }}
          >
            How we use them <Arrow />
          </a>
        </div>
      </div>
    </section>
  )
}
