import { describe, expect, it } from 'vitest'

import { products, stores } from './catalog'
import { promotionFor, promotionPrice, promotions } from './promotions'
import type { Promotion } from './promotions'
import type { StoreCategory } from './types'

function offer(discountPercent: number): Promotion {
  return { sku: 'SKU-TEST', discountPercent, label: 'Oferta de prueba' }
}

describe('promotion data', () => {
  it('has between eight and ten distinct offers', () => {
    expect(promotions.length).toBeGreaterThanOrEqual(8)
    expect(promotions.length).toBeLessThanOrEqual(10)
    expect(new Set(promotions.map((item) => item.sku)).size).toBe(
      promotions.length,
    )
  })

  it('uses only real catalog skus', () => {
    const catalogSkus = new Set(products.map((product) => product.sku))

    for (const promotion of promotions) {
      expect(catalogSkus.has(promotion.sku), promotion.sku).toBe(true)
    }
  })

  it('covers grocery, department and home-center stores', () => {
    const promotedSkus = new Set(promotions.map((item) => item.sku))
    const universes: StoreCategory[] = [
      'supermercado',
      'tienda por departamento',
      'home center',
    ]

    for (const category of universes) {
      const storeIds = new Set(
        stores
          .filter((store) => store.category === category)
          .map((store) => store.id),
      )
      const offered = products.some(
        (product) =>
          storeIds.has(product.storeId) && promotedSkus.has(product.sku),
      )
      expect(offered, category).toBe(true)
    }
  })
})

describe('promotionFor', () => {
  it('finds a promoted sku', () => {
    expect(promotionFor('SKU-0001')).toEqual(promotions[0])
  })

  it('returns undefined for an unpromoted sku', () => {
    expect(promotionFor('SKU-9999')).toBeUndefined()
  })
})

describe('promotionPrice', () => {
  it('applies the discount in integer cents', () => {
    expect(promotionPrice(4.9, offer(20))).toBe(3.92)
    expect(promotionPrice(12.9, offer(30))).toBe(9.03)
  })

  it('rounds a half cent up instead of leaking float noise', () => {
    expect(promotionPrice(7.95, offer(10))).toBe(7.16)
  })

  it('keeps the price unchanged for a zero discount', () => {
    expect(promotionPrice(4.9, offer(0))).toBe(4.9)
  })
})
