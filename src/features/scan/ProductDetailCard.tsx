import { useAppStore } from '../../app/store'
import { categories } from '../../data/catalog'
import type { Product } from '../../data/types'
import { formatExpiry, formatPrice } from '../../lib/format'

interface ProductDetailCardProps {
  product: Product
}

/**
 * Detail card shown when a scan resolves to a product of the current store.
 *
 * The QR payload only carries the sku; the price and expiry below come from the
 * catalog lookup, never from the code. A valid scan can be added to the cart
 * directly from here.
 */
export function ProductDetailCard({ product }: ProductDetailCardProps) {
  const { dispatch } = useAppStore()
  const category = categories.find((item) => item.id === product.categoryId)

  return (
    <section
      aria-label="Detalle del producto"
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-200"
    >
      <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex flex-col">
          <dt className="text-slate-500">SKU</dt>
          <dd className="font-medium text-slate-900">{product.sku}</dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-slate-500">Categoría</dt>
          <dd className="font-medium text-slate-900">
            {category?.name ?? 'Sin categoría'}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-slate-500">Precio</dt>
          <dd className="font-medium text-slate-900">
            {formatPrice(product.price, product.currency)}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-slate-500">Vencimiento</dt>
          <dd className="font-medium text-slate-900">
            {formatExpiry(product.expiryDate)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() =>
          dispatch({
            type: 'cart/add',
            line: {
              sku: product.sku,
              storeId: product.storeId,
              qty: 1,
              unitPrice: product.price,
            },
          })
        }
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
      >
        Agregar al carrito
      </button>
    </section>
  )
}
