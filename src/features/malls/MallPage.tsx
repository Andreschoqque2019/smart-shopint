import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { Button } from '../../components/ui/Button'
import { ChevronRightIcon, MallIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import { Screen } from '../../components/ui/Screen'
import { toneForIndex } from '../../components/ui/tileTone'
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
    <Screen>
      <header className="flex flex-col gap-1">
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
          Elegí tu centro comercial
        </h1>
        {state.currentUser && (
          <p className="text-sm text-muted">Hola, {state.currentUser.name}.</p>
        )}
      </header>

      <ul className="flex flex-col gap-3">
        {malls.map((mall, index) => (
          <li key={mall.id}>
            <button
              type="button"
              onClick={() => handleSelect(mall)}
              className="group flex w-full items-center gap-4 rounded-card bg-surface p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <IconTile tone={toneForIndex(index)}>
                <MallIcon className="h-6 w-6" />
              </IconTile>
              <span className="flex min-w-0 flex-col">
                <span className="text-base font-semibold text-ink">
                  {mall.name}
                </span>
                <span className="text-sm text-muted">{mall.district}</span>
              </span>
              <ChevronRightIcon className="ml-auto h-5 w-5 shrink-0 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          </li>
        ))}
      </ul>

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => dispatch({ type: 'auth/logout' })}
      >
        Cerrar sesión
      </Button>
    </Screen>
  )
}
