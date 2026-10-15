import { describe, expect, it } from 'vitest'

import { products } from '../data/catalog'
import type { Order } from '../data/types'
import { receiptLines } from './receipt'

const ORDER: Order = {
  id: 'ord-test-1',
  lines: [
    { sku: 'SKU-0001', storeId: 'md-tottus', qty: 3, unitPrice: 4.9 },
    { sku: 'SKU-0002', storeId: 'md-tottus', qty: 1, unitPrice: 5.2 },
  ],
  total: 19.9,
  paymentMethod: 'yape',
  createdAt: '2026-10-12T12:00:00.000Z',
}

describe('receiptLines', () => {
  it('resolves each line name from the catalog by sku and store', () => {
    const lines = receiptLines(ORDER, products)

    expect(lines).toHaveLength(2)
    expect(lines[0].name).toBe('Leche Gloria Entera 400g')
    expect(lines[0].resolved).toBe(true)
    expect(lines[1].name).toBe('Arroz Costeño Extra 1kg')
  })

  it('derives the line total with the integer-cent math', () => {
    const lines = receiptLines(ORDER, products)

    expect(lines[0].total).toBe(14.7)
    expect(lines[1].total).toBe(5.2)
  })

  it('falls back to the sku when a line does not resolve against the seed', () => {
    const orphan: Order = {
      ...ORDER,
      lines: [{ sku: 'SKU-9999', storeId: 'md-tottus', qty: 2, unitPrice: 3 }],
    }

    const lines = receiptLines(orphan, products)

    expect(lines[0].name).toBe('SKU-9999')
    expect(lines[0].resolved).toBe(false)
  })

  it('does not resolve a sku sold by another store', () => {
    const foreign: Order = {
      ...ORDER,
      lines: [{ sku: 'SKU-0003', storeId: 'md-tottus', qty: 1, unitPrice: 12.9 }],
    }

    const lines = receiptLines(foreign, products)

    expect(lines[0].resolved).toBe(false)
    expect(lines[0].name).toBe('SKU-0003')
  })
})
