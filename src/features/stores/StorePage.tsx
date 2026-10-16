import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { StoreBrand } from '../../components/brand/StoreBrand'
import { Button } from '../../components/ui/Button'
import { ChevronRightIcon } from '../../components/ui/icons'
import { Pill } from '../../components/ui/Pill'
import { Screen } from '../../components/ui/Screen'
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
    <Screen>
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-primary">Elegí tu tienda</p>
        <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
          {mall.name}
        </h1>
        <p className="text-sm text-muted">{mall.district}</p>
      </header>

      <ul className="flex flex-col gap-3">
        {mallStores.map((store) => (
          <li key={store.id}>
            <button
              type="button"
              onClick={() => handleSelect(store)}
              className="group flex w-full items-center gap-4 rounded-card bg-surface p-4 text-left shadow-card transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <StoreBrand name={store.name} />
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="text-base font-semibold text-ink">
                  {store.name}
                </span>
                <Pill className="self-start">
                  {storeCategoryLabels[store.category]}
                </Pill>
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
        onClick={() => navigate('/')}
      >
        Volver a centros comerciales
      </Button>
    </Screen>
  )
}
