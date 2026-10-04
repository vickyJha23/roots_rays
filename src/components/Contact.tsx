import { useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { brand, instagramUrl, whatsappUrl } from '../data/brand'
import { Arrow, Logo } from './Logo'
import { MagneticButton } from './MagneticButton'
import { InstagramIcon, WhatsAppIcon } from './Social'
import './Contact.css'

export function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [sent, setSent] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.contact__intro > *', { opacity: 0, y: 24, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.contact__intro', start: 'top 78%' } })
      gsap.from('.contact__form > *', { opacity: 0, y: 18, stagger: 0.08, duration: 0.9, scrollTrigger: { trigger: '.contact__form', start: 'top 80%' } })
      gsap.from('.field__line', { scaleX: 0, duration: 1.1, ease: 'power3.inOut', stagger: 0.1, scrollTrigger: { trigger: '.contact__form', start: 'top 80%' } })
    },
    { scope: ref },
  )

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="contact section" id="contact" ref={ref}>
      <div className="wrap contact__inner">
        <div className="contact__intro">
          <p className="eyebrow">We’re here for you</p>
          <h2 className="display display--lg">
            Let’s <em>talk.</em>
          </h2>
          <p className="body-copy">Questions about an ingredient, a recipe that needs rescuing, or help choosing your everyday favourite? Leave a note and we’ll write back.</p>
          <div className="contact__aside">
            <Logo />
            <div>
              <b>A little note goes a long way</b>
              <span>We read every one, usually over a cup of something warm.</span>
            </div>
          </div>
          <ul className="contact__channels">
            <li>
              <a href={whatsappUrl(`Hello ${brand.name}! I have a question.`)} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                <span>
                  <b>WhatsApp</b>
                  <small>Quickest for orders and questions</small>
                </span>
                <Arrow />
              </a>
            </li>
            <li>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
                <span>
                  <b>Instagram</b>
                  <small>@{brand.instagram}</small>
                </span>
                <Arrow />
              </a>
            </li>
          </ul>
        </div>

        <form className="contact__form" onSubmit={submit} noValidate={false}>
          <label className="field">
            <span className="field__label">Your name</span>
            <input name="name" autoComplete="name" placeholder="How should we address you?" required />
            <i className="field__line" />
          </label>
          <label className="field">
            <span className="field__label">Email</span>
            <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
            <i className="field__line" />
          </label>
          <label className="field">
            <span className="field__label">Message</span>
            <textarea name="message" rows={4} placeholder="Tell us what’s on your mind…" required />
            <i className="field__line" />
          </label>
          <div className="contact__actions">
            <MagneticButton type="submit" className="btn">
              Send a note <Arrow className="btn__arrow" />
            </MagneticButton>
            <small className="contact__footnote">{sent ? 'Thanks for trying the form. Delivery isn’t wired up in this preview yet.' : 'This form is a preview and doesn’t send messages yet.'}</small>
          </div>
        </form>
      </div>
    </section>
  )
}
