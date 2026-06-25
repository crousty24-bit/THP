import { Link } from 'react-router-dom'

export function BrandMark() {
  return (
    <Link
      className="inline-flex items-center gap-3 rounded-lg text-left font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      to="/"
      aria-label="Zgen Home"
    >
      <span
        className="grid size-10 place-items-center rounded-lg border border-primary/35 bg-primary/15 text-base font-black text-accent shadow-[0_0_24px_rgba(66,132,117,0.22)]"
        aria-hidden="true"
      >
        Z
      </span>
      <span className="text-xl tracking-tight" translate="no">
        Zgen
      </span>
    </Link>
  )
}
