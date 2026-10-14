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
 * Requires a mall selection before the store picker.
 *
 * Redirects back to the mall picker (level 1) when the store list is opened
 * directly without a prior mall choice.
 */
export function RequireMall() {
  const { state } = useAppStore()

  if (!state.selectedMall) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}

/**
 * Requires a store selection before catalog browsing.
 *
 * Sends the visitor to the right level of the flow: back to the mall picker
 * when no mall is set, or to the store picker of the chosen mall when no store
 * has been selected yet.
 */
export function RequireStore() {
  const { state } = useAppStore()

  if (!state.selectedMall) {
    return <Navigate to="/" replace />
  }
  if (!state.selectedStore) {
    return <Navigate to="/stores" replace />
  }
  return <Outlet />
}
