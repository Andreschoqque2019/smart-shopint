import { cn } from '../ui/cn'

type Motif = 'bag' | 'circle' | 'diamond' | 'triangle' | 'stripe'

interface BrandSpec {
  initials: string
  /** Theme background class for the tile. */
  bg: string
  motif: Motif
}

/**
 * Own store marks.
 *
 * These are ORIGINAL marks drawn for the demo — not the real logos. Each store
 * gets a distinct tile (colour + short monogram + a small geometric motif) so
 * the set reads as one consistent family while still evoking each brand. Only
 * theme tokens are used, so the palette stays in one place.
 */
const BRANDS: Record<string, BrandSpec> = {
  tottus: { initials: 'T', bg: 'bg-primary', motif: 'bag' },
  'plaza vea': { initials: 'PV', bg: 'bg-accent-green', motif: 'circle' },
  metro: { initials: 'M', bg: 'bg-primary', motif: 'stripe' },
  makro: { initials: 'MK', bg: 'bg-accent-blue', motif: 'triangle' },
  ripley: { initials: 'R', bg: 'bg-accent-purple', motif: 'diamond' },
  oechsle: { initials: 'O', bg: 'bg-ink', motif: 'circle' },
  falabella: { initials: 'F', bg: 'bg-accent-green', motif: 'stripe' },
  sodimac: { initials: 'S', bg: 'bg-accent-blue', motif: 'bag' },
  estilos: { initials: 'E', bg: 'bg-accent-purple', motif: 'diamond' },
}

function fallbackSpec(name: string): BrandSpec {
  const initial = name.trim().charAt(0).toUpperCase() || '?'
  return { initials: initial, bg: 'bg-muted', motif: 'bag' }
}

function MotifShape({ motif }: { motif: Motif }) {
  const common = {
    'aria-hidden': true,
    focusable: 'false' as const,
    viewBox: '0 0 24 24',
    className: 'absolute -bottom-1 -right-1 h-6 w-6 text-white/35',
  }
  switch (motif) {
    case 'circle':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    case 'diamond':
      return (
        <svg {...common}>
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="2"
            fill="currentColor"
            transform="rotate(45 12 12)"
          />
        </svg>
      )
    case 'triangle':
      return (
        <svg {...common}>
          <path d="M12 5 21 19H3z" fill="currentColor" />
        </svg>
      )
    case 'stripe':
      return (
        <svg {...common}>
          <path d="M4 16 16 4M9 20 20 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'bag':
    default:
      return (
        <svg {...common}>
          <path d="M7 9h10l-1 11H8z" fill="currentColor" />
        </svg>
      )
  }
}

interface StoreBrandProps {
  name: string
  className?: string
}

/** Deterministic own-brand tile for a store, keyed by its name. */
export function StoreBrand({ name, className }: StoreBrandProps) {
  const spec = BRANDS[name.trim().toLowerCase()] ?? fallbackSpec(name)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl text-white shadow-card',
        spec.bg,
        className,
      )}
    >
      <span className="relative z-10 text-sm font-extrabold tracking-tight">
        {spec.initials}
      </span>
      <MotifShape motif={spec.motif} />
    </span>
  )
}
