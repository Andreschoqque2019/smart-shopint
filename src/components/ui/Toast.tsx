import { cn } from './cn'
import { CheckIcon } from './icons'

interface ToastProps {
  /** Product name appended to the confirmation message. */
  message: string
  className?: string
}

/**
 * Transient cart-add confirmation.
 *
 * Presentational only: the caller owns the timer that mounts and unmounts it.
 * The wrapper is fixed to the bottom of the centred phone column and ignores
 * pointer events, so the toast never blocks the catalog underneath. The card
 * carries the entrance animation; reduced-motion users skip it via the
 * `motion-reduce` variant.
 */
export function Toast({ message, className }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-4 bottom-6 z-50 mx-auto max-w-[390px]',
        className,
      )}
    >
      <div
        role="status"
        className="flex animate-toast-in items-center gap-3 rounded-card bg-success p-3 text-white shadow-card motion-reduce:animate-none"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill bg-white/20">
          <CheckIcon className="h-5 w-5" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-bold">Agregado al carrito</span>
          <span className="truncate text-xs text-white/90">{message}</span>
        </span>
      </div>
    </div>
  )
}
