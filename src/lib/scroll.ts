import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'
import { prefersReducedMotion } from './motion'

let lenis: Lenis | null = null

/** Starts Lenis smooth scrolling and wires it into GSAP's ticker. Returns a teardown. */
export function startSmoothScroll(): () => void {
  if (lenis || prefersReducedMotion()) return () => {}

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  el?.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
  document.documentElement.classList.toggle('is-locked', locked)
}
