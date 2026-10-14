import type { Supermarket, User } from '../data/types'
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
 * current delivery slice: the account list, the active session, the selected
 * supermarket, and the last auth error shown to the user.
 */
export interface AppState {
  accounts: User[]
  currentUser: User | null
  selectedSupermarket: Supermarket | null
  authError: AuthError | null
}

/** Every mutation the app can perform on `AppState`. */
export type AppAction =
  | { type: 'auth/register'; name: string; email: string; password: string }
  | { type: 'auth/login'; email: string; password: string }
  | { type: 'auth/logout' }
  | { type: 'auth/clear-error' }
  | { type: 'supermarket/select'; supermarket: Supermarket }

/** Storage guard for the persisted supermarket selection. */
export function isSupermarket(value: unknown): value is Supermarket {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' && typeof candidate.name === 'string'
  )
}

/** Builds the initial state by defensively reading `localStorage`. */
export function loadInitialState(): AppState {
  const auth: AuthRecord = readAuthRecord()
  const selectedSupermarket = readJSON<Supermarket | null>(
    StorageKeys.supermarket,
    null,
    isSupermarket,
  )

  return {
    accounts: auth.accounts,
    currentUser: auth.currentUser,
    selectedSupermarket,
    authError: null,
  }
}

/**
 * The single reducer for the app store.
 *
 * Pure: it never touches React or `localStorage`, so auth and supermarket rules
 * can be unit-tested in isolation.
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
        selectedSupermarket: null,
        authError: null,
      }

    case 'auth/clear-error':
      return state.authError === null ? state : { ...state, authError: null }

    case 'supermarket/select':
      return { ...state, selectedSupermarket: action.supermarket }

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

/** Persists or clears the supermarket selection. */
export function persistSupermarket(state: AppState): void {
  if (state.selectedSupermarket) {
    writeJSON(StorageKeys.supermarket, state.selectedSupermarket)
  } else {
    removeJSON(StorageKeys.supermarket)
  }
}
