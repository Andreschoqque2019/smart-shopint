import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { supermarkets } from '../../data/catalog'
import type { Supermarket } from '../../data/types'

/**
 * Supermarket picker.
 *
 * Lists the mock supermarkets from the seed and requires a selection before
 * catalog browsing. The choice is persisted so it survives a reload.
 */
export function SupermarketPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  function handleSelect(supermarket: Supermarket) {
    dispatch({ type: 'supermarket/select', supermarket })
    navigate('/catalog')
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Elige tu supermercado
        </h1>
        {state.currentUser && (
          <p className="text-sm text-slate-600">
            Hola, {state.currentUser.name}.
          </p>
        )}
      </header>

      <ul className="flex flex-col gap-3">
        {supermarkets.map((supermarket) => {
          const isSelected = state.selectedSupermarket?.id === supermarket.id
          return (
            <li key={supermarket.id}>
              <button
                type="button"
                onClick={() => handleSelect(supermarket)}
                aria-pressed={isSelected}
                className={`w-full rounded-xl border px-4 py-4 text-left text-base font-semibold transition-colors ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:border-slate-900'
                }`}
              >
                {supermarket.name}
              </button>
            </li>
          )
        })}
      </ul>

      <button
        type="button"
        onClick={() => dispatch({ type: 'auth/logout' })}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Cerrar sesión
      </button>
    </main>
  )
}
