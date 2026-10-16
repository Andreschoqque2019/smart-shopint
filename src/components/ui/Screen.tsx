import type { ReactNode } from 'react'

import { cn } from './cn'

interface ScreenProps {
  children: ReactNode
  className?: string
}

/**
 * Screen shell shared by every route.
 *
 * Keeps the phone-width column, the gutters and the vertical rhythm in one
 * place. The outer frame (see `App.tsx`) constrains the width on desktop; this
 * `max-w` mirror keeps the same column when a screen is rendered on its own
 * (for example in tests).
 */
export function Screen({ children, className }: ScreenProps) {
  return (
    <main
      className={cn(
        'mx-auto flex w-full max-w-[430px] flex-1 flex-col gap-6 px-5 pb-10 pt-7',
        className,
      )}
    >
      {children}
    </main>
  )
}
