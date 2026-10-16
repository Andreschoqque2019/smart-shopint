import type { PaymentMethod } from '../../data/types'
import { cn } from '../ui/cn'
import { BoltIcon, CashIcon } from '../ui/icons'

interface PaymentSpec {
  initials: string
  bg: string
  /** Cash uses a banknote glyph instead of a monogram. */
  glyph?: 'monogram' | 'cash'
}

/**
 * Own payment marks.
 *
 * Original tiles that evoke each simulated method — not the real brands. Yape
 * and Plin keep a monogram plus a bolt; cash shows a banknote. Theme tokens
 * only, and the whole tile is decorative (the label next to it names the
 * method), so it never pollutes the radio's accessible name.
 */
const PAYMENTS: Record<PaymentMethod, PaymentSpec> = {
  yape: { initials: 'Y', bg: 'bg-accent-purple' },
  plin: { initials: 'P', bg: 'bg-accent-blue' },
  cash: { initials: '', bg: 'bg-accent-green', glyph: 'cash' },
}

interface PaymentBrandProps {
  method: PaymentMethod
  className?: string
}

export function PaymentBrand({ method, className }: PaymentBrandProps) {
  const spec = PAYMENTS[method]
  const isCash = spec.glyph === 'cash'

  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl text-white shadow-card',
        spec.bg,
        className,
      )}
    >
      {isCash ? (
        <CashIcon className="h-6 w-6" />
      ) : (
        <>
          <span className="relative z-10 text-sm font-extrabold tracking-tight">
            {spec.initials}
          </span>
          <BoltIcon className="absolute -bottom-1.5 -right-1.5 h-6 w-6 text-white/35" />
        </>
      )}
    </span>
  )
}
