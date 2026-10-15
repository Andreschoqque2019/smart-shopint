import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { CartPanel } from './CartPanel'

/**
 * The cart screen.
 *
 * Shows the persisted cart with its live total, and is the only way into the
 * simulated checkout. An empty cart points back to the catalog instead of
 * offering a payment step.
 */
export function CartPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  const cart = state.cart

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tu carrito
        </h1>
        {state.selectedStore && (
          <p className="text-sm text-slate-600">{state.selectedStore.name}</p>
        )}
      </header>

      {state.cartNotice && (
        <p
          role="status"
          className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200"
        >
          {state.cartNotice}
        </p>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-sm text-slate-600">Tu carrito está vacío.</p>
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ir al catálogo
          </button>
        </div>
      ) : (
        <>
          <CartPanel
            lines={cart}
            onIncrement={(line) =>
              dispatch({ type: 'cart/add', line: { ...line, qty: 1 } })
            }
            onDecrement={(line) =>
              dispatch({
                type: 'cart/decrement',
                sku: line.sku,
                storeId: line.storeId,
              })
            }
            onRemove={(line) =>
              dispatch({
                type: 'cart/remove',
                sku: line.sku,
                storeId: line.storeId,
              })
            }
          />

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ir al pago
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate('/catalog')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Seguir comprando
      </button>
    </main>
  )
}
