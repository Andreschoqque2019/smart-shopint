import type { ReactNode } from 'react'

import { cn } from './cn'
import type { TileTone } from './tileTone'

interface IconTileProps {
  children: ReactNode
  tone?: TileTone
  /** `square` (rounded) or `circle` (full pill). */
  shape?: 'square' | 'circle'
  className?: string
}

const tones: Record<TileTone, string> = {
  rose: 'bg-surface-rose text-primary',
  blue: 'bg-surface-blue text-accent-blue',
  mint: 'bg-surface-mint text-accent-green',
  lilac: 'bg-surface-lilac text-accent-purple',
}

/**
 * Icon container: a pastel square (or circle) holding a solid single-colour
 * icon, exactly as the brand guide describes the icon boxes.
 */
export function IconTile({
  children,
  tone = 'rose',
  shape = 'square',
  className,
}: IconTileProps) {
  return (
    <span
      className={cn(
        'flex h-11 w-11 shrink-0 items-center justify-center',
        shape === 'circle' ? 'rounded-pill' : 'rounded-2xl',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
