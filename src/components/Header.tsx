import { useRef, useState } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { lockScroll, scrollToTarget } from '../lib/scroll'
import { Wordmark } from './Logo'
import { SocialLinks } from './Social'
import './Header.css'

const links = [
  { href: '#shop', label: 'Shop' },
  { href: '#story', label: 'About' },
  { href: '#rituals', label: 'Rituals' },
  { href: '#contact', label: 'Contact' },
]

type Props = { bag: number; onBag: () => void }

export function Header({ bag, onBag }: Props) {
  const ref = useRef<HTMLElement>(null)
  const bagRef = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useGSAP(
    () => {
      const el = ref.current!
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          el.classList.toggle('is-scrolled', self.scroll() > 80)
          el.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 240)
        },
      })
    },
    { scope: ref },
  )

  // a small bounce on the counter whenever something lands in the bag
  useGSAP(
    () => {
      if (bag === 0) return
      gsap.fromTo(bagRef.current, { scale: 1.35, backgroundColor: '#c9a24a' }, { scale: 1, backgroundColor: '#1c3d2a', duration: 0.7, ease: 'elastic.out(1, 0.45)' })
    },
    { dependencies: [bag] },
  )

  useGSAP(
    () => {
      if (!open) return
      gsap.from('.menu__link', { yPercent: 110, stagger: 0.06, duration: 0.8, ease: 'power3.out', delay: 0.15 })
      gsap.from('.menu__foot > *', { opacity: 0, y: 10, stagger: 0.08, duration: 0.6, delay: 0.5 })
    },
    { scope: ref, dependencies: [open] },
  )

  const go = (href: string) => {
    setOpen(false)
    lockScroll(false)
    scrollToTarget(href, -72)
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    lockScroll(next)
  }

  const openBag = () => {
    if (open) {
      setOpen(false)
      lockScroll(false)
    }
    onBag()
  }

  return (
    <header className={`site-header ${open ? 'is-open' : ''}`} ref={ref}>
      <a
        href="#home"
        className="site-header__brand"
        aria-label="Roots & Rays Organic, back to top"
        onClick={(e) => {
          e.preventDefault()
          go('#home')
        }}
      >
        <Wordmark />
      </a>

      <nav className="site-header__nav" aria-label="Primary">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={(e) => {
              e.preventDefault()
              go(l.href)
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="site-header__tools">
        <SocialLinks className="site-header__social" />
        <button className="bag" onClick={openBag} aria-label={`Open bag, ${bag} ${bag === 1 ? 'item' : 'items'}`}>
          <span>Bag</span>
          <b ref={bagRef}>{bag}</b>
        </button>
        <button className="burger" onClick={toggle} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="menu" id="mobile-menu">
          <nav aria-label="Mobile">
            {links.map((l, i) => (
              <span className="menu__mask" key={l.href}>
                <a
                  className="menu__link"
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(l.href)
                  }}
                >
                  <small>0{i + 1}</small>
                  {l.label}
                </a>
              </span>
            ))}
          </nav>
          <div className="menu__foot">
            <SocialLinks className="social--light" labels />
            <p>Cultivated organic — grown with care, always.</p>
          </div>
        </div>
      )}
    </header>
  )
}
