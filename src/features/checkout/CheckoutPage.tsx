import { useReducer } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { PaymentBrand } from '../../components/brand/PaymentBrand'
import { Button } from '../../components/ui/Button'
import { cn } from '../../components/ui/cn'
import { BagIcon, BoltIcon, StoreIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Screen } from '../../components/ui/Screen'
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
 * an empty cart is blocked. On confirmation the machine reaches `done` and the
 * screen redirects to the real receipt of the freshly created order.
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
    // cart snapshot and stored; the cart is emptied by the store reducer. The
    // `done` state below redirects to the receipt.
    send({ type: 'confirm' })
    const order = buildOrder(state.cart, selectedMethod)
    dispatch({ type: 'checkout/confirm', order })
    send({ type: 'complete', orderId: order.id })
  }

  if (view.status === 'done') {
    return <Navigate to={`/receipt/${view.orderId}`} replace />
  }

  return (
    <Screen>
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">Pago</p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
          Confirmá tu pedido
        </h1>
      </header>

      <div className="flex items-start gap-3 rounded-card bg-surface p-4 shadow-card">
        <IconTile tone="rose" shape="circle">
          <BoltIcon className="h-5 w-5" />
        </IconTile>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-wide text-primary">
            Pago SIMULADO
          </p>
          <p className="text-xs text-muted">
            Esta compra es una simulación: no se cobra dinero real ni se
            contacta a ningún proveedor de pagos.
          </p>
        </div>
      </div>

      {view.status === 'blocked' ? (
        <section
          role="alert"
          className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card"
        >
          <IconTile tone="rose" shape="circle" className="h-14 w-14">
            <BagIcon className="h-7 w-7" />
          </IconTile>
          <h2 className="text-lg font-semibold text-ink">
            No podés confirmar el pago
          </h2>
          <p className="text-sm text-muted">
            Tu carrito está vacío. Agregá al menos un producto antes de pagar.
          </p>
          <Button
            variant="secondary"
            fullWidth={false}
            icon={<StoreIcon className="h-4 w-4" />}
            onClick={() => navigate('/catalog')}
          >
            Ir al catálogo
          </Button>
        </section>
      ) : (
        <>
          <div className="flex items-center justify-between rounded-card bg-surface px-5 py-4 shadow-card">
            <span className="text-sm font-medium text-muted">Total</span>
            <span className="text-xl font-bold text-ink">
              {formatPrice(cartTotal(state.cart), 'PEN')}
            </span>
          </div>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-sm font-medium text-muted">
              Método de pago (simulado)
            </legend>
            {paymentMethods.map((method) => (
              <label
                key={method}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-card bg-surface p-4 shadow-card ring-2 transition-all duration-200 ease-out',
                  selectedMethod === method
                    ? 'ring-primary'
                    : 'ring-transparent hover:ring-primary/20',
                )}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method}
                  checked={selectedMethod === method}
                  onChange={() => send({ type: 'select', method })}
                  className="h-4 w-4 accent-primary"
                />
                <PaymentBrand method={method} />
                <span className="text-sm font-medium text-ink">
                  {paymentMethodLabels[method]}
                </span>
              </label>
            ))}
          </fieldset>

          <Button disabled={selectedMethod === null} onClick={handleConfirm}>
            Confirmar pedido
          </Button>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => navigate('/cart')}
      >
        Volver al carrito
      </Button>
    </Screen>
  )
}
