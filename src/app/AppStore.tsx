import { useEffect, useMemo, useReducer, type ReactNode } from 'react'

import {
  appReducer,
  loadInitialState,
  persistAuth,
  persistCart,
  persistMall,
  persistOrders,
  persistStore,
  type AppState,
} from './appState'
import { AppStoreContext } from './store'

interface AppProviderProps {
  children: ReactNode
  /** Seeds the store instead of reading `localStorage` (used by tests). */
  initialState?: AppState
}

/**
 * Provides the app store.
 *
 * The state is hydrated from `localStorage` once on boot and written back
 * whenever the auth record or the mall/store selection changes.
 */
export function AppProvider({ children, initialState }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, undefined, () =>
    initialState ?? loadInitialState(),
  )

  useEffect(() => {
    persistAuth(state)
  }, [state])

  useEffect(() => {
    persistMall(state)
  }, [state])

  useEffect(() => {
    persistStore(state)
  }, [state])

  useEffect(() => {
    persistCart(state)
  }, [state])

  useEffect(() => {
    persistOrders(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  )
}
