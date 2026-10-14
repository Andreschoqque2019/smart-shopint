import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { categories, products } from '../../data/catalog'
import { formatExpiry, formatPrice } from '../../lib/format'

/**
 * Product catalog for the selected store.
 *
 * Lists every product the chosen store sells, grouped by category, and exposes
 * the sku, name, price and expiry date of each row. Stores with no catalog
 * (department stores and home centers) fall back to an explicit message.
 */
export function CatalogPage() {
  const { state } = useAppStore()
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

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Catálogo
        </h1>
        <p className="text-sm text-slate-600">
          Comprando en {store?.name}
          {mall ? ` — ${mall.name}` : ''}.
        </p>
      </header>

      {storeProducts.length === 0 ? (
        <p className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
          Esta tienda todavía no tiene catálogo.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map(({ category, items }) => (
            <section key={category.id} className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                {category.name}
              </h2>
              <ul className="flex flex-col gap-2">
                {items.map((product) => (
                  <li
                    key={`${product.sku}-${product.storeId}`}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm text-slate-900">
                        {product.name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {product.sku} · Vence {formatExpiry(product.expiryDate)}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
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
