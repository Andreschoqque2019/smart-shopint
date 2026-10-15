import type { CartLine } from '../data/types'

/**
 * Pure cart math and line operations.
 *
 * Money is summed in integer cents, never in floating point: `4.9 * 3` evaluates
 * to `14.700000000000001`, which would leak into the displayed total. Everything
 * here is framework-free so the cart contract is unit-testable without React.
 */

/** Whether a line was built from the given (`sku`, `storeId`) pair. */
export function isSameLine(
  line: CartLine,
  sku: string,
  storeId: string,
): boolean {
  return line.sku === sku && line.storeId === storeId
}

/** Converts a soles amount to integer cents, rounding away float noise. */
function toCents(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Total of a single line in soles.
 *
 * Computed as integer cents so repeated sums stay exact.
 */
export function lineTotal(line: CartLine): number {
  return (toCents(line.unitPrice) * line.qty) / 100
}

/**
 * Total of the cart in soles.
 *
 * The total is ALWAYS derived from the lines and never persisted, so it can
 * never drift from the cart it describes.
 */
export function cartTotal(lines: CartLine[]): number {
  const cents = lines.reduce(
    (sum, line) => sum + toCents(line.unitPrice) * line.qty,
    0,
  )
  return cents / 100
}

/** Number of units in the cart (sum of quantities), for the cart badge. */
export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.qty, 0)
}

/**
 * Adds a line to the cart.
 *
 * Adding a (`sku`, `storeId`) that is already present increments its quantity
 * instead of appending a duplicate line.
 */
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const index = lines.findIndex((item) =>
    isSameLine(item, line.sku, line.storeId),
  )
  if (index === -1) {
    return [...lines, { ...line }]
  }
  return lines.map((item, position) =>
    position === index ? { ...item, qty: item.qty + line.qty } : item,
  )
}

/** Removes one unit of a line, dropping the line when its quantity hits zero. */
export function decrementLine(
  lines: CartLine[],
  sku: string,
  storeId: string,
): CartLine[] {
  return lines.flatMap((line) => {
    if (!isSameLine(line, sku, storeId)) {
      return [line]
    }
    return line.qty > 1 ? [{ ...line, qty: line.qty - 1 }] : []
  })
}

/** Removes a whole line from the cart. */
export function removeLine(
  lines: CartLine[],
  sku: string,
  storeId: string,
): CartLine[] {
  return lines.filter((line) => !isSameLine(line, sku, storeId))
}
