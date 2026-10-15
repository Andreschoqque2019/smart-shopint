import type { CartLine, Order, PaymentMethod } from '../data/types'
import { cartTotal } from './cart'

/**
 * Order construction for the simulated checkout.
 *
 * The id is readable and unique within a session: a timestamp plus a module
 * counter. `crypto.randomUUID` is intentionally avoided because it is not
 * reliably available under jsdom, and this id is what the receipt QR of a later
 * slice will encode, so it must be stable and testable.
 */

/** Module-level sequence; guarantees distinct ids within the same millisecond. */
let orderSequence = 0

/** Builds a unique, readable order id, e.g. `ord-lq3k9z-1`. */
export function createOrderId(now: Date = new Date()): string {
  orderSequence += 1
  return `ord-${now.getTime().toString(36)}-${orderSequence.toString(36)}`
}

/**
 * Snapshots the cart into a confirmed (simulated) order.
 *
 * Lines are copied and the total is derived from them, so an order keeps the
 * prices captured at checkout even if the catalog changes afterwards.
 */
export function buildOrder(
  lines: CartLine[],
  paymentMethod: PaymentMethod,
  now: Date = new Date(),
): Order {
  return {
    id: createOrderId(now),
    lines: lines.map((line) => ({ ...line })),
    total: cartTotal(lines),
    paymentMethod,
    createdAt: now.toISOString(),
  }
}
