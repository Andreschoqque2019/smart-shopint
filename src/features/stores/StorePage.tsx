import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { storeCategoryLabels, stores } from '../../data/catalog'
import type { Store } from '../../data/types'

/**
 * Store picker (level 2 of the selection flow).
 *
 * Lists the stores that belong to the selected mall. Reached only through
 * `RequireMall`, so `selectedMall` is guaranteed to be present.
 */
export function StorePage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  const mall = state.selectedMall
  if (!mall) {
    return null
  }

  const mallStores = stores.filter((store) => store.mallId === mall.id)

  function handleSelect(store: Store) {
    dispatch({ type: 'store/select', store })
    navigate('/catalog')
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">Elegí tu tienda</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {mall.name}
        </h1>
        <p className="text-sm text-slate-600">{mall.district}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {mallStores.map((store) => (
          <li key={store.id}>
            <button
              type="button"
              onClick={() => handleSelect(store)}
              className="flex w-full flex-col items-start gap-1 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-900"
            >
              <span className="text-base font-semibold text-slate-900">
                {store.name}
              </span>
              <span className="text-sm text-slate-600">
                {storeCategoryLabels[store.category]}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Volver a centros comerciales
      </button>
    </main>
  )
}
