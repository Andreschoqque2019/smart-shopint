import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Catálogo
          </h1>
          <p className="text-sm text-slate-600">
            Comprando en {store?.name}
            {mall ? ` — ${mall.name}` : ''}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Carrito ({cartCount(state.cart)})
        </button>
      </header>

      <button
        type="button"
        onClick={() => navigate('/history')}
        className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
      >
        Mis compras
      </button>

      {state.cartNotice && (
        <p
          role="status"
          className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-800 ring-1 ring-amber-200"
        >
          {state.cartNotice}
        </p>
      )}

      {storeProducts.length === 0 ? (
        <p className="text-sm text-slate-600">
          Esta tienda todavía no tiene catálogo.
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={() => navigate('/scan')}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
          >
            Escanear producto
          </button>

          <div className="flex flex-col gap-6">
            {groups.map((group) => (
              <section key={group.category.id} className="flex flex-col gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {group.category.name}
                </h2>
                <ul className="flex flex-col gap-3">
                  {group.items.map((product) => (
                    <li
                      key={`${product.sku}:${product.storeId}`}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                    >
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-900">
                          {product.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {product.sku} · Vence {formatExpiry(product.expiryDate)}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {formatPrice(product.price, product.currency)}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Agregar ${product.name}`}
                        onClick={() => handleAdd(product)}
                        className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Agregar
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate('/stores')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Cambiar tienda
      </button>
    </main>
  )
}
