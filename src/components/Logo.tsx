type LogoProps = { className?: string; drawable?: boolean }

/** The sun-over-roots mark from the packaging, redrawn as strokes so it can be animated. */
export function Logo({ className, drawable }: LogoProps) {
  const cls = drawable ? 'logo-path' : undefined
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className={cls} d="M32 9V4M21 13l-3-4M43 13l3-4M14 23l-5-2M50 23l5-2" />
      <path className={cls} d="M19 29a13 13 0 0 1 26 0" />
      <path className={cls} d="M32 27v16" />
      <path className={cls} d="M32 37c-6 0-10-4-10-9 5 0 10 3 10 9ZM32 34c6 0 10-4 10-9-5 0-10 3-10 9Z" />
      <path className={cls} d="M32 43c0 6-6 8-9 13M32 43c0 6 6 8 9 13M32 43v16M25 49l-5 2M39 49l5 2" />
    </svg>
  )
}

export function Wordmark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={`wordmark ${light ? 'wordmark--light' : ''} ${className ?? ''}`}>
      <Logo className="wordmark__mark" />
      <span className="wordmark__text">
        Roots <i>&amp;</i> Rays
        <small>Organic</small>
      </span>
    </span>
  )
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12 12 2M4 2h8v8" />
    </svg>
  )
}
