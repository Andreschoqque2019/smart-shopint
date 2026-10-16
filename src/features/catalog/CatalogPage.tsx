import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { ProductImage } from '../../components/brand/ProductImage'
import { Button } from '../../components/ui/Button'
import { CartIcon, ReceiptIcon, ScanIcon, StoreIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Screen } from '../../components/ui/Screen'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { categories, products } from '../../data/catalog'
import type { Product } from '../../data/types'
import { cartCount } from '../../lib/cart'
import { formatExpiry, formatPrice } from '../../lib/format'

/**
 * Product catalog for the selected store.
 *
 * Lists every product the chosen store sells, grouped by category, and exposes
 * the sku, name, price and expiry date of each row. Every row can be added to
 * the cart, and the header exposes the cart with its item count. Stores with no
 * catalog (department stores and home centers) fall back to an explicit message.
 */
export function CatalogPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  const store = state.selectedStore
  const mall = state.selectedMall
  const storeProducts = store
    ? products.filter((product) => product.storeId === store.id)
    : []

  const groups = categories
    .map((category) => ({
      category,
      items: storeProducts.filter((product) => product.categoryId === category.id),
    }))
    .filter((group) => group.items.length > 0)

  function handleAdd(product: Product) {
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
    <Screen>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
            Catálogo
          </h1>
          <p className="text-sm text-muted">
            Comprando en {store?.name}
            {mall ? ` — ${mall.name}` : ''}.
          </p>
        </div>
        <Button
          size="sm"
          fullWidth={false}
          icon={<CartIcon className="h-4 w-4" />}
          className="shrink-0"
          onClick={() => navigate('/cart')}
        >
          Carrito ({cartCount(state.cart)})
        </Button>
      </header>

      <Button
        variant="secondary"
        size="sm"
        icon={<ReceiptIcon className="h-4 w-4" />}
        onClick={() => navigate('/history')}
      >
        Mis compras
      </Button>

      {state.cartNotice && (
        <p
          role="status"
          className="flex items-start gap-3 rounded-card bg-surface-rose p-4 text-sm font-medium text-primary"
        >
          {state.cartNotice}
        </p>
      )}

      {storeProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-card bg-surface p-8 text-center shadow-card">
          <IconTile tone="lilac" shape="circle" className="h-14 w-14">
            <StoreIcon className="h-7 w-7" />
          </IconTile>
          <p className="text-sm text-muted">
            Esta tienda todavía no tiene catálogo.
          </p>
        </div>
      ) : (
        <>
          <Button
            variant="secondary"
            size="sm"
            icon={<ScanIcon className="h-4 w-4" />}
            onClick={() => navigate('/scan')}
          >
            Escanear producto
          </Button>

          <div className="flex flex-col gap-7">
            {groups.map((group) => (
              <section key={group.category.id} className="flex flex-col gap-3">
                <SectionTitle>{group.category.name}</SectionTitle>
                <ul className="flex flex-col gap-3">
                  {group.items.map((product) => (
                    <li
                      key={`${product.sku}:${product.storeId}`}
                      className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card"
                    >
                      <ProductImage product={product} />
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="text-sm font-semibold text-ink">
                          {product.name}
                        </span>
                        <span className="text-xs text-subtle">
                          {product.sku} · Vence{' '}
                          {formatExpiry(product.expiryDate)}
                        </span>
                        <span className="text-base font-bold text-ink">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        fullWidth={false}
                        aria-label={`Agregar ${product.name}`}
                        className="shrink-0 self-center"
                        onClick={() => handleAdd(product)}
                      >
                        Agregar
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => navigate('/stores')}
      >
        Cambiar tienda
      </Button>
    </Screen>
  )
}
