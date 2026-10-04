import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'
import type { HeroScene, HeroSceneOptions } from '../three/HeroScene'

type Props = { play: boolean; onFallback: () => void }

const PACKS: HeroSceneOptions['packs'] = [
  { url: '/gallery/moringa.jpeg', x: -0.72, y: 0.12, z: -0.3, rot: -0.14, scale: 1, parallax: 0.1 },
  { url: '/gallery/beetroot.jpeg', x: 0.62, y: -0.22, z: 0.2, rot: 0.11, scale: 1.04, parallax: 0.22 },
]

/**
 * Mounts the Three.js hero and lets GSAP drive its intro and scroll state.
 * Three is loaded on demand so the rest of the page doesn't wait on it.
 */
export function HeroCanvas({ play, onFallback }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<HeroScene | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let teardown: (() => void) | undefined

    import('../three/HeroScene').then(({ HeroScene, webglAvailable }) => {
      if (cancelled) return
      if (!webglAvailable()) {
        onFallback()
        return
      }
      const reduced = prefersReducedMotion()
      let scene: HeroScene
      try {
        scene = new HeroScene({
          canvas,
          packs: PACKS,
          cream: '#f3eee2',
          sun: '#e9d59c',
          reducedMotion: reduced,
          onReady: () => setReady(true),
        })
      } catch {
        onFallback()
        return
      }
      sceneRef.current = scene

      const io = new IntersectionObserver(([entry]) => scene.setVisible(entry.isIntersecting), { threshold: 0 })
      io.observe(canvas)

      const onMove = (e: PointerEvent) => {
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1))
      }
      if (hasFinePointer() && !reduced) window.addEventListener('pointermove', onMove, { passive: true })

      const st = ScrollTrigger.create({
        trigger: canvas.closest('.hero') ?? canvas,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => scene.setScroll(self.progress),
      })

      teardown = () => {
        st.kill()
        io.disconnect()
        window.removeEventListener('pointermove', onMove)
        scene.dispose()
        sceneRef.current = null
      }
    })

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [onFallback])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || !ready || !play) return
    if (prefersReducedMotion()) {
      scene.render()
      return
    }
    scene.start()
    const tl = gsap.timeline()
    tl.to(scene.intro, { sun: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .to(scene.intro, { rise: 0, duration: 1.6, ease: 'power4.out' }, 0.1)
      .to(scene.intro, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.1)
    return () => {
      tl.kill()
    }
  }, [ready, play])

  return <canvas ref={canvasRef} className={`hero__canvas ${ready ? 'is-ready' : ''}`} aria-hidden="true" />
}
