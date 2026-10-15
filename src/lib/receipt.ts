import type { Order, Product } from '../data/types'
import { lineTotal } from './cart'

/**
 * Receipt projection for a confirmed order.
 *
 * A `CartLine` deliberately stores no product name, so each line's name is
 * resolved from the catalog by the (`sku`, `storeId`) pair. When a line does not
 * resolve against the seed (for example an order persisted before a catalog
 * change), the sku is shown instead so the receipt render never breaks.
 */
export interface ReceiptLine {
  sku: string
  name: string
  qty: number
  unitPrice: number
  /** Line total in soles, derived with the shared integer-cent math. */
  total: number
  /** `true` when the name came from the catalog, `false` when it fell back to the sku. */
  resolved: boolean
}

/** Resolves the lines of an order into printable receipt rows. */
export function receiptLines(order: Order, products: Product[]): ReceiptLine[] {
  return order.lines.map((line) => {
    const product = products.find(
      (item) => item.sku === line.sku && item.storeId === line.storeId,
    )
    return {
      sku: line.sku,
      name: product ? product.name : line.sku,
      qty: line.qty,
      unitPrice: line.unitPrice,
      total: lineTotal(line),
      resolved: product !== undefined,
    }
  })
}
