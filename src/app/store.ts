import { createContext, useContext, type Dispatch } from 'react'

import type { AppAction, AppState } from './appState'

/** The store contract exposed to components. */
export interface AppStore {
  state: AppState
  dispatch: Dispatch<AppAction>
}

export const AppStoreContext = createContext<AppStore | null>(null)

/** Reads the app store. Throws when used outside an `AppProvider`. */
export function useAppStore(): AppStore {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within an AppProvider.')
  }
  return store
}
