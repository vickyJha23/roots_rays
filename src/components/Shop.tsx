import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'
import { products, type Product } from '../data/products'
import { formatPrice } from '../data/brand'
import { Arrow } from './Logo'
import './Shop.css'

type Props = { onAdd: (p: Product) => void; onOpen: (p: Product) => void }

export function Shop({ onAdd, onOpen }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('.card', { opacity: 1, y: 0 })
        return
      }

      gsap.from('.shop__head > *', {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        scrollTrigger: { trigger: '.shop__head', start: 'top 80%' },
      })

      ScrollTrigger.batch('.card', {
        start: 'top 88%',
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', overwrite: true }),
      })

      // the middle column drifts a touch slower than its neighbours
      gsap.to('.grid__col--offset', {
        y: -70,
        ease: 'none',
        scrollTrigger: { trigger: '.grid', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      })

      if (!hasFinePointer()) return
      gsap.utils.toArray<HTMLElement>('.card__media').forEach((media) => {
        const img = media.querySelector('img')!
        const rx = gsap.quickTo(img, 'rotationY', { duration: 0.7, ease: 'power3' })
        const ry = gsap.quickTo(img, 'rotationX', { duration: 0.7, ease: 'power3' })
        media.addEventListener('pointermove', (e) => {
          const r = media.getBoundingClientRect()
          rx(((e.clientX - r.left) / r.width - 0.5) * 16)
          ry(-((e.clientY - r.top) / r.height - 0.5) * 12)
        })
        media.addEventListener('pointerleave', () => {
          rx(0)
          ry(0)
        })
      })
    },
    { scope: ref },
  )

  const columns = [0, 1, 2].map((c) => products.filter((_, i) => i % 3 === c))

  return (
    <section className="shop section" id="shop" ref={ref}>
      <div className="wrap">
        <header className="shop__head">
          <p className="eyebrow">The collection</p>
          <h2 className="display display--lg">
            From the earth,
            <br />
            <em>to your everyday.</em>
          </h2>
          <p className="lede shop__aside">Six pantry staples and herbal favourites we keep close. Simple ingredients, grown with intention, and nothing else in the bag.</p>
        </header>

        <div className="grid">
          {columns.map((col, c) => (
            <div className={`grid__col ${c === 1 ? 'grid__col--offset' : ''}`} key={c}>
              {col.map((product) => {
                const index = products.indexOf(product) + 1
                return (
                  <article className={`card card--${product.tone}`} key={product.slug}>
                    <div className="card__media">
                      <span className="card__index">{String(index).padStart(2, '0')}</span>
                      <img src={product.image} alt={`${product.name}, ${product.weight} pouch`} loading={index > 2 ? 'lazy' : 'eager'} />
                      <button className="card__add" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`}>
                        <span>+</span>
                      </button>
                    </div>
                    <div className="card__body">
                      <div className="card__row">
                        <span className="card__kind">{product.kind}</span>
                        <span className="card__weight">{product.weight}</span>
                      </div>
                      <div className="card__title">
                        <h3 className="card__name">{product.name}</h3>
                        <span className="card__price">{formatPrice(product.price)}</span>
                      </div>
                      <p className="card__note">{product.note}</p>
                      <button className="link-arrow card__more" onClick={() => onOpen(product)}>
                        View details <Arrow />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
