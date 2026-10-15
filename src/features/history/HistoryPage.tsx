import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">Mis compras</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Historial
        </h1>
      </header>

      {orders.length === 0 ? (
        <p className="text-sm text-slate-600">
          Todavía no tenés compras. Cuando confirmes un pedido vas a poder verlo
          acá.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span
                  data-testid="history-order-id"
                  className="truncate font-mono text-sm font-semibold text-slate-900"
                >
                  {order.id}
                </span>
                <span className="text-xs text-slate-500">
                  {formatExpiry(order.createdAt.slice(0, 10))}
                </span>
                <span className="text-sm text-slate-700">
                  {formatPrice(order.total, 'PEN')} ·{' '}
                  {paymentMethodLabels[order.paymentMethod]}
                </span>
                <Link
                  to={`/receipt/${order.id}`}
                  className="text-sm font-medium text-slate-900 underline"
                >
                  Ver comprobante
                </Link>
              </div>
              <QRCodeSVG value={order.id} size={64} />
            </li>
          ))}
        </ul>
      )}

      <section className="no-print flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        {confirmingReset ? (
          <div role="alert" className="flex flex-col gap-3">
            <p className="text-sm text-slate-600">
              ¿Borrar todos los datos de demo? Se van a eliminar tus compras, tu
              cuenta y tu carrito. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Sí, borrar todo
              </button>
              <button
                type="button"
                onClick={() => setConfirmingReset(false)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="self-start text-sm font-medium text-red-600 underline"
          >
            Borrar datos de demo
          </button>
        )}
      </section>

      <button
        type="button"
        onClick={() => navigate('/catalog')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Volver al catálogo
      </button>
    </main>
  )
}
