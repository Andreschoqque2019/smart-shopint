import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { ProductImage } from '../../components/brand/ProductImage'
import { Button } from '../../components/ui/Button'
import { CartIcon, ReceiptIcon, ScanIcon, StoreIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Pill } from '../../components/ui/Pill'
import { Screen } from '../../components/ui/Screen'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { Toast } from '../../components/ui/Toast'
import { products } from '../../data/catalog'
import { promotions } from '../../data/promotions'
import type { Product } from '../../data/types'
import { groupProductsByAisle } from '../../lib/aisles'
import { cartCount } from '../../lib/cart'
import { formatExpiry, formatPrice } from '../../lib/format'
import { recommendedPromotions } from '../../lib/recommendations'
import { PromotionsSection } from './PromotionsSection'

/**
 * Product catalog for the selected store.
 *
 * Lists every product the chosen store sells, grouped by aisle, and exposes
 * the sku, name, price and expiry date of each row. A summary at the top tells
 * the shopper what each aisle of this store actually holds. Every row can be
 * added to the cart, and the header exposes the cart with its item count.
 * A store with no products falls back to an explicit message; every seeded
 * store has a catalog, so that branch stays as a defensive guard.
 */
export function CatalogPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  // Ephemeral UI only: the confirmation must never reach the persisted store.
  // The sequence restarts the timer even when the same product is added twice.
  const [toast, setToast] = useState<{ message: string; seq: number } | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timer)
  }, [toast])

  const store = state.selectedStore
  const mall = state.selectedMall
  const storeProducts = store
    ? products.filter((product) => product.storeId === store.id)
    : []

  // Aisles are derived from the store's real products, never hardcoded: an
  // aisle with no products for this store simply does not show up.
  const aisleGroups = groupProductsByAisle(storeProducts)

  const promoItems = recommendedPromotions(
    products,
    promotions,
    state.orders,
    state.cart,
    store?.id ?? '',
    3,
  )

  function handleAdd(product: Product, unitPrice = product.price) {
    dispatch({
      type: 'cart/add',
      line: {
        sku: product.sku,
        storeId: product.storeId,
        qty: 1,
        unitPrice,
      },
    })
    setToast((current) => ({
      message: product.name,
      seq: (current?.seq ?? 0) + 1,
    }))
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
          <section
            aria-label="Pasillos de esta tienda"
            className="flex flex-col gap-3"
          >
            <SectionTitle>Pasillos de esta tienda</SectionTitle>
            <ul className="flex flex-col gap-3">
              {aisleGroups.map(({ aisle, items }) => (
                <li
                  key={aisle.id}
                  className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card"
                >
                  <Pill className="shrink-0">Pasillo {aisle.number}</Pill>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-semibold text-ink">
                      {aisle.name}
                    </span>
                    <span className="truncate text-xs text-subtle">
                      {items.map((item) => item.name).join(' · ')}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <PromotionsSection
            items={promoItems}
            onAdd={(item) => handleAdd(item.product, item.price)}
          />

          <Button
            variant="secondary"
            size="sm"
            icon={<ScanIcon className="h-4 w-4" />}
            onClick={() => navigate('/scan')}
          >
            Escanear producto
          </Button>

          <div className="flex flex-col gap-7">
            {aisleGroups.map((group) => (
              <section key={group.aisle.id} className="flex flex-col gap-3">
                <SectionTitle>
                  {`Pasillo ${group.aisle.number} · ${group.aisle.name}`}
                </SectionTitle>
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

      {toast && <Toast message={toast.message} />}
    </Screen>
  )
}
