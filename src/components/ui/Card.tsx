import type { ElementType, ReactNode } from 'react'

import { cn } from './cn'

interface CardProps {
  children: ReactNode
  className?: string
  /** Rendered element. Defaults to a plain `div`. */
  as?: ElementType
  /** Accessible name, when the card carries a landmark role (e.g. `section`). */
  ariaLabel?: string
}

/**
 * Surface card: white, generous radius, soft shadow, no hard borders.
 *
 * The single building block behind lists, forms and detail panels.
 */
export function Card({ children, className, as, ariaLabel }: CardProps) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      aria-label={ariaLabel}
      className={cn('rounded-card bg-surface p-6 shadow-card', className)}
    >
      {children}
    </Tag>
  )
}
