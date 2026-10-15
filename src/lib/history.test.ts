import { describe, expect, it } from 'vitest'

import type { CartLine, Order } from '../data/types'
import { findOrder, ordersNewestFirst } from './history'

const LINE: CartLine = {
  sku: 'SKU-0001',
  storeId: 'md-tottus',
  qty: 1,
  unitPrice: 4.9,
}

function order(id: string, createdAt: string): Order {
  return { id, lines: [LINE], total: 4.9, paymentMethod: 'yape', createdAt }
}

describe('ordersNewestFirst', () => {
  it('orders by createdAt, most recent first, regardless of input order', () => {
    const oldest = order('ord-old', '2026-10-10T12:00:00.000Z')
    const middle = order('ord-mid', '2026-10-11T12:00:00.000Z')
    const newest = order('ord-new', '2026-10-12T12:00:00.000Z')

    const sorted = ordersNewestFirst([middle, oldest, newest])

    expect(sorted.map((item) => item.id)).toEqual([
      'ord-new',
      'ord-mid',
      'ord-old',
    ])
  })

  it('does not mutate the input list', () => {
    const input = [
      order('ord-a', '2026-10-10T12:00:00.000Z'),
      order('ord-b', '2026-10-12T12:00:00.000Z'),
    ]
    const snapshot = input.map((item) => item.id)

    ordersNewestFirst(input)

    expect(input.map((item) => item.id)).toEqual(snapshot)
  })

  it('keeps the list stable when timestamps are malformed', () => {
    const sorted = ordersNewestFirst([
      order('ord-a', 'not-a-date'),
      order('ord-b', '2026-10-12T12:00:00.000Z'),
    ])

    expect(sorted.map((item) => item.id)).toEqual(['ord-b', 'ord-a'])
  })
})

describe('findOrder', () => {
  it('returns the order with the given id', () => {
    const target = order('ord-target', '2026-10-12T12:00:00.000Z')
    const found = findOrder([order('ord-other', '2026-10-10T12:00:00.000Z'), target], 'ord-target')

    expect(found).toEqual(target)
  })

  it('returns undefined for an unknown id', () => {
    expect(findOrder([order('ord-a', '2026-10-10T12:00:00.000Z')], 'nope')).toBeUndefined()
  })
})
