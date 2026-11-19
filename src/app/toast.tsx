import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { Toast } from '../components/ui/Toast'
import { ToastContext } from './toastContext'

interface ToastState {
  message: string
  seq: number
}

const TOAST_DURATION_MS = 2500

/**
 * Global source of transient confirmations.
 *
 * The state deliberately lives outside `AppState`: the app store persists on
 * every change, and a toast must never reach `localStorage`. The sequence
 * counter gives each show a fresh object identity so the effect below clears
 * and restarts the timer even when the same product is added twice in a row.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = useCallback((message: string) => {
    setToast((current) => ({
      message,
      seq: (current?.seq ?? 0) + 1,
    }))
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast.message} />}
    </ToastContext.Provider>
  )
}
