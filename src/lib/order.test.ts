import { describe, expect, it } from 'vitest'

import type { CartLine } from '../data/types'
import { buildOrder, createOrderId } from './order'

const LINES: CartLine[] = [
  { sku: 'SKU-0001', storeId: 'md-tottus', qty: 3, unitPrice: 4.9 },
]

describe('createOrderId', () => {
  it('returns distinct ids for two orders created back to back', () => {
    expect(createOrderId()).not.toBe(createOrderId())
  })

  it('is readable and prefixed', () => {
    expect(createOrderId()).toMatch(/^ord-[0-9a-z]+-[0-9a-z]+$/)
  })
})

describe('buildOrder', () => {
  it('snapshots the lines and derives the total', () => {
    const order = buildOrder(LINES, 'yape')

    expect(order.lines).toEqual(LINES)
    expect(order.total).toBe(14.7)
    expect(order.paymentMethod).toBe('yape')
    expect(order.createdAt).not.toBe('')
  })

  it('copies the lines so later cart mutations cannot change a saved order', () => {
    const lines: CartLine[] = [{ ...LINES[0] }]
    const order = buildOrder(lines, 'plin')

    lines[0].qty = 99

    expect(order.lines[0].qty).toBe(3)
  })

  it('gives two consecutive orders distinct ids', () => {
    expect(buildOrder(LINES, 'yape').id).not.toBe(buildOrder(LINES, 'cash').id)
  })
})
