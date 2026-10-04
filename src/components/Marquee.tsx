import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { products } from '../data/products'
import { Logo } from './Logo'
import './Marquee.css'

const items = products.map((p) => p.name.replace(' Powder', ''))

/** A ticker of the range. Scroll velocity nudges its speed, like a hand on a reel. */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      const tween = gsap.to('.marquee__track', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 600, 4)
          gsap.to(tween, { timeScale: self.direction * (1 + v), duration: 0.6, overwrite: true })
        },
      })
    },
    { scope: ref },
  )

  const row = [...items, ...items]

  return (
    <div className="marquee" ref={ref} aria-hidden="true">
      <div className="marquee__track">
        {row.map((name, i) => (
          <span className="marquee__item" key={i}>
            {name}
            <Logo className="marquee__mark" />
          </span>
        ))}
      </div>
    </div>
  )
}
