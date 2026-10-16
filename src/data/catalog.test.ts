import { describe, expect, it } from 'vitest'
import { categories, malls, products, stores } from './catalog'

const skus = Array.from(new Set(products.map((p) => p.sku)))

function rowsFor(sku: string) {
  return products.filter((p) => p.sku === sku)
}

describe('catalog seed', () => {
  it('exposes malls, stores, categories and products', () => {
    expect(malls.length).toBeGreaterThanOrEqual(2)
    expect(stores.length).toBeGreaterThan(0)
    expect(categories.length).toBeGreaterThan(0)
    expect(products.length).toBeGreaterThan(0)
  })

  it('keeps every store wired to a real mall', () => {
    const mallIds = new Set(malls.map((mall) => mall.id))

    for (const store of stores) {
      expect(mallIds.has(store.mallId)).toBe(true)
    }
  })

  it('sells at least one sku in two stores at different prices', () => {
    const multiStoreSkus = skus.filter(
      (sku) => new Set(rowsFor(sku).map((p) => p.storeId)).size >= 2,
    )
    expect(multiStoreSkus.length).toBeGreaterThanOrEqual(1)

    const distinctPriceSkus = multiStoreSkus.filter(
      (sku) => new Set(rowsFor(sku).map((p) => p.price)).size >= 2,
    )
    expect(distinctPriceSkus.length).toBeGreaterThanOrEqual(1)
  })

  it('keeps every product wired to a real store and category', () => {
    const storeIds = new Set(stores.map((store) => store.id))
    const categoryIds = new Set(categories.map((cat) => cat.id))

    for (const product of products) {
      expect(storeIds.has(product.storeId)).toBe(true)
      expect(categoryIds.has(product.categoryId)).toBe(true)
      expect(product.currency).toBe('PEN')
      expect(product.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('carries a catalog for every store, not only grocery-type ones', () => {
    const catalogStoreIds = new Set(products.map((p) => p.storeId))

    for (const store of stores) {
      expect(catalogStoreIds.has(store.id), store.id).toBe(true)
    }
  })

  it('exposes the sku as the scan contract key', () => {
    for (const sku of skus) {
      expect(sku).toMatch(/^SKU-\d{4}$/)
    }
  })
})
