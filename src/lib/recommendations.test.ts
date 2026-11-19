import { describe, expect, it } from 'vitest'

import type { Promotion } from '../data/promotions'
import type { CartLine, Order, Product } from '../data/types'
import { recommendedPromotions } from './recommendations'

const STORE = 'store-a'
const OTHER_STORE = 'store-b'

function product(
  sku: string,
  categoryId: string,
  overrides: Partial<Product> = {},
): Product {
  return {
    sku,
    name: `Producto ${sku}`,
    categoryId,
    storeId: STORE,
    price: 10,
    currency: 'PEN',
    expiryDate: '2030-01-01',
    ...overrides,
  }
}

function offer(sku: string, discountPercent: number): Promotion {
  return { sku, discountPercent, label: `Oferta ${sku}` }
}

function line(sku: string, overrides: Partial<CartLine> = {}): CartLine {
  return { sku, storeId: STORE, qty: 1, unitPrice: 10, ...overrides }
}

function order(id: string, lines: CartLine[]): Order {
  return {
    id,
    lines,
    total: 10,
    paymentMethod: 'debit',
    createdAt: '2026-01-01T00:00:00.000Z',
  }
}

describe('recommendedPromotions', () => {
  it('only recommends promoted products from the selected store', () => {
    const products = [
      product('SKU-0001', 'cat-a'),
      product('SKU-0002', 'cat-b'),
      product('SKU-0003', 'cat-c', { storeId: OTHER_STORE }),
    ]
    const promotions = [offer('SKU-0001', 10), offer('SKU-0003', 50)]

    const result = recommendedPromotions(products, promotions, [], [], STORE)

    expect(result.map((item) => item.product.sku)).toEqual(['SKU-0001'])
  })

  it('deduplicates a sku repeated in the same store', () => {
    const products = [
      product('SKU-0001', 'cat-a', { price: 10 }),
      product('SKU-0001', 'cat-a', { price: 12 }),
    ]

    const result = recommendedPromotions(
      products,
      [offer('SKU-0001', 25)],
      [],
      [],
      STORE,
    )

    expect(result).toHaveLength(1)
    expect(result[0].price).toBe(7.5)
    expect(result[0].promotion.discountPercent).toBe(25)
  })

  it('lets cart affinity outweigh a bigger discount in order history', () => {
    const products = [
      product('SKU-0001', 'cat-a', { storeId: OTHER_STORE }),
      product('SKU-0002', 'cat-b', { storeId: OTHER_STORE }),
      product('SKU-0003', 'cat-a'),
      product('SKU-0004', 'cat-b'),
      product('SKU-0005', 'cat-a'),
      product('SKU-0006', 'cat-b'),
    ]
    const promotions = [
      offer('SKU-0005', 10),
      offer('SKU-0006', 50),
    ]
    const orders = [order('order-1', [line('SKU-0004')])]

    const result = recommendedPromotions(
      products,
      promotions,
      orders,
      [line('SKU-0003')],
      STORE,
    )

    // cat-a gets 2 points from the cart, cat-b gets 1 from the single order.
    expect(result.map((item) => item.product.sku)).toEqual([
      'SKU-0005',
      'SKU-0006',
    ])
  })

  it('sorts by discount and then sku when there is no affinity signal', () => {
    const products = [
      product('SKU-0003', 'cat-c'),
      product('SKU-0001', 'cat-a'),
      product('SKU-0002', 'cat-b'),
      product('SKU-0004', 'cat-d'),
    ]
    const promotions = [
      offer('SKU-0001', 20),
      offer('SKU-0002', 20),
      offer('SKU-0003', 30),
      offer('SKU-0004', 10),
    ]

    const result = recommendedPromotions(
      products,
      promotions,
      [],
      [line('SKU-UNKNOWN')],
      STORE,
      4,
    )

    expect(result.map((item) => item.product.sku)).toEqual([
      'SKU-0003',
      'SKU-0001',
      'SKU-0002',
      'SKU-0004',
    ])
  })

  it('respects the limit, including zero', () => {
    const products = [
      product('SKU-0001', 'cat-a'),
      product('SKU-0002', 'cat-b'),
      product('SKU-0003', 'cat-c'),
    ]
    const promotions = products.map((item) => offer(item.sku, 15))

    expect(
      recommendedPromotions(products, promotions, [], [], STORE, 2).map(
        (item) => item.product.sku,
      ),
    ).toEqual(['SKU-0001', 'SKU-0002'])
    expect(recommendedPromotions(products, promotions, [], [], STORE, 0)).toEqual(
      [],
    )
  })
})
