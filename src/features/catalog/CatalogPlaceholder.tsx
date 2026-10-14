import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { products } from '../../data/catalog'

/**
 * Catalog placeholder.
 *
 * The full catalog experience arrives in the next slice. For now this screen
 * confirms the selected mall + store and, when the store carries products,
 * previews the rows that belong to it; otherwise it explains the store has no
 * catalog yet.
 */
export function CatalogPlaceholder() {
  const { state } = useAppStore()
  const navigate = useNavigate()

  const store = state.selectedStore
  const mall = state.selectedMall
  const storeProducts = store
    ? products.filter((product) => product.storeId === store.id)
    : []

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
        <section className="flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            El catálogo completo llega en la próxima entrega.
          </p>
          <ul className="flex flex-col gap-2">
            {storeProducts.map((product) => (
              <li
                key={`${product.sku}-${product.storeId}`}
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm shadow-sm ring-1 ring-slate-200"
              >
                <span className="text-slate-900">{product.name}</span>
                <span className="font-semibold text-slate-900">
                  S/ {product.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>
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
