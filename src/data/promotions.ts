import type { Sku } from './types'

/**
 * A local, simulated offer keyed by sku.
 *
 * Promotions are store-independent: every store selling a promoted sku can show
 * the offer at its own catalog price. There is no backend and no network call.
 */
export interface Promotion {
  sku: Sku
  discountPercent: number
  label: string
}

/**
 * The demo campaign. The selected skus span the three catalog universes
 * (grocery, department store and home center) so every store type has offers.
 */
export const promotions: Promotion[] = [
  { sku: 'SKU-0001', discountPercent: 20, label: 'Oferta en lácteos' },
  { sku: 'SKU-0004', discountPercent: 15, label: 'Pastas a precio especial' },
  { sku: 'SKU-0006', discountPercent: 10, label: 'Bebidas en oferta' },
  { sku: 'SKU-0010', discountPercent: 25, label: 'Snacks con descuento' },
  { sku: 'SKU-0013', discountPercent: 30, label: 'Limpieza del hogar en oferta' },
  { sku: 'SKU-0016', discountPercent: 20, label: 'Moda de mujer en oferta' },
  { sku: 'SKU-0018', discountPercent: 15, label: 'Moda de hombre en oferta' },
  { sku: 'SKU-0021', discountPercent: 25, label: 'Tecnología con descuento' },
  { sku: 'SKU-0022', discountPercent: 15, label: 'Herramientas en oferta' },
  { sku: 'SKU-0027', discountPercent: 30, label: 'Iluminación en oferta' },
]

/** Finds the campaign offer for a sku, if any. */
export function promotionFor(sku: Sku): Promotion | undefined {
  return promotions.find((promotion) => promotion.sku === sku)
}

/**
 * Applies the discount in integer cents to avoid leaking float noise.
 *
 * `price` is expressed in soles with at most two decimals, so multiplying by
 * `(100 - discountPercent)` yields the result in cents before the final divide.
 */
export function promotionPrice(price: number, promotion: Promotion): number {
  return Math.round(price * (100 - promotion.discountPercent)) / 100
}
