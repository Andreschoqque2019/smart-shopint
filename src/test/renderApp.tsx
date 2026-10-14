import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { AppProvider } from '../app/AppStore'
import type { AppState } from '../app/appState'
import { AppRoutes } from '../app/routes'

/**
 * Renders the real route table inside a memory router.
 *
 * Uses the production guards and store so tests exercise the gate, the auth
 * Uses the production guards and store so tests exercise the gate, the auth
 * flow and the mall + store selection exactly as the app wires them.
 */
export function renderApp(
  initialEntries: string[] = ['/'],
  initialState?: AppState,
) {
  return render(
    <AppProvider initialState={initialState}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </AppProvider>,
  )
}
