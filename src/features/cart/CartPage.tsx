import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { CartIcon, StoreIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Button } from '../../components/ui/Button'
import { Screen } from '../../components/ui/Screen'
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
    <Screen>
      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
          Tu carrito
        </h1>
        {state.selectedStore && (
          <p className="text-sm text-muted">{state.selectedStore.name}</p>
        )}
      </header>

      {state.cartNotice && (
        <p
          role="status"
          className="rounded-card bg-surface-rose p-4 text-sm font-medium text-primary"
        >
          {state.cartNotice}
        </p>
      )}

      {cart.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card">
          <IconTile tone="rose" shape="circle" className="h-14 w-14">
            <CartIcon className="h-7 w-7" />
          </IconTile>
          <p className="text-sm text-muted">Tu carrito está vacío.</p>
          <Button
            variant="secondary"
            fullWidth={false}
            icon={<StoreIcon className="h-4 w-4" />}
            onClick={() => navigate('/catalog')}
          >
            Ir al catálogo
          </Button>
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

          <Button onClick={() => navigate('/checkout')}>Ir al pago</Button>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => navigate('/catalog')}
      >
        Seguir comprando
      </Button>
    </Screen>
  )
}
