import { ProductImage } from '../../components/brand/ProductImage'
import { MinusIcon, PlusIcon, TrashIcon } from '../../components/ui/icons'
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
 * Resolves a line back to its catalog product.
 *
 * A line only stores `sku` and `storeId`; the name and artwork are looked up so
 * the cart never duplicates catalog data. A line that no longer resolves (or
 * never did) falls back to its sku instead of crashing the render.
 */
function lineProduct(line: CartLine) {
  return products.find(
    (item) => item.sku === line.sku && item.storeId === line.storeId,
  )
}

function lineName(line: CartLine): string {
  return lineProduct(line)?.name ?? line.sku
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
          const product = lineProduct(line)
          return (
            <li
              key={`${line.sku}:${line.storeId}`}
              className="flex flex-col gap-3 rounded-card bg-surface p-4 shadow-card"
            >
              <div className="flex items-start gap-4">
                {product ? (
                  <ProductImage product={product} className="h-14 w-14" />
                ) : (
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-soft text-sm font-bold text-subtle">
                    ?
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-ink">{name}</span>
                  <span className="text-xs text-subtle">
                    {formatPrice(line.unitPrice, 'PEN')} c/u
                  </span>
                </div>
                <span className="shrink-0 text-base font-bold text-primary">
                  {formatPrice(lineTotal(line), 'PEN')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={`Quitar una unidad de ${name}`}
                    onClick={() => onDecrement(line)}
                    className="flex h-9 w-9 items-center justify-center rounded-pill bg-soft text-ink transition-colors hover:bg-line"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span
                    aria-label={`Cantidad de ${name}`}
                    className="min-w-6 text-center text-sm font-bold text-ink"
                  >
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Agregar una unidad de ${name}`}
                    onClick={() => onIncrement(line)}
                    className="flex h-9 w-9 items-center justify-center rounded-pill bg-primary text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-strong"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Eliminar ${name}`}
                  onClick={() => onRemove(line)}
                  className="flex items-center gap-1.5 rounded-control px-2 py-1 text-xs font-medium text-subtle transition-colors hover:text-primary"
                >
                  <TrashIcon className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        role="group"
        aria-label="Total del carrito"
        className="flex items-center justify-between rounded-card bg-primary px-5 py-4 text-white shadow-card"
      >
        <span className="text-sm font-medium">Total</span>
        <span className="text-xl font-bold">
          {formatPrice(total, 'PEN')}
        </span>
      </div>
    </section>
  )
}
