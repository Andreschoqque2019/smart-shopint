import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from './cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'md' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` is the light-green action button and the default. */
  variant?: ButtonVariant
  size?: ButtonSize
  /** CTAs fill the card they live in; inline actions opt out. */
  fullWidth?: boolean
  /** Decorative leading icon (hidden from assistive tech). */
  icon?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white shadow-card hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-card-hover active:translate-y-0 focus-visible:ring-brand/40!',
  secondary: 'bg-soft text-ink hover:-translate-y-0.5 hover:bg-line active:translate-y-0',
  ghost:
    'bg-transparent px-0 text-muted underline underline-offset-4 hover:text-ink hover:no-underline',
  danger:
    'bg-primary text-white shadow-card hover:-translate-y-0.5 hover:bg-primary-strong hover:shadow-card-hover active:translate-y-0',
}

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-[15px]',
  sm: 'px-4 py-2 text-sm',
}

/**
 * Action button.
 *
 * The default `primary` variant uses the light-green brand colour; red stays
 * the accent and danger colour. Every variant uses theme tokens.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        base,
        variants[variant],
        variant === 'ghost' ? '' : sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
