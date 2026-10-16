import { HashRouter } from 'react-router-dom'

import { AppProvider } from './app/AppStore'
import { AppRoutes } from './app/routes'

/**
 * Application shell.
 *
 * Wraps the route table in the persisted store and a router, then frames it as
 * a phone: a ~430px column, centred, on a neutral backdrop — even on desktop.
 * `HashRouter` is used so the demo survives being served from a static host
 * without a server rewrite (the design's documented fallback for hostless
 * builds). The frame lives here, once, and never per screen.
 */
function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-dvh bg-frame">
          <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-x-hidden bg-canvas shadow-frame">
            <AppRoutes />
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  )
}

export default App
