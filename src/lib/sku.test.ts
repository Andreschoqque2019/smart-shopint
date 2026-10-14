import { describe, expect, it } from 'vitest'

import { resolveSku } from './sku'

describe('resolveSku', () => {
  it('finds the product when the sku is sold by the requested store', () => {
    const result = resolveSku('SKU-0001', 'md-tottus')

    expect(result.status).toBe('found')
    if (result.status !== 'found') {
      return
    }
    expect(result.product.name).toBe('Leche Gloria Entera 400g')
    expect(result.product.price).toBe(4.9)
  })

  it('resolves the same sku at a different price in another store', () => {
    const tottus = resolveSku('SKU-0001', 'md-tottus')
    const makro = resolveSku('SKU-0001', 'pn-makro')

    expect(tottus.status).toBe('found')
    expect(makro.status).toBe('found')
    if (tottus.status !== 'found' || makro.status !== 'found') {
      return
    }
    expect(tottus.product.price).toBe(4.9)
    expect(makro.product.price).toBe(4.5)
  })

  it('reports an unknown sku', () => {
    expect(resolveSku('SKU-9999', 'md-tottus')).toEqual({ status: 'unknown' })
  })

  it('reports a sku that exists in the catalog but in another store', () => {
    // SKU-0003 (Aceite Primor 1L) is sold by Makro and Plaza Vea, not Tottus.
    const result = resolveSku('SKU-0003', 'md-tottus')

    expect(result.status).toBe('other-store')
    if (result.status !== 'other-store') {
      return
    }
    expect(result.product.sku).toBe('SKU-0003')
    expect(result.product.storeId).not.toBe('md-tottus')
  })

  it('trims surrounding whitespace before matching', () => {
    const result = resolveSku('  SKU-0001  ', 'md-tottus')

    expect(result.status).toBe('found')
  })

  it('treats a blank payload as unknown', () => {
    expect(resolveSku('   ', 'md-tottus')).toEqual({ status: 'unknown' })
  })
})
