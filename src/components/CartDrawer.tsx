import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { lockScroll, scrollToTarget } from '../lib/scroll'
import { brand, formatPrice, whatsappUrl } from '../data/brand'
import type { Product } from '../data/products'
import type { CartLine } from '../hooks/useCart'
import { Arrow, Logo } from './Logo'
import { WhatsAppIcon } from './Social'
import './CartDrawer.css'

type Props = {
  lines: CartLine[]
  subtotal: number
  onClose: () => void
  onSetQty: (product: Product, qty: number) => void
  onRemove: (product: Product) => void
  onClear: () => void
}

function orderMessage(lines: CartLine[], subtotal: number): string {
  const items = lines.map((l) => `• ${l.product.name} (${l.product.weight}) × ${l.qty} — ${formatPrice(l.qty * l.product.price)}`).join('\n')
  return `Hello ${brand.name}! I'd like to order:\n\n${items}\n\nSubtotal: ${formatPrice(subtotal)}\n\nPlease let me know delivery details. Thank you!`
}

export function CartDrawer({ lines, subtotal, onClose, onSetQty, onRemove, onClear }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const empty = lines.length === 0

  useEffect(() => {
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      lockScroll(false)
    }
  }, [onClose])

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.cart__backdrop', { opacity: 0, duration: 0.4 })
        .from('.cart__panel', { xPercent: 100, duration: 0.7, ease: 'power4.out' }, 0)
        .from('.cart__line, .cart__empty > *', { opacity: 0, y: 14, stagger: 0.06, duration: 0.6 }, 0.3)
    },
    { scope: ref },
  )

  const close = contextSafe(() => {
    if (prefersReducedMotion()) return onClose()
    gsap
      .timeline({ onComplete: onClose, defaults: { ease: 'power3.in' } })
      .to('.cart__panel', { xPercent: 100, duration: 0.45 })
      .to('.cart__backdrop', { opacity: 0, duration: 0.3 }, 0.1)
  })

  const goShop = () => {
    onClose()
    scrollToTarget('#shop', -40)
  }

  return (
    <div className="cart" ref={ref}>
      <div className="cart__backdrop" onClick={close} role="presentation" />
      <aside className="cart__panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className="cart__head">
          <h2 id="cart-title">
            Your bag <small>{lines.reduce((n, l) => n + l.qty, 0)}</small>
          </h2>
          <button className="cart__close" ref={closeRef} onClick={close} aria-label="Close bag">
            <span />
            <span />
          </button>
        </header>

        {empty ? (
          <div className="cart__empty">
            <Logo />
            <p>Your bag is empty.</p>
            <span>Nothing in here yet. The collection is one scroll away.</span>
            <button className="btn" onClick={goShop}>
              Shop the collection <Arrow className="btn__arrow" />
            </button>
          </div>
        ) : (
          <>
            <ul className="cart__lines">
              {lines.map(({ product, qty }) => (
                <li className={`cart__line cart__line--${product.tone}`} key={product.slug}>
                  <div className="cart__thumb">
                    <img src={product.image} alt="" />
                  </div>
                  <div className="cart__info">
                    <b>{product.name}</b>
                    <span>
                      {product.weight} · {formatPrice(product.price)}
                    </span>
                    <div className="cart__qty" aria-label={`Quantity of ${product.name}`}>
                      <button onClick={() => onSetQty(product, qty - 1)} aria-label="Decrease quantity">
                        −
                      </button>
                      <output>{qty}</output>
                      <button onClick={() => onSetQty(product, qty + 1)} aria-label="Increase quantity">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="cart__right">
                    <b>{formatPrice(qty * product.price)}</b>
                    <button className="cart__remove" onClick={() => onRemove(product)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart__foot">
              <div className="cart__total">
                <span>Subtotal</span>
                <b>{formatPrice(subtotal)}</b>
              </div>
              <p className="cart__note">Delivery is confirmed when we reply. Send the bag to us on WhatsApp and we'll take it from there.</p>
              <a className="btn cart__order" href={whatsappUrl(orderMessage(lines, subtotal))} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="cart__wa" /> Order on WhatsApp
              </a>
              <div className="cart__links">
                <button className="link-arrow" onClick={goShop}>
                  Keep shopping <Arrow />
                </button>
                <button className="cart__clear" onClick={onClear}>
                  Clear bag
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
