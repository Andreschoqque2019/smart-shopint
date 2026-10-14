import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearNamespace,
  readJSON,
  removeJSON,
  StorageKeys,
  STORAGE_NAMESPACE,
  writeJSON,
} from './storage'

beforeEach(() => {
  window.localStorage.clear()
})

describe('storage keys', () => {
  it('versions every key with the storage namespace', () => {
    for (const key of Object.values(StorageKeys)) {
      expect(key.startsWith(`${STORAGE_NAMESPACE}:`)).toBe(true)
    }
  })

  it('uses the bumped namespace so old selections are invalidated', () => {
    expect(STORAGE_NAMESPACE).toBe('shopint:v2')

    window.localStorage.setItem(
      'shopint:v1:supermarket',
      JSON.stringify({ id: 'sm-makro' }),
    )

    expect(readJSON(StorageKeys.store, null, () => true)).toBeNull()
    expect(readJSON(StorageKeys.mall, null, () => true)).toBeNull()
  })
})

describe('writeJSON', () => {
  it('serializes a value as JSON under the given key', () => {
    const line = {
      sku: 'SKU-1001',
      storeId: 'md-tottus',
      qty: 2,
      unitPrice: 7.9,
    }

    writeJSON(StorageKeys.cart, [line])

    const raw = window.localStorage.getItem(StorageKeys.cart)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw as string)).toEqual([line])
  })
})

describe('readJSON', () => {
  it('round-trips a written value', () => {
    const mall = {
      id: 'mall-del-sur',
      name: 'Mall del Sur',
      district: 'San Juan de Miraflores',
    }

    writeJSON(StorageKeys.mall, mall)

    const restored = readJSON(
      StorageKeys.mall,
      null,
      (value): value is typeof mall =>
        typeof value === 'object' && value !== null && 'id' in value,
    )

    expect(restored).toEqual(mall)
  })

  it('falls back when the key is absent', () => {
    const fallback = { id: 'jp-plaza-vea' }
    expect(readJSON(StorageKeys.store, fallback, () => true)).toBe(fallback)
  })

  it('falls back when the stored text is corrupt JSON', () => {
    window.localStorage.setItem(StorageKeys.cart, '{not json')

    const fallback: unknown[] = []
    expect(readJSON(StorageKeys.cart, fallback, Array.isArray)).toBe(fallback)
  })

  it('falls back when the parsed value fails validation', () => {
    writeJSON(StorageKeys.orders, { wrong: 'shape' })

    const fallback: unknown[] = []
    expect(readJSON(StorageKeys.orders, fallback, Array.isArray)).toBe(fallback)
  })

  it('never throws when the validator itself throws', () => {
    writeJSON(StorageKeys.auth, { id: 'user-1' })

    const fallback = null
    const explode = () => {
      throw new Error('validator exploded')
    }

    expect(() => readJSON(StorageKeys.auth, fallback, explode)).not.toThrow()
    expect(readJSON(StorageKeys.auth, fallback, explode)).toBe(fallback)
  })
})

describe('removeJSON', () => {
  it('removes a single entry', () => {
    writeJSON(StorageKeys.store, { id: 'md-tottus' })

    removeJSON(StorageKeys.store)

    expect(window.localStorage.getItem(StorageKeys.store)).toBeNull()
  })
})

describe('clearNamespace', () => {
  it('removes shopint entries and keeps unrelated keys', () => {
    writeJSON(StorageKeys.auth, { id: 'user-1' })
    writeJSON(StorageKeys.cart, [])
    window.localStorage.setItem('other-app:token', 'keep-me')

    clearNamespace()

    expect(window.localStorage.getItem(StorageKeys.auth)).toBeNull()
    expect(window.localStorage.getItem(StorageKeys.cart)).toBeNull()
    expect(window.localStorage.getItem('other-app:token')).toBe('keep-me')
  })
})
