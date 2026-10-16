import type { ReactNode } from 'react'

import { cn } from './cn'

interface SectionTitleProps {
  children: ReactNode
  /** Optional id so a section can point back at its own heading. */
  id?: string
  className?: string
}

/**
 * Section heading with the short red divider underneath.
 *
 * The divider is the small red rule (~30px) that marks each block.
 */
export function SectionTitle({ children, id, className }: SectionTitleProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <h2 id={id} className="text-lg font-semibold text-ink">
        {children}
      </h2>
      <span aria-hidden="true" className="h-[3px] w-8 rounded-pill bg-primary" />
    </div>
  )
}
