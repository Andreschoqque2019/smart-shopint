import type { ReactNode } from 'react'

import { cn } from './cn'

interface PillProps {
  children: ReactNode
  className?: string
}

/**
 * Rounded label.
 *
 * Red on white, per the brand guide: pills and tags are the one place the action
 * red is used as a fill behind white text.
 */
export function Pill({ children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill bg-primary px-3 py-1 text-xs font-semibold leading-none text-white',
        className,
      )}
    >
      {children}
    </span>
  )
}
