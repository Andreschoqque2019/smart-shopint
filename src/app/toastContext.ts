import { createContext, useContext } from 'react'

/** The toast contract exposed to components. */
export interface ToastControls {
  /** Shows the shared confirmation, restarting its dismiss timer. */
  showToast: (message: string) => void
}

export const ToastContext = createContext<ToastControls | null>(null)

/** Shows a transient confirmation. Throws when used outside a `ToastProvider`. */
export function useToast(): ToastControls {
  const controls = useContext(ToastContext)
  if (!controls) {
    throw new Error('useToast must be used within a ToastProvider.')
  }
  return controls
}
