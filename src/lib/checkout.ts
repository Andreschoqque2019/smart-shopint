import type { PaymentMethod } from '../data/types'

/**
 * Checkout finite state machine.
 *
 * The happy path is `idle -> methodSelected -> confirming -> done`. The
 * `blocked` state is DERIVED from the cart (see {@link checkoutView}): reaching
 * checkout with an empty cart never enters the machine's happy path.
 */

/** States of the checkout simulation. */
export type CheckoutState =
  | { status: 'idle' }
  | { status: 'methodSelected'; method: PaymentMethod }
  | { status: 'confirming'; method: PaymentMethod }
  | { status: 'done'; method: PaymentMethod; orderId: string }

/** Events that move the machine. */
export type CheckoutEvent =
  | { type: 'select'; method: PaymentMethod }
  | { type: 'confirm' }
  | { type: 'complete'; orderId: string }

/** The state the checkout screen renders, including the derived `blocked`. */
export type CheckoutView = CheckoutState | { status: 'blocked' }

export const initialCheckoutState: CheckoutState = { status: 'idle' }

/**
 * Pure transition function.
 *
 * Events that do not apply to the current state are ignored, so the machine can
 * never confirm before a method is chosen or complete before confirming.
 */
export function checkoutReducer(
  state: CheckoutState,
  event: CheckoutEvent,
): CheckoutState {
  switch (state.status) {
    case 'idle':
      return event.type === 'select'
        ? { status: 'methodSelected', method: event.method }
        : state

    case 'methodSelected':
      if (event.type === 'select') {
        return { status: 'methodSelected', method: event.method }
      }
      if (event.type === 'confirm') {
        return { status: 'confirming', method: state.method }
      }
      return state

    case 'confirming':
      return event.type === 'complete'
        ? { status: 'done', method: state.method, orderId: event.orderId }
        : state

    case 'done':
      return state
  }
}

/**
 * Derives the screen state from the machine state and cart emptiness.
 *
 * `done` wins over emptiness because confirming empties the cart; otherwise an
 * empty cart is `blocked`, which is how the empty-cart guard stays observable.
 */
export function checkoutView(
  state: CheckoutState,
  cartIsEmpty: boolean,
): CheckoutView {
  if (state.status === 'done') {
    return state
  }
  return cartIsEmpty ? { status: 'blocked' } : state
}
