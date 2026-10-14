import { products } from '../data/catalog'
import type { Product } from '../data/types'

/**
 * Outcome of resolving a scanned payload against a store's catalog.
 *
 * The product QR encodes ONLY the sku; price and expiry are looked up from the
 * catalog row. The three variants let the UI tell a valid scan apart from a
 * wrong-store scan and from a completely unknown code.
 */
export type SkuResolution =
  | { status: 'found'; product: Product }
  | { status: 'other-store'; product: Product }
  | { status: 'unknown' }

/**
 * Resolves a scanned payload against the catalog of one store.
 *
 * The payload of a product QR is the sku and nothing else. This function trims
 * the input, requires an EXACT sku match and scopes the lookup to `storeId`, so
 * the same sku sold by another store is never silently accepted: it comes back
 * as `other-store`. Pure and framework-free; it is the testable seam of the QR
 * contract.
 */
export function resolveSku(sku: string, storeId: string): SkuResolution {
  const normalized = sku.trim()

  if (normalized === '') {
    return { status: 'unknown' }
  }

  const inStore = products.find(
    (product) => product.sku === normalized && product.storeId === storeId,
  )
  if (inStore) {
    return { status: 'found', product: inStore }
  }

  const inAnotherStore = products.find((product) => product.sku === normalized)
  if (inAnotherStore) {
    return { status: 'other-store', product: inAnotherStore }
  }

  return { status: 'unknown' }
}
