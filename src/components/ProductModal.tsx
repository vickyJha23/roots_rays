import { useEffect, useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { lockScroll } from '../lib/scroll'
import type { Product } from '../data/products'
import { formatPrice } from '../data/brand'
import { Arrow } from './Logo'
import { MagneticButton } from './MagneticButton'
import './ProductModal.css'

type Props = { product: Product; onClose: () => void; onAdd: (p: Product) => void }

export function ProductModal({ product, onClose, onAdd }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

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
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.modal-backdrop', { opacity: 0, duration: 0.35 })
        .from('.modal', { y: 40, scale: 0.98, duration: 0.7 }, 0.05)
        .from('.modal__media img', { y: 30, rotate: -6, opacity: 0, duration: 0.9 }, 0.2)
        .from('.modal__copy > *', { y: 14, opacity: 0, stagger: 0.06, duration: 0.6 }, 0.3)
    },
    { scope: ref },
  )

  // Selectors here resolve inside `scope`, so no ref is read during render.
  const close = contextSafe(() => {
    if (prefersReducedMotion()) return onClose()
    gsap
      .timeline({ onComplete: onClose, defaults: { ease: 'power2.in' } })
      .to('.modal', { y: 24, opacity: 0, duration: 0.3 })
      .to('.modal-backdrop', { opacity: 0, duration: 0.25 }, 0.1)
  })

  return (
    <div ref={ref}>
      <div className="modal-backdrop" onClick={close} role="presentation">
        <section className={`modal modal--${product.tone}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
          <button className="modal__close" ref={closeRef} onClick={close} aria-label="Close product details">
            <span />
            <span />
          </button>
          <div className="modal__media">
            <img src={product.image} alt={`${product.name} pouch`} />
          </div>
          <div className="modal__copy">
            <p className="eyebrow">{product.kind}</p>
            <h2 id="modal-title" className="display display--md">
              {product.name}
            </h2>
            <span className="modal__meta">
              {product.weight} · Roots &amp; Rays Organic <b>{formatPrice(product.price)}</b>
            </span>
            <p className="body-copy">{product.note}</p>
            <dl className="modal__facts">
              <div>
                <dt>Goes well with</dt>
                <dd>{product.pairsWith}</dd>
              </div>
              <div>
                <dt>In the bag</dt>
                <dd>One ingredient. No additives, non-GMO, cultivated organic.</dd>
              </div>
            </dl>
            <MagneticButton
              type="button"
              className="btn"
              onClick={() => {
                onAdd(product)
                close()
              }}
            >
              Add to bag <Arrow className="btn__arrow" />
            </MagneticButton>
          </div>
        </section>
      </div>
    </div>
  )
}
