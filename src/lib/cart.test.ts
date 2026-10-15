import { describe, expect, it } from 'vitest'

import type { CartLine } from '../data/types'
import {
  addLine,
  cartCount,
  cartTotal,
  decrementLine,
  lineTotal,
  removeLine,
} from './cart'
import { formatPrice } from './format'

function line(overrides: Partial<CartLine> = {}): CartLine {
  return {
    sku: 'SKU-0001',
    storeId: 'md-tottus',
    qty: 1,
    unitPrice: 4.9,
    ...overrides,
  }
}

describe('cartTotal', () => {
  it('sums a line in integer cents (3 x 4.9 is exactly S/ 14.70)', () => {
    const total = cartTotal([line({ qty: 3 })])

    // Naive float math gives 14.700000000000001; the formatted total must not.
    expect(total).toBe(14.7)
    expect(formatPrice(total, 'PEN')).toBe('S/ 14.70')
  })

  it('adds several lines without float drift', () => {
    const lines = [
      line({ qty: 3, unitPrice: 4.9 }),
      line({ sku: 'SKU-0002', qty: 2, unitPrice: 5.2 }),
      line({ sku: 'SKU-0003', qty: 1, unitPrice: 12.9 }),
    ]

    // 14.70 + 10.40 + 12.90
    expect(formatPrice(cartTotal(lines), 'PEN')).toBe('S/ 38.00')
  })

  it('is zero for an empty cart', () => {
    expect(cartTotal([])).toBe(0)
  })
})

describe('lineTotal', () => {
  it('multiplies the snapshot unit price by the quantity', () => {
    expect(lineTotal(line({ qty: 3 }))).toBe(14.7)
  })
})

describe('addLine', () => {
  it('appends a new line', () => {
    const result = addLine([], line())

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(line())
  })

  it('increments quantity for an existing (sku, storeId) instead of duplicating', () => {
    const result = addLine([line({ qty: 2 })], line({ qty: 1 }))

    expect(result).toHaveLength(1)
    expect(result[0].qty).toBe(3)
  })

  it('keeps lines of different stores apart', () => {
    const result = addLine([line({ storeId: 'md-tottus' })], line({ storeId: 'jp-plaza-vea' }))

    expect(result).toHaveLength(2)
  })
})

describe('decrementLine', () => {
  it('removes one unit at a time', () => {
    const result = decrementLine([line({ qty: 2 })], 'SKU-0001', 'md-tottus')

    expect(result).toHaveLength(1)
    expect(result[0].qty).toBe(1)
  })

  it('drops the line once its quantity reaches zero', () => {
    expect(decrementLine([line({ qty: 1 })], 'SKU-0001', 'md-tottus')).toEqual([])
  })
})

describe('removeLine', () => {
  it('removes the whole line from the cart', () => {
    const result = removeLine(
      [line(), line({ sku: 'SKU-0002' })],
      'SKU-0001',
      'md-tottus',
    )

    expect(result).toHaveLength(1)
    expect(result[0].sku).toBe('SKU-0002')
  })

  it('leaves an empty cart when the last line is removed', () => {
    expect(removeLine([line()], 'SKU-0001', 'md-tottus')).toEqual([])
  })

  it('only removes the line matching the store', () => {
    const result = removeLine(
      [line({ storeId: 'md-tottus' }), line({ storeId: 'jp-plaza-vea' })],
      'SKU-0001',
      'md-tottus',
    )

    expect(result).toHaveLength(1)
    expect(result[0].storeId).toBe('jp-plaza-vea')
  })
})

describe('cartCount', () => {
  it('sums quantities across lines', () => {
    expect(
      cartCount([line({ qty: 3 }), line({ sku: 'SKU-0002', qty: 2 })]),
    ).toBe(5)
  })
})
