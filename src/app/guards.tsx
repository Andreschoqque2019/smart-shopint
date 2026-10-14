import { Navigate, Outlet } from 'react-router-dom'

import { useAppStore } from './store'

/**
 * Blocks every protected route until a session exists.
 *
 * Implements the auth gate: an unauthenticated visitor is redirected to the
 * register/login screen instead of reaching any other capability.
 */
export function RequireAuth() {
  const { state } = useAppStore()

  if (!state.currentUser) {
    return <Navigate to="/auth" replace />
  }
  return <Outlet />
}

/**
 * Requires a supermarket selection before catalog browsing.
 *
 * Redirects back to the supermarket picker when a protected route is opened
 * directly without a prior selection.
 */
export function RequireSupermarket() {
  const { state } = useAppStore()

  if (!state.selectedSupermarket) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
