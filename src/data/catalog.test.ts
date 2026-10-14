import { describe, expect, it } from 'vitest'
import { categories, products, supermarkets } from './catalog'

const skus = Array.from(new Set(products.map((p) => p.sku)))

function rowsFor(sku: string) {
  return products.filter((p) => p.sku === sku)
}

describe('catalog seed', () => {
  it('exposes supermarkets, categories and products', () => {
    expect(supermarkets.length).toBeGreaterThanOrEqual(2)
    expect(categories.length).toBeGreaterThan(0)
    expect(products.length).toBeGreaterThan(0)
  })

  it('sells at least one sku in two supermarkets at different prices', () => {
    const multiSupermarketSkus = skus.filter(
      (sku) => new Set(rowsFor(sku).map((p) => p.supermarketId)).size >= 2,
    )
    expect(multiSupermarketSkus.length).toBeGreaterThanOrEqual(1)

    const distinctPriceSkus = multiSupermarketSkus.filter(
      (sku) => new Set(rowsFor(sku).map((p) => p.price)).size >= 2,
    )
    expect(distinctPriceSkus.length).toBeGreaterThanOrEqual(1)
  })

  it('keeps every product wired to a real supermarket and category', () => {
    const supermarketIds = new Set(supermarkets.map((s) => s.id))
    const categoryIds = new Set(categories.map((c) => c.id))

    for (const product of products) {
      expect(supermarketIds.has(product.supermarketId)).toBe(true)
      expect(categoryIds.has(product.categoryId)).toBe(true)
      expect(product.currency).toBe('PEN')
      expect(product.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
  })

  it('exposes the sku as the scan contract key', () => {
    for (const sku of skus) {
      expect(sku).toMatch(/^SKU-\d{4}$/)
    }
  })
})
