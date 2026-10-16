import { describe, expect, it } from 'vitest'

import { aisles, categories, products } from '../data/catalog'
import type { Aisle, Product } from '../data/types'
import { groupProductsByAisle, resolveAisle } from './aisles'

function product(overrides: Partial<Product> = {}): Product {
  return {
    sku: 'SKU-0001',
    name: 'Leche Gloria Entera 400g',
    categoryId: 'cat-dairy',
    storeId: 'md-tottus',
    price: 4.9,
    currency: 'PEN',
    expiryDate: '2027-03-15',
    ...overrides,
  }
}

function itemsOf(storeId: string): Product[] {
  return products.filter((row) => row.storeId === storeId)
}

describe('resolveAisle', () => {
  it('maps every seeded category to an aisle', () => {
    for (const category of categories) {
      const aisle = resolveAisle(category.id)

      expect(aisle).toBeDefined()
      expect(aisle!.id).toBe(category.aisleId)
    }
  })

  it('returns undefined for an unknown category', () => {
    expect(resolveAisle('cat-missing')).toBeUndefined()
  })

  it('keeps the aisle and category mappings in agreement', () => {
    for (const aisle of aisles) {
      for (const categoryId of aisle.categoryIds) {
        expect(resolveAisle(categoryId)?.id).toBe(aisle.id)
      }
    }

    for (const category of categories) {
      const aisle = aisles.find((item) => item.id === category.aisleId)
      expect(aisle?.categoryIds).toContain(category.id)
    }
  })
})

describe('groupProductsByAisle', () => {
  it('orders the aisles by their number', () => {
    const result = groupProductsByAisle(itemsOf('pn-makro'))
    const numbers = result.map((group) => group.aisle.number)

    expect(numbers.length).toBeGreaterThan(1)
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b))
  })

  it('drops every aisle with no products for the store', () => {
    // Metro only sells groceries and dairy, so the other aisles must not appear.
    const result = groupProductsByAisle(itemsOf('pn-metro'))

    expect(result.map((group) => group.aisle.number)).toEqual([1, 2])
  })

  it('groups every category of a multi-category aisle into a single group', () => {
    const multi: Aisle = {
      id: 'aisle-mixed',
      number: 9,
      name: 'Mixto',
      categoryIds: ['cat-groceries', 'cat-snacks'],
    }

    const result = groupProductsByAisle(itemsOf('md-tottus'), [multi])

    expect(result).toHaveLength(1)
    expect(result[0].items.length).toBeGreaterThan(1)
    expect(
      result[0].items.every((item) =>
        ['cat-groceries', 'cat-snacks'].includes(item.categoryId),
      ),
    ).toBe(true)
  })

  it('places each product in the aisle of its own category', () => {
    const result = groupProductsByAisle(itemsOf('jp-plaza-vea'))

    for (const group of result) {
      for (const item of group.items) {
        expect(resolveAisle(item.categoryId)?.id).toBe(group.aisle.id)
      }
    }
  })

  it('returns an empty list when nothing matches', () => {
    const result = groupProductsByAisle([
      product({ categoryId: 'cat-missing' }),
    ])

    expect(result).toEqual([])
  })
})
