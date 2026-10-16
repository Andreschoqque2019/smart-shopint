import { ProductImage } from '../../components/brand/ProductImage'
import { Button } from '../../components/ui/Button'
import { CartIcon } from '../../components/ui/icons'
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

  function handleAdd() {
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

  return (
    <section
      aria-label="Detalle del producto"
      className="flex flex-col gap-5 rounded-card bg-surface p-6 shadow-card"
    >
      <div className="flex items-start gap-4">
        <ProductImage product={product} className="h-16 w-16" />
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="text-lg font-semibold text-ink">{product.name}</h2>
          <p className="text-sm text-muted">
            {category?.name ?? 'Sin categoría'}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-card bg-canvas p-4 text-sm">
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
            SKU
          </dt>
          <dd className="font-semibold text-ink">{product.sku}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
            Categoría
          </dt>
          <dd className="font-semibold text-ink">
            {category?.name ?? 'Sin categoría'}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
            Precio
          </dt>
          <dd className="text-base font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
            Vence
          </dt>
          <dd className="font-semibold text-ink">
            {formatExpiry(product.expiryDate)}
          </dd>
        </div>
      </dl>

      <Button
        icon={<CartIcon className="h-4 w-4" />}
        onClick={handleAdd}
      >
        Agregar al carrito
      </Button>
    </section>
  )
}
