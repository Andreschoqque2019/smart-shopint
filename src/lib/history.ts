import type { Order } from '../data/types'

/**
 * Purchase-history helpers.
 *
 * The history is a pure projection of the persisted orders: nothing here touches
 * React or `localStorage`. Orders are ordered by `createdAt` and never by `id`,
 * because the id is only unique (a timestamp plus a counter), not chronological.
 */

/** Parses an ISO timestamp, falling back to 0 for malformed input. */
function timestamp(value: string): number {
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

/**
 * Returns a new list of orders, most recent first.
 *
 * The input array is never mutated, so the store keeps its insertion order.
 */
export function ordersNewestFirst(orders: Order[]): Order[] {
  return [...orders].sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))
}

/** Finds an order by its id, or `undefined` when it does not exist. */
export function findOrder(orders: Order[], orderId: string): Order | undefined {
  return orders.find((order) => order.id === orderId)
}
