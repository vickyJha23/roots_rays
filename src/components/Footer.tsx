import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { brand } from '../data/brand'
import { Arrow, Wordmark } from './Logo'
import { SocialLinks } from './Social'
import './Footer.css'

export function Footer() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.footer__big span', { yPercent: 100, duration: 1.3, ease: 'power4.out', stagger: 0.08, scrollTrigger: { trigger: '.footer__big', start: 'top 92%' } })
    },
    { scope: ref },
  )

  const go = (href: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault()
    scrollToTarget(href, -40)
  }

  return (
    <footer className="footer" ref={ref}>
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <a href="#home" onClick={go('#home')} aria-label="Back to top">
              <Wordmark light />
            </a>
            <div className="footer__social">
              <span>Say hello</span>
              <SocialLinks className="social--light" labels message={`Hello ${brand.name}! I found you through the website.`} />
            </div>
          </div>
          <nav className="footer__nav" aria-label="Footer">
            <a href="#shop" onClick={go('#shop')}>
              Shop
            </a>
            <a href="#story" onClick={go('#story')}>
              About
            </a>
            <a href="#rituals" onClick={go('#rituals')}>
              Rituals
            </a>
            <a href="#contact" onClick={go('#contact')}>
              Contact
            </a>
          </nav>
          <p className="footer__note">
            Stay close to the good things.
            <a className="link-arrow footer__link" href="#shop" onClick={go('#shop')}>
              Explore the collection <Arrow />
            </a>
          </p>
        </div>

        <p className="footer__big" aria-hidden="true">
          <span>Roots</span>
          <span>&amp;</span>
          <span>Rays</span>
        </p>

        <div className="footer__bottom">
          <span>© 2026 Roots &amp; Rays Organic</span>
          <span>Grown with care, always.</span>
        </div>
      </div>
    </footer>
  )
}
