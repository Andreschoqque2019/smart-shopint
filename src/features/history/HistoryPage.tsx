import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { Button } from '../../components/ui/Button'
import { BagIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Pill } from '../../components/ui/Pill'
import { Screen } from '../../components/ui/Screen'
import { formatExpiry, formatPrice } from '../../lib/format'
import { ordersNewestFirst } from '../../lib/history'
import { paymentMethodLabels } from '../../lib/payment'
import { clearNamespace } from '../../lib/storage'

/**
 * Purchase history.
 *
 * Lists the confirmed orders kept in `localStorage`, most recent first, each
 * with its receipt QR (value = order id) and a link to reopen the original
 * receipt. It also hosts the destructive "reset demo data" control, which asks
 * for confirmation first, wipes every `shopint:v2:*` key and signs the user out.
 */
export function HistoryPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()
  const [confirmingReset, setConfirmingReset] = useState(false)

  const orders = ordersNewestFirst(state.orders)

  function handleReset() {
    clearNamespace()
    dispatch({ type: 'demo/reset' })
    navigate('/auth', { replace: true })
  }

  return (
    <Screen>
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">Mis compras</p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
          Historial
        </h1>
      </header>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card">
          <IconTile tone="lilac" shape="circle" className="h-14 w-14">
            <BagIcon className="h-7 w-7" />
          </IconTile>
          <p className="text-sm text-muted">
            Todavía no tenés compras. Cuando confirmes un pedido vas a poder
            verlo acá.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-card bg-surface p-4 shadow-card"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <span
                  data-testid="history-order-id"
                  className="truncate font-mono text-sm font-semibold text-ink"
                >
                  {order.id}
                </span>
                <span className="text-xs text-subtle">
                  {formatExpiry(order.createdAt.slice(0, 10))}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">
                    {formatPrice(order.total, 'PEN')}
                  </span>
                  <Pill>{paymentMethodLabels[order.paymentMethod]}</Pill>
                </span>
                <Link
                  to={`/receipt/${order.id}`}
                  className="text-sm font-medium text-ink underline underline-offset-4"
                >
                  Ver comprobante
                </Link>
              </div>
              <QRCodeSVG value={order.id} size={64} />
            </li>
          ))}
        </ul>
      )}

      <section className="no-print flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card">
        {confirmingReset ? (
          <div role="alert" className="flex flex-col gap-3">
            <p className="text-sm text-muted">
              ¿Borrar todos los datos de demo? Se van a eliminar tus compras, tu
              cuenta y tu carrito. Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="danger"
                size="sm"
                fullWidth={false}
                onClick={handleReset}
              >
                Sí, borrar todo
              </Button>
              <Button
                variant="secondary"
                size="sm"
                fullWidth={false}
                onClick={() => setConfirmingReset(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            fullWidth={false}
            className="self-start"
            onClick={() => setConfirmingReset(true)}
          >
            Borrar datos de demo
          </Button>
        )}
      </section>

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => navigate('/catalog')}
      >
        Volver al catálogo
      </Button>
    </Screen>
  )
}
