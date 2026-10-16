import { QRCodeSVG } from 'qrcode.react'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { Button } from '../../components/ui/Button'
import { PrintIcon, ReceiptIcon, StoreIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Screen } from '../../components/ui/Screen'
import { SuccessBanner } from '../../components/ui/SuccessBanner'
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
 *
 * The green "purchase done" banner sits at the very top and, like the action
 * buttons, is screen-only: the print rules keep the paper copy to the receipt
 * itself.
 */
export function ReceiptPage() {
  const { state } = useAppStore()
  const navigate = useNavigate()
  const { orderId } = useParams<{ orderId: string }>()

  const order = orderId ? findOrder(state.orders, orderId) : undefined

  if (!order) {
    return (
      <Screen>
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">Comprobante</p>
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
            Comprobante no encontrado
          </h1>
        </header>

        <section
          role="alert"
          className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card"
        >
          <IconTile tone="rose" shape="circle" className="h-14 w-14">
            <ReceiptIcon className="h-7 w-7" />
          </IconTile>
          <p className="text-sm text-muted">
            No encontramos ningún pedido con ese comprobante. Puede que se haya
            borrado o que el enlace sea incorrecto.
          </p>
          <Button
            variant="secondary"
            fullWidth={false}
            icon={<StoreIcon className="h-4 w-4" />}
            onClick={() => navigate('/catalog')}
          >
            Volver al catálogo
          </Button>
        </section>

        <Button
          variant="ghost"
          size="sm"
          fullWidth={false}
          className="mt-auto self-start"
          onClick={() => navigate('/history')}
        >
          Ver mis compras
        </Button>
      </Screen>
    )
  }

  const lines = receiptLines(order, products)

  return (
    <Screen>
      <SuccessBanner className="no-print" title="¡Compra realizada!">
        Tu pago simulado se registró correctamente.
      </SuccessBanner>

      <article className="receipt flex flex-col gap-5 rounded-card bg-surface p-6 shadow-card">
        <header className="flex flex-col gap-1 border-b border-dashed border-line pb-4">
          <p className="text-sm font-medium text-primary">Comprobante</p>
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
            Gracias por tu compra
          </h1>
          <p className="text-sm text-muted">
            Pedido{' '}
            <span className="font-mono font-semibold text-ink">{order.id}</span>
          </p>
          <p className="text-sm text-muted">
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
                <span className="text-sm font-medium text-ink">
                  {line.name}
                </span>
                <span className="text-xs text-subtle">
                  {line.qty} × {formatPrice(line.unitPrice, 'PEN')}
                </span>
              </div>
              <span className="shrink-0 text-sm font-semibold text-ink">
                {formatPrice(line.total, 'PEN')}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-dashed border-line pt-4">
          <span className="text-sm font-medium text-muted">Total</span>
          <span className="text-xl font-bold text-ink">
            {formatPrice(order.total, 'PEN')}
          </span>
        </div>

        <p className="text-sm text-muted">
          Método de pago: {paymentMethodLabels[order.paymentMethod]} (simulado)
        </p>

        <div className="flex flex-col items-center gap-3 border-t border-dashed border-line pt-5">
          <QRCodeSVG value={order.id} size={140} />
          <p className="text-center text-xs text-subtle">
            Mostrá este código para validar tu compra.
          </p>
        </div>
      </article>

      <div className="no-print flex flex-col gap-3">
        <Button
          icon={<PrintIcon className="h-4 w-4" />}
          onClick={() => window.print()}
        >
          Imprimir comprobante
        </Button>
        <Button
          variant="secondary"
          icon={<ReceiptIcon className="h-4 w-4" />}
          onClick={() => navigate('/history')}
        >
          Ver mis compras
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="no-print mt-auto self-start"
        onClick={() => navigate('/catalog')}
      >
        Volver al catálogo
      </Button>
    </Screen>
  )
}
