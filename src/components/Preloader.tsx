import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { Logo } from './Logo'
import './Preloader.css'

type Props = { onDone: () => void }

/** A short curtain: the mark draws itself, the name settles, the panel lifts. Plays once per session. */
export function Preloader({ onDone }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          onDone()
          ref.current?.remove()
        },
      })
      tl.from('.logo-path', { drawSVG: '0%', duration: 1.1, stagger: 0.08, ease: 'power2.inOut' })
        .from('.preloader__name span', { yPercent: 110, duration: 0.8, stagger: 0.05, ease: 'power3.out' }, '-=0.6')
        .to('.preloader__inner', { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power3.in' }, '+=0.35')
        .to(ref.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.35')
    },
    { scope: ref },
  )

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="preloader__inner">
        <Logo className="preloader__mark" drawable />
        <p className="preloader__name">
          {'Roots & Rays'.split(' ').map((word, i) => (
            <span key={i}>{word}</span>
          ))}
        </p>
      </div>
    </div>
  )
}
