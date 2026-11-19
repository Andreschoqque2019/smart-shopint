import { describe, expect, it } from 'vitest'

import { paymentMethodLabels, paymentMethods } from './payment'

describe('payment methods', () => {
  it('offers debit card instead of cash', () => {
    // Widened to string[] so the legacy value can be asserted as absent.
    const methods: string[] = paymentMethods

    expect(methods).toContain('debit')
    expect(methods).not.toContain('cash')
    expect(paymentMethodLabels.debit).toBe('Tarjeta de débito')
    expect(paymentMethodLabels).not.toHaveProperty('cash')
  })
})
