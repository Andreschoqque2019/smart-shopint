import { cn } from './cn'
import { CartIcon } from './icons'

interface LogoProps {
  className?: string
}

/**
 * Brand mark: a white shopping cart on light green, inside a rounded square.
 *
 * Drawn inline so the mark never depends on an external asset.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        'flex h-14 w-14 items-center justify-center rounded-[20px] bg-brand text-white shadow-card',
        className,
      )}
    >
      <CartIcon className="h-8 w-8" strokeWidth={2.2} />
    </span>
  )
}
