import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthPage } from '../features/auth/AuthPage'
import { CatalogPage } from '../features/catalog/CatalogPage'
import { MallPage } from '../features/malls/MallPage'
import { StorePage } from '../features/stores/StorePage'
import { RequireAuth, RequireMall, RequireStore } from './guards'

/**
 * Route table for the app.
 *
 * `/auth` is public. Every other route sits behind `RequireAuth`. The store
 * picker additionally sits behind `RequireMall`, and the catalog sits behind
 * both `RequireMall` and `RequireStore`, so browsing requires a mall AND a
 * store. Unknown paths fall back to the root, which then applies the guards.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<MallPage />} />

        <Route element={<RequireMall />}>
          <Route path="/stores" element={<StorePage />} />

          <Route element={<RequireStore />}>
            <Route path="/catalog" element={<CatalogPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
