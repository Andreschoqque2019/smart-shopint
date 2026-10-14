import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'

/**
 * Placeholder for the future catalog route.
 *
 * The product catalog itself belongs to a later delivery slice. This route
 * exists only so the "direct access" rule is observable: opening it without a
 * selected supermarket bounces back to the picker (see `RequireSupermarket`).
 */
export function CatalogPlaceholder() {
  const { state } = useAppStore()
  const navigate = useNavigate()

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 px-5 py-8">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Catálogo
      </h1>
      <p className="text-sm text-slate-600">
        Comprando en {state.selectedSupermarket?.name}.
      </p>
      <p className="text-sm text-slate-500">
        El catálogo de productos llega en la próxima entrega.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Cambiar supermercado
      </button>
    </main>
  )
}
