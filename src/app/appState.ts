import type { Cart, CartLine, Mall, Sku, Store, User } from '../data/types'
import {
  authenticate,
  type AuthError,
  type AuthRecord,
  readAuthRecord,
  registerAccount,
  writeAuthRecord,
} from '../lib/auth'
import { addLine, decrementLine, removeLine } from '../lib/cart'
import { readJSON, removeJSON, StorageKeys, writeJSON } from '../lib/storage'

/**
 * Shown when a mall or store change empties a non-empty cart.
 *
 * Prices are per store, so a cart carried across stores would produce an
 * invalid total; the cart is dropped and the user is told why.
 */
export const CART_CLEARED_MESSAGE =
  'Cambiaste de tienda: los precios son por tienda, así que vaciamos tu carrito.'

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
  /** The persisted cart. Its total is always derived, never stored. */
  cart: Cart
  /** Ephemeral message about the cart (e.g. cleared on a store change). */
  cartNotice: string | null
}

/** Every mutation the app can perform. */
export type AppAction =
  | { type: 'auth/register'; name: string; email: string; password: string }
  | { type: 'auth/login'; email: string; password: string }
  | { type: 'auth/logout' }
  | { type: 'auth/clear-error' }
  | { type: 'mall/select'; mall: Mall }
  | { type: 'store/select'; store: Store }
  | { type: 'cart/add'; line: CartLine }
  | { type: 'cart/decrement'; sku: Sku; storeId: string }
  | { type: 'cart/remove'; sku: Sku; storeId: string }
  | { type: 'cart/clear-notice' }

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

/** Storage guard for a single persisted cart line. */
export function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) {
    return false
  }
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.sku === 'string' &&
    typeof candidate.storeId === 'string' &&
    typeof candidate.qty === 'number' &&
    typeof candidate.unitPrice === 'number'
  )
}

/** Storage guard for the persisted cart. */
export function isCart(value: unknown): value is Cart {
  return Array.isArray(value) && value.every(isCartLine)
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
    cart: readJSON<Cart>(StorageKeys.cart, [], isCart),
    cartNotice: null,
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

    case 'mall/select': {
      // A store only makes sense inside its mall, so the store is always reset.
      // The cart belongs to a store: if the mall actually changes, it is dropped.
      const changedMall = state.selectedMall?.id !== action.mall.id
      const shouldClearCart = changedMall && state.cart.length > 0
      return {
        ...state,
        selectedMall: action.mall,
        selectedStore: null,
        cart: shouldClearCart ? [] : state.cart,
        cartNotice: shouldClearCart ? CART_CLEARED_MESSAGE : state.cartNotice,
      }
    }

    case 'store/select': {
      // The cart is scoped to one store. Keep it only when the incoming store
      // is the one it already belongs to; otherwise drop it and say why.
      const cartStoreId = state.cart[0]?.storeId
      const shouldClearCart =
        cartStoreId !== undefined && cartStoreId !== action.store.id
      return {
        ...state,
        selectedStore: action.store,
        cart: shouldClearCart ? [] : state.cart,
        cartNotice: shouldClearCart ? CART_CLEARED_MESSAGE : state.cartNotice,
      }
    }

    case 'cart/add':
      return {
        ...state,
        cart: addLine(state.cart, action.line),
        cartNotice: null,
      }

    case 'cart/decrement':
      return {
        ...state,
        cart: decrementLine(state.cart, action.sku, action.storeId),
        cartNotice: null,
      }

    case 'cart/remove':
      return {
        ...state,
        cart: removeLine(state.cart, action.sku, action.storeId),
        cartNotice: null,
      }

    case 'cart/clear-notice':
      return state.cartNotice === null ? state : { ...state, cartNotice: null }

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

/** Persists or clears the cart. Only the lines are stored, never the total. */
export function persistCart(state: AppState): void {
  if (state.cart.length > 0) {
    writeJSON(StorageKeys.cart, state.cart)
  } else {
    removeJSON(StorageKeys.cart)
  }
}
