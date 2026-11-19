import { describe, expect, it } from 'vitest'

import {
  checkoutReducer,
  checkoutView,
  type CheckoutState,
} from './checkout'

describe('checkoutReducer', () => {
  it('moves idle -> methodSelected on select', () => {
    expect(
      checkoutReducer({ status: 'idle' }, { type: 'select', method: 'yape' }),
    ).toEqual({ status: 'methodSelected', method: 'yape' })
  })

  it('ignores confirm before a method is chosen', () => {
    expect(checkoutReducer({ status: 'idle' }, { type: 'confirm' })).toEqual({
      status: 'idle',
    })
  })

  it('moves methodSelected -> confirming on confirm', () => {
    const selected = checkoutReducer(
      { status: 'idle' },
      { type: 'select', method: 'plin' },
    )

    expect(checkoutReducer(selected, { type: 'confirm' })).toEqual({
      status: 'confirming',
      method: 'plin',
    })
  })

  it('completes at done, keeping the chosen method and the order id', () => {
    const confirming: CheckoutState = { status: 'confirming', method: 'debit' }

    expect(
      checkoutReducer(confirming, { type: 'complete', orderId: 'ord-1' }),
    ).toEqual({ status: 'done', method: 'debit', orderId: 'ord-1' })
  })

  it('ignores events that do not apply to the current state', () => {
    expect(
      checkoutReducer({ status: 'idle' }, { type: 'complete', orderId: 'x' }),
    ).toEqual({ status: 'idle' })

    const done: CheckoutState = { status: 'done', method: 'yape', orderId: 'x' }
    expect(
      checkoutReducer(done, { type: 'select', method: 'plin' }),
    ).toEqual(done)
  })
})

describe('checkoutView', () => {
  it('blocks an empty cart', () => {
    expect(checkoutView({ status: 'idle' }, true)).toEqual({ status: 'blocked' })
  })

  it('keeps the machine state when the cart has items', () => {
    expect(checkoutView({ status: 'idle' }, false)).toEqual({ status: 'idle' })
  })

  it('lets done win over the empty cart it just produced', () => {
    const done: CheckoutState = { status: 'done', method: 'yape', orderId: 'ord-1' }

    expect(checkoutView(done, true)).toEqual(done)
  })
})
