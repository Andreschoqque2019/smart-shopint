import { HashRouter } from 'react-router-dom'

import { AppProvider } from './app/AppStore'
import { AppRoutes } from './app/routes'

/**
 * Application shell.
 *
 * Wraps the route table in the persisted store and a router. `HashRouter` is
 * used so the demo survives being served from a static host without a server
 * rewrite (the design's documented fallback for hostless builds).
 */
function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  )
}

export default App
