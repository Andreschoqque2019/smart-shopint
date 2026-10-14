import type { Mall, Store, User } from '../data/types'
import {
  authenticate,
  type AuthError,
  type AuthRecord,
  readAuthRecord,
  registerAccount,
  writeAuthRecord,
} from '../lib/auth'
import { readJSON, removeJSON, StorageKeys, writeJSON } from '../lib/storage'

/**
 * App-wide mutable state for the mock store.
 *
 * The state is hydrated from `localStorage` on boot and written back whenever
 * it changes (see `AppStore.tsx`). It holds only the slices owned by the
 * current delivery slice: the account list, the active session, the mall and
 * store selection, and the last auth error shown to the user.
 */
export interface AppState {
  accounts: User[]
  currentUser: User | null
  selectedMall: Mall | null
  selectedStore: Store | null
  authError: AuthError | null
}

/** Every mutation the app can perform. */
export type AppAction =
  | { type: 'auth/register'; name: string; email: string; password: string }
  | { type: 'auth/login'; email: string; password: string }
  | { type: 'auth/logout' }
  | { type: 'auth/clear-error' }
  | { type: 'mall/select'; mall: Mall }
  | { type: 'store/select'; store: Store }

/** Storage guard for the persisted mall selection. */
export function isMall(value: unknown): value is Mall {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.district === 'string'
  )
}

/** Storage guard for the persisted store selection. */
export function isStore(value: unknown): value is Store {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.mallId === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.category === 'string'
  )
}

/** Reads the persisted app state, falling back to empty slices. */
export function loadInitialState(): AppState {
  const auth = readAuthRecord()
  return {
    accounts: auth.accounts,
    currentUser: auth.currentUser,
    selectedMall: readJSON<Mall | null>(StorageKeys.mall, null, isMall),
    selectedStore: readJSON<Store | null>(StorageKeys.store, null, isStore),
    authError: null,
  }
}

/**
 * App reducer.
 *
 * Pure and exhaustive over {@link AppAction}: it never touches `localStorage`.
 * Selecting a mall always clears the previously selected store, because a store
 * only makes sense inside the mall that contains it.
 */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'auth/register': {
      const { record, error } = registerAccount(
        { accounts: state.accounts, currentUser: state.currentUser },
        { name: action.name, email: action.email, password: action.password },
      )
      if (error) {
        return { ...state, authError: error }
      }
      return {
        ...state,
        accounts: record.accounts,
        currentUser: record.currentUser,
        authError: null,
      }
    }

    case 'auth/login': {
      const { record, error } = authenticate(
        { accounts: state.accounts, currentUser: state.currentUser },
        { email: action.email, password: action.password },
      )
      if (error) {
        return { ...state, authError: error }
      }
      return { ...state, currentUser: record.currentUser, authError: null }
    }

    case 'auth/logout':
      return {
        ...state,
        currentUser: null,
        selectedMall: null,
        selectedStore: null,
        authError: null,
      }

    case 'auth/clear-error':
      return state.authError === null ? state : { ...state, authError: null }

    case 'mall/select':
      return { ...state, selectedMall: action.mall, selectedStore: null }

    case 'store/select':
      return { ...state, selectedStore: action.store }

    default:
      return state
  }
}

/** Persists the auth-owned part of the state. */
export function persistAuth(state: AppState): void {
  const auth: AuthRecord = {
    accounts: state.accounts,
    currentUser: state.currentUser,
  }
  writeAuthRecord(auth)
}

/** Persists or clears the mall selection. */
export function persistMall(state: AppState): void {
  if (state.selectedMall) {
    writeJSON(StorageKeys.mall, state.selectedMall)
  } else {
    removeJSON(StorageKeys.mall)
  }
}

/** Persists or clears the store selection. */
export function persistStore(state: AppState): void {
  if (state.selectedStore) {
    writeJSON(StorageKeys.store, state.selectedStore)
  } else {
    removeJSON(StorageKeys.store)
  }
}
