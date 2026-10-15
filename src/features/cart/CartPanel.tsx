import { products } from '../../data/catalog'
import type { CartLine } from '../../data/types'
import { cartTotal, lineTotal } from '../../lib/cart'
import { formatPrice } from '../../lib/format'

interface CartPanelProps {
  lines: CartLine[]
  onIncrement: (line: CartLine) => void
  onDecrement: (line: CartLine) => void
  onRemove: (line: CartLine) => void
}

/**
 * Resolves the display name of a line from the catalog.
 *
 * A line only stores `sku` and `storeId`; the name is looked up so the cart
 * never duplicates catalog data. A line that no longer resolves (or never did)
 * falls back to its sku instead of crashing the render.
 */
function lineName(line: CartLine): string {
  const product = products.find(
    (item) => item.sku === line.sku && item.storeId === line.storeId,
  )
  return product?.name ?? line.sku
}

/**
 * The cart, with its live total.
 *
 * Prices are captured per line (`unitPrice`) and the total is derived from the
 * lines on every render: it is never stored, so it always matches the cart.
 */
export function CartPanel({
  lines,
  onIncrement,
  onDecrement,
  onRemove,
}: CartPanelProps) {
  const total = cartTotal(lines)

  return (
    <section aria-label="Carrito" className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {lines.map((line) => {
          const name = lineName(line)
          return (
            <li
              key={`${line.sku}:${line.storeId}`}
              className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-slate-900">
                  {name}
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatPrice(lineTotal(line), 'PEN')}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  {formatPrice(line.unitPrice, 'PEN')} c/u
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${name}`}
                    onClick={() => onDecrement(line)}
                    className="h-8 w-8 rounded-full bg-slate-100 text-base leading-none text-slate-900 transition hover:bg-slate-200"
                  >
                    −
                  </button>
                  <span
                    aria-label={`Cantidad de ${name}`}
                    className="min-w-6 text-center text-sm font-semibold text-slate-900"
                  >
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${name}`}
                    onClick={() => onIncrement(line)}
                    className="h-8 w-8 rounded-full bg-slate-100 text-base leading-none text-slate-900 transition hover:bg-slate-200"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label={`Eliminar ${name}`}
                    onClick={() => onRemove(line)}
                    className="ml-1 text-xs font-medium text-slate-500 underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        role="group"
        aria-label="Total del carrito"
        className="flex items-center justify-between rounded-2xl bg-slate-900 px-4 py-3 text-white"
      >
        <span className="text-sm font-medium">Total</span>
        <span className="text-lg font-bold">{formatPrice(total, 'PEN')}</span>
      </div>
    </section>
  )
}
