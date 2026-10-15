import type { PaymentMethod } from '../data/types'

/**
 * Simulated payment methods offered at checkout.
 *
 * These are the methods a Peruvian shopper would recognise, but the app never
 * calls a payment provider: the checkout is a local simulation only.
 */
export const paymentMethods: PaymentMethod[] = ['yape', 'plin', 'cash']

/** Spanish labels shown on the checkout screen, per simulated method. */
export const paymentMethodLabels: Record<PaymentMethod, string> = {
  yape: 'Yape',
  plin: 'Plin',
  cash: 'Efectivo',
}
