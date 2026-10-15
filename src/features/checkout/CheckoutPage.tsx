import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { cartTotal } from '../../lib/cart'
import {
  checkoutReducer,
  checkoutView,
  initialCheckoutState,
} from '../../lib/checkout'
import { formatPrice } from '../../lib/format'
import { buildOrder } from '../../lib/order'
import { paymentMethodLabels, paymentMethods } from '../../lib/payment'

/**
 * Simulated checkout.
 *
 * The payment is a local simulation: the screen states it permanently, and
 * confirming only builds an `Order` in memory (persisted to localStorage) and
 * empties the cart. No network request is ever made. Reaching this screen with
 * an empty cart is blocked.
 */
export function CheckoutPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()
  const [checkout, send] = useReducer(checkoutReducer, initialCheckoutState)

  const cartIsEmpty = state.cart.length === 0
  const view = checkoutView(checkout, cartIsEmpty)
  const selectedMethod =
    checkout.status === 'methodSelected' ? checkout.method : null

  function handleConfirm() {
    if (selectedMethod === null) {
      return
    }
    // idle/methodSelected -> confirming -> done. The order is built from the
    // cart snapshot and stored; the cart is emptied by the store reducer.
    send({ type: 'confirm' })
    const order = buildOrder(state.cart, selectedMethod)
    dispatch({ type: 'checkout/confirm', order })
    send({ type: 'complete', orderId: order.id })
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">Pago</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Confirmá tu pedido
        </h1>
      </header>

      <div className="flex flex-col gap-1 rounded-2xl bg-amber-100 p-4 ring-1 ring-amber-300">
        <p className="text-sm font-bold tracking-wide text-amber-900">
          Pago SIMULADO
        </p>
        <p className="text-xs text-amber-900">
          Esta compra es una simulación: no se cobra dinero real ni se contacta
          a ningún proveedor de pagos.
        </p>
      </div>

      {view.status === 'done' ? (
        <section className="flex flex-col gap-3 rounded-2xl bg-emerald-50 p-5 shadow-sm ring-1 ring-emerald-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Pedido confirmado
          </h2>
          <p className="text-sm text-slate-700">
            ID del pedido: <span className="font-mono">{view.orderId}</span>
          </p>
          <p className="text-sm text-slate-700">
            Método: {paymentMethodLabels[view.method]}
          </p>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="self-start rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Volver al catálogo
          </button>
        </section>
      ) : view.status === 'blocked' ? (
        <section
          role="alert"
          className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            No podés confirmar el pago
          </h2>
          <p className="text-sm text-slate-600">
            Tu carrito está vacío. Agregá al menos un producto antes de pagar.
          </p>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="self-start rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ir al catálogo
          </button>
        </section>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <span className="text-lg font-bold text-slate-900">
              {formatPrice(cartTotal(state.cart), 'PEN')}
            </span>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1 text-sm font-medium text-slate-500">
              Método de pago (simulado)
            </legend>
            {paymentMethods.map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-400"
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => send({ type: 'select', method })}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium text-slate-900">
                  {paymentMethodLabels[method]}
                </span>
              </label>
            ))}
          </fieldset>

          <button
            type="button"
            disabled={selectedMethod === null}
            onClick={handleConfirm}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Confirmar pedido
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate('/cart')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Volver al carrito
      </button>
    </main>
  )
}
