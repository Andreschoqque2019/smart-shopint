import { useEffect, useMemo, useReducer, type ReactNode } from 'react'

import {
  appReducer,
  loadInitialState,
  persistAuth,
  persistSupermarket,
  type AppState,
} from './appState'
import { AppStoreContext } from './store'

interface AppProviderProps {
  children: ReactNode
  /** Seeds the store instead of reading `localStorage` (used by tests). */
  initialState?: AppState
}

/**
 * Provides the app store and keeps `localStorage` in sync with it.
 *
 * State is hydrated once from the typed storage wrapper on mount, then written
 * back whenever it changes.
 */
export function AppProvider({ children, initialState }: AppProviderProps) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
    (seed) => seed ?? loadInitialState(),
  )

  useEffect(() => {
    persistAuth(state)
  }, [state])

  useEffect(() => {
    persistSupermarket(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  )
}
