import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { malls } from '../../data/catalog'
import type { Mall } from '../../data/types'

/**
 * Mall picker (level 1 of the selection flow).
 *
 * Lists the seeded shopping malls and requires a choice before the store picker
 * opens. The choice is persisted so it survives a reload.
 */
export function MallPage() {
  const { state, dispatch } = useAppStore()
  const navigate = useNavigate()

  function handleSelect(mall: Mall) {
    dispatch({ type: 'mall/select', mall })
    navigate('/stores')
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Elegí tu centro comercial
        </h1>
        {state.currentUser && (
          <p className="text-sm text-slate-600">
            Hola, {state.currentUser.name}.
          </p>
        )}
      </header>

      <ul className="flex flex-col gap-3">
        {malls.map((mall) => (
          <li key={mall.id}>
            <button
              type="button"
              onClick={() => handleSelect(mall)}
              className="flex w-full flex-col items-start gap-1 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-900"
            >
              <span className="text-base font-semibold text-slate-900">
                {mall.name}
              </span>
              <span className="text-sm text-slate-600">{mall.district}</span>
            </button>
          </li>
        ))}
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
