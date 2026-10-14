import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthPage } from '../features/auth/AuthPage'
import { CatalogPlaceholder } from '../features/catalog/CatalogPlaceholder'
import { SupermarketPage } from '../features/supermarket/SupermarketPage'
import { RequireAuth, RequireSupermarket } from './guards'

/**
 * Route table for the app.
 *
 * `/auth` is public. Every other route sits behind `RequireAuth`, and the
 * catalog additionally sits behind `RequireSupermarket`. Unknown paths fall
 * back to the root, which then applies the same guards.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<SupermarketPage />} />

        <Route element={<RequireSupermarket />}>
          <Route path="/catalog" element={<CatalogPlaceholder />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
