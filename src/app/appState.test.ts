import { beforeEach, describe, expect, it } from 'vitest'

import type { CartLine, Mall, Store } from '../data/types'
import { buildOrder } from '../lib/order'
import { StorageKeys } from '../lib/storage'
import {
  appReducer,
  CART_CLEARED_MESSAGE,
  loadInitialState,
  type AppState,
} from './appState'

const MALL_DEL_SUR: Mall = {
  id: 'mall-del-sur',
  name: 'Mall del Sur',
  district: 'San Juan de Miraflores',
}

const MALL_JOCKEY: Mall = {
  id: 'jockey-plaza',
  name: 'Jockey Plaza',
  district: 'Santiago de Surco',
}

const TOTTUS: Store = {
  id: 'md-tottus',
  mallId: 'mall-del-sur',
  name: 'Tottus',
  category: 'supermercado',
}

const RIPLEY: Store = {
  id: 'md-ripley',
  mallId: 'mall-del-sur',
  name: 'Ripley',
  category: 'tienda por departamento',
}

const LINE: CartLine = {
  sku: 'SKU-0001',
  storeId: 'md-tottus',
  qty: 1,
  unitPrice: 4.9,
}

function baseState(overrides: Partial<AppState> = {}): AppState {
  return {
    accounts: [],
    currentUser: null,
    selectedMall: MALL_DEL_SUR,
    selectedStore: TOTTUS,
    authError: null,
    cart: [LINE],
    orders: [],
    cartNotice: null,
    ...overrides,
  }
}

describe('loadInitialState', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores the cart and the orders from localStorage', () => {
    const order = buildOrder([LINE], 'yape')
    window.localStorage.setItem(StorageKeys.cart, JSON.stringify([LINE]))
    window.localStorage.setItem(StorageKeys.orders, JSON.stringify([order]))

    const state = loadInitialState()

    expect(state.cart).toEqual([LINE])
    expect(state.orders).toEqual([order])
  })

  it('falls back to empty slices when storage is corrupt', () => {
    window.localStorage.setItem(StorageKeys.cart, '{"not":"an array"}')
    window.localStorage.setItem(StorageKeys.orders, 'not-json')

    const state = loadInitialState()

    expect(state.cart).toEqual([])
    expect(state.orders).toEqual([])
  })
})

describe('cart actions', () => {
  it('merges a repeated add into the existing line', () => {
    const state = appReducer(baseState({ cart: [] }), {
      type: 'cart/add',
      line: LINE,
    })
    const merged = appReducer(state, { type: 'cart/add', line: LINE })

    expect(merged.cart).toHaveLength(1)
    expect(merged.cart[0].qty).toBe(2)
  })

  it('clears an existing notice on the next add', () => {
    const state = appReducer(baseState({ cartNotice: 'algo' }), {
      type: 'cart/add',
      line: LINE,
    })

    expect(state.cartNotice).toBeNull()
  })
})

describe('store-scoped cart', () => {
  it('keeps the cart when the same store is reselected', () => {
    const state = appReducer(baseState(), { type: 'store/select', store: TOTTUS })

    expect(state.cart).toEqual([LINE])
    expect(state.cartNotice).toBeNull()
  })

  it('empties the cart and explains why when the store changes', () => {
    const state = appReducer(baseState(), { type: 'store/select', store: RIPLEY })

    expect(state.cart).toEqual([])
    expect(state.cartNotice).toBe(CART_CLEARED_MESSAGE)
  })

  it('empties the cart when the mall changes', () => {
    const state = appReducer(baseState(), { type: 'mall/select', mall: MALL_JOCKEY })

    expect(state.cart).toEqual([])
    expect(state.selectedStore).toBeNull()
    expect(state.cartNotice).toBe(CART_CLEARED_MESSAGE)
  })

  it('keeps the cart when the same mall is reselected', () => {
    const state = appReducer(baseState(), { type: 'mall/select', mall: MALL_DEL_SUR })

    expect(state.cart).toEqual([LINE])
    expect(state.cartNotice).toBeNull()
  })
})

describe('checkout/confirm', () => {
  it('appends the order and empties the cart', () => {
    const order = buildOrder([LINE], 'plin')
    const state = appReducer(baseState(), { type: 'checkout/confirm', order })

    expect(state.orders).toEqual([order])
    expect(state.cart).toEqual([])
    expect(state.cartNotice).toBeNull()
  })
})
