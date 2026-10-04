import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from './lib/gsap'
import { prefersReducedMotion } from './lib/motion'
import { startSmoothScroll } from './lib/scroll'
import type { Product } from './data/products'
import { useCart } from './hooks/useCart'
import { Preloader } from './components/Preloader'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Shop } from './components/Shop'
import { Story } from './components/Story'
import { Rituals } from './components/Rituals'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { ProductModal } from './components/ProductModal'
import { CartDrawer } from './components/CartDrawer'
import { Chat } from './components/Chat'
import { Toast } from './components/Toast'

const SEEN_KEY = 'rr-intro-seen'

function shouldPreload(): boolean {
  if (prefersReducedMotion()) return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== '1'
  } catch {
    return true
  }
}

export default function App() {
  const [preloading] = useState(shouldPreload)
  const [fontsReady, setFontsReady] = useState(false)
  const [introDone, setIntroDone] = useState(!preloading)
  const [toast, setToast] = useState<string | null>(null)
  const [selected, setSelected] = useState<Product | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const toastTimer = useRef<number>(0)
  const cart = useCart()

  useEffect(() => {
    const stop = startSmoothScroll()
    document.fonts.ready.then(() => setFontsReady(true))
    return stop
  }, [])

  // Layout shifts once fonts land and images decode; make sure triggers are measured against the final page.
  useEffect(() => {
    if (!fontsReady) return
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => window.clearTimeout(id)
  }, [fontsReady])

  const onPreloaderDone = useCallback(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private mode, nothing to do */
    }
    setIntroDone(true)
  }, [])

  const addToBag = useCallback(
    (product: Product) => {
      cart.add(product)
      setToast(`${product.name} added to your bag`)
      window.clearTimeout(toastTimer.current)
      toastTimer.current = window.setTimeout(() => setToast(null), 3200)
    },
    [cart],
  )

  const openCart = useCallback(() => {
    setSelected(null)
    setToast(null)
    setCartOpen(true)
  }, [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const closeModal = useCallback(() => setSelected(null), [])

  const play = introDone && fontsReady

  return (
    <>
      {preloading && <Preloader onDone={onPreloaderDone} />}
      <Header bag={cart.count} onBag={openCart} />
      <main>
        <Hero play={play} />
        <Marquee />
        <Shop onAdd={addToBag} onOpen={setSelected} />
        <Story />
        <Rituals />
        <Contact />
      </main>
      <Footer />
      {selected && <ProductModal product={selected} onClose={closeModal} onAdd={addToBag} />}
      {cartOpen && <CartDrawer lines={cart.lines} subtotal={cart.subtotal} onClose={closeCart} onSetQty={cart.setQty} onRemove={cart.remove} onClear={cart.clear} />}
      <Chat />
      <Toast message={toast} action={{ label: 'View bag', onClick: openCart }} />
    </>
  )
}
