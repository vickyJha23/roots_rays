import { useEffect, useRef, useState, type FormEvent } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { brand, whatsappUrl } from '../data/brand'
import { Logo } from './Logo'
import { WhatsAppIcon } from './Social'
import './Chat.css'

type Message = { from: 'visitor' | 'shop'; text: string; link?: { href: string; label: string } }

const greeting: Message = { from: 'shop', text: 'Hello. Ask about an ingredient, what goes with what, or how to reach a person.' }

const whatsappLink = { href: whatsappUrl(`Hello ${brand.name}! I have a question.`), label: 'Message us on WhatsApp' }

function reply(text: string): Message {
  const t = text.toLowerCase()
  if (/(contact|talk|person|human|email|whatsapp|call)/.test(t)) {
    return { from: 'shop', text: 'The quickest way to reach a real person is WhatsApp. Or leave a note in the Contact section and we’ll write back.', link: whatsappLink }
  }
  if (/(order|buy|price|cost|deliver|ship|bag|cart)/.test(t)) {
    return { from: 'shop', text: 'Add pouches to your bag, then send the bag to us on WhatsApp from the bag panel. We confirm delivery details there.', link: whatsappLink }
  }
  if (/(moringa|beetroot|amla|ashwagandha|shatavari|candy|product|shop|ingredient)/.test(t)) {
    return { from: 'shop', text: 'Everything we make is in the collection above. Open “View details” on any pouch for what it pairs with.' }
  }
  if (/(morning|smoothie|breakfast)/.test(t)) return { from: 'shop', text: 'For mornings, people usually reach for moringa or beetroot powder in a smoothie.' }
  if (/(sleep|evening|night|relax)/.test(t)) return { from: 'shop', text: 'For evenings, ashwagandha or shatavari in warm milk is the usual ritual.' }
  return { from: 'shop', text: 'Thanks for asking. I can point you to a product, or to WhatsApp if you’d rather talk to someone.', link: whatsappLink }
}

/** A small, honest helper. Canned answers only; nothing leaves the page. */
export function Chat() {
  const ref = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([greeting])

  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return
      gsap.from('.chat__panel', { y: 16, opacity: 0, scale: 0.98, duration: 0.5, ease: 'power3.out', transformOrigin: 'bottom right' })
    },
    { scope: ref, dependencies: [open] },
  )

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const send = (text: string) => {
    const clean = text.trim()
    if (!clean) return
    setMessages((m) => [...m, { from: 'visitor', text: clean }, reply(clean)])
    setInput('')
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="chat" ref={ref}>
      {open && (
        <section className="chat__panel" aria-label="Ask us">
          <header className="chat__head">
            <Logo />
            <div>
              <b>Ask us</b>
              <span>Quick answers, no waiting</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close">
              ×
            </button>
          </header>
          <div className="chat__list" ref={listRef} aria-live="polite">
            {messages.map((m, i) => (
              <p className={`chat__msg chat__msg--${m.from}`} key={i}>
                {m.text}
                {m.link && (
                  <a className="chat__link" href={m.link.href} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon /> {m.link.label}
                  </a>
                )}
              </p>
            ))}
          </div>
          <div className="chat__chips">
            <button onClick={() => send('What should I take in the morning?')}>Mornings</button>
            <button onClick={() => send('What helps in the evening?')}>Evenings</button>
            <button onClick={() => send('How do I order?')}>How to order</button>
            <button onClick={() => send('How can I contact someone?')}>Talk to a person</button>
          </div>
          <form className="chat__form" onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message…" aria-label="Your message" />
            <button type="submit" aria-label="Send">
              ↑
            </button>
          </form>
        </section>
      )}
      <button className="chat__launch" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Logo />
        <span>{open ? 'Close' : 'Ask us'}</span>
      </button>
    </div>
  )
}
