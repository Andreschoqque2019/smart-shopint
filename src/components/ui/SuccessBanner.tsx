import type { ReactNode } from 'react'

import { cn } from './cn'
import { CheckIcon } from './icons'

interface SuccessBannerProps {
  title: ReactNode
  children?: ReactNode
  className?: string
}

/**
 * Green success confirmation.
 *
 * Sits at the very top of the receipt screen so the "purchase done" state is
 * visible at a glance, above everything else.
 */
export function SuccessBanner({ title, children, className }: SuccessBannerProps) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center gap-3 rounded-card bg-success p-4 text-white shadow-card',
        className,
      )}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-white/20">
        <CheckIcon className="h-6 w-6" />
      </span>
      <div className="flex flex-col">
        <p className="text-base font-bold leading-tight">{title}</p>
        {children ? (
          <p className="text-sm leading-snug text-white/90">{children}</p>
        ) : null}
      </div>
    </div>
  )
}
