import { aisles, categories } from '../data/catalog'
import type { Aisle, Product } from '../data/types'

/**
 * Pure aisle resolution and grouping.
 *
 * The aisle layout is data (`src/data/catalog.ts`); everything here is derived
 * from it, so a store only ever shows the aisles that actually hold its
 * products. Aisle membership is many-to-one: one aisle can carry SEVERAL
 * categories, and this module never assumes otherwise.
 */

/** An aisle together with the visible products that belong to it. */
export interface AisleGroup {
  aisle: Aisle
  items: Product[]
}

/**
 * Resolves the aisle that holds a category.
 *
 * Returns `undefined` for an unknown category, so callers can simply skip the
 * aisle label instead of crashing on unmapped data.
 */
export function resolveAisle(categoryId: string): Aisle | undefined {
  const category = categories.find((item) => item.id === categoryId)
  if (!category) {
    return undefined
  }
  return aisles.find((aisle) => aisle.id === category.aisleId)
}

/**
 * Groups products by the aisle their category belongs to.
 *
 * Returns the aisles in numeric order, each with its resolved items, and DROPS
 * every aisle that has no items: a store must never show an empty aisle. The
 * `aisleList` parameter is injectable so the many-to-one behavior is testable
 * without touching the demo seed.
 */
export function groupProductsByAisle(
  products: Product[],
  aisleList: Aisle[] = aisles,
): AisleGroup[] {
  return [...aisleList]
    .sort((left, right) => left.number - right.number)
    .map((aisle) => ({
      aisle,
      items: products.filter((product) =>
        aisle.categoryIds.includes(product.categoryId),
      ),
    }))
    .filter((group) => group.items.length > 0)
}
