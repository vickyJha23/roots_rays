import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/gsap'
import { prefersReducedMotion } from '../lib/motion'
import { Logo } from './Logo'
import './Toast.css'

type Props = { message: string | null; action?: { label: string; onClick: () => void } }

export function Toast({ message, action }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!message || prefersReducedMotion()) return
      gsap.fromTo(ref.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
    },
    { dependencies: [message] },
  )

  if (!message) return null
  return (
    <div className="toast" ref={ref} role="status">
      <Logo />
      <span>{message}</span>
      {action && (
        <button className="toast__action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}
