import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { products } from '../../data/catalog'
import { formatExpiry, formatPrice } from '../../lib/format'
import { findOrder } from '../../lib/history'
import { paymentMethodLabels } from '../../lib/payment'
import { receiptLines } from '../../lib/receipt'

/**
 * Printable receipt for a confirmed order.
 *
 * The screen is reachable both from the checkout (right after confirming) and
 * from the purchase history, for the same order. The QR is the receipt QR: its
 * `value` is EXACTLY the order id, so a reader recovers the order, never a sku
 * (that is the product QR of the scan screen). An unknown id in the URL shows an
 * explicit Spanish state instead of a blank screen or a crash.
 */
export function ReceiptPage() {
  const { state } = useAppStore()
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()

  const order = orderId ? findOrder(state.orders, orderId) : undefined

  if (!order) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-slate-500">Comprobante</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Comprobante no encontrado
          </h1>
        </header>

        <section
          role="alert"
          className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <p className="text-sm text-slate-600">
            No encontramos ningún pedido con ese comprobante. Puede que se haya
            borrado o que el enlace sea incorrecto.
          </p>
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="self-start rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ver mis compras
          </button>
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

  const lines = receiptLines(order, products)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <article className="receipt flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <header className="flex flex-col gap-1 border-b border-dashed border-slate-300 pb-4">
          <p className="text-sm font-medium text-slate-500">Comprobante</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gracias por tu compra
          </h1>
          <p className="text-sm text-slate-600">
            Pedido <span className="font-mono text-slate-900">{order.id}</span>
          </p>
          <p className="text-sm text-slate-600">
            Fecha {formatExpiry(order.createdAt.slice(0, 10))}
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {lines.map((line) => (
            <li
              key={`${line.sku}:${order.id}`}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {line.name}
                </span>
                <span className="text-xs text-slate-500">
                  {line.qty} × {formatPrice(line.unitPrice, 'PEN')}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-slate-900">
                {formatPrice(line.total, 'PEN')}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-dashed border-slate-300 pt-4">
          <span className="text-sm font-medium text-slate-600">Total</span>
          <span className="text-lg font-bold text-slate-900">
            {formatPrice(order.total, 'PEN')}
          </span>
        </div>

        <p className="text-sm text-slate-600">
          Método de pago: {paymentMethodLabels[order.paymentMethod]} (simulado)
        </p>

        <div className="flex flex-col items-center gap-2 border-t border-dashed border-slate-300 pt-5">
          <QRCodeSVG value={order.id} size={140} />
          <p className="text-center text-xs text-slate-500">
            Mostrá este código para validar tu compra.
          </p>
        </div>
      </article>

      <div className="no-print flex flex-col gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Imprimir comprobante
        </button>
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          Ver mis compras
        </button>
      </div>

      <button
        type="button"
        onClick={() => navigate('/catalog')}
        className="no-print mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Volver al catálogo
      </button>
    </main>
  )
}
