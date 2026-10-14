import type { Currency } from '../data/types'

/**
 * Formats a price for display, e.g. `S/ 4.90`.
 *
 * Only the currencies of the mock seed are supported; anything else falls back
 * to the ISO code so a missing symbol never renders an empty string.
 */
export function formatPrice(amount: number, currency: Currency): string {
  const symbol = currency === 'PEN' ? 'S/' : currency
  return `${symbol} ${amount.toFixed(2)}`
}

/**
 * Formats an ISO date (`YYYY-MM-DD`) as `DD/MM/YYYY`.
 *
 * The catalog stores plain ISO dates, so this avoids `Date` parsing and the
 * timezone drift it can introduce. Malformed input is returned unchanged.
 */
export function formatExpiry(iso: string): string {
  const [year, month, day] = iso.split('-')
  if (!year || !month || !day) {
    return iso
  }
  return `${day}/${month}/${year}`
}
