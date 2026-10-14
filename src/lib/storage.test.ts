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
})

describe('writeJSON', () => {
  it('serializes a value as JSON under the given key', () => {
    const line = {
      sku: 'SKU-1001',
      supermarketId: 'sm-mall-del-sur',
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
    const supermarket = { id: 'sm-mall-del-sur', name: 'Mall del Sur' }

    writeJSON(StorageKeys.supermarket, supermarket)

    const restored = readJSON(
      StorageKeys.supermarket,
      null,
      (value): value is typeof supermarket =>
        typeof value === 'object' && value !== null && 'id' in value,
    )

    expect(restored).toEqual(supermarket)
  })

  it('falls back when the key is absent', () => {
    const fallback = { id: 'sm-plaza-vea' }
    expect(readJSON(StorageKeys.supermarket, fallback, () => true)).toBe(
      fallback,
    )
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
    writeJSON(StorageKeys.supermarket, { id: 'sm-mall-del-sur' })

    removeJSON(StorageKeys.supermarket)

    expect(window.localStorage.getItem(StorageKeys.supermarket)).toBeNull()
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
