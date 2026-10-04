import { useRef, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { hasFinePointer, prefersReducedMotion } from '../lib/motion'

type MagneticProps<T extends ElementType> = {
  as?: T
  strength?: number
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/** Wraps a button or link so it leans toward the cursor. Pointer-only, otherwise inert. */
export function MagneticButton<T extends ElementType = 'button'>({ as, strength = 0.35, children, ...rest }: MagneticProps<T>) {
  const Tag = (as ?? 'button') as ElementType
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !hasFinePointer() || prefersReducedMotion()) return
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
