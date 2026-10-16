import type { InputHTMLAttributes } from 'react'

import { cn } from './cn'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
}

/** Labelled text input with the shared control styling. */
export function TextField({ label, className, ...rest }: TextFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-muted">
      {label}
      <input
        className={cn(
          'w-full rounded-control bg-soft px-4 py-3 text-[15px] font-normal text-ink outline-none transition-all duration-200 placeholder:text-subtle focus:ring-2 focus:ring-primary/30',
          className,
        )}
        {...rest}
      />
    </label>
  )
}
