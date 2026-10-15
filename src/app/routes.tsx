import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthPage } from '../features/auth/AuthPage'
import { CartPage } from '../features/cart/CartPage'
import { CatalogPage } from '../features/catalog/CatalogPage'
import { CheckoutPage } from '../features/checkout/CheckoutPage'
import { HistoryPage } from '../features/history/HistoryPage'
import { MallPage } from '../features/malls/MallPage'
import { ReceiptPage } from '../features/receipt/ReceiptPage'
import { ScanPage } from '../features/scan/ScanPage'
import { StorePage } from '../features/stores/StorePage'
import { RequireAuth, RequireMall, RequireStore } from './guards'

/**
 * Route table for the app.
 *
 * `/auth` is public. Every other route sits behind `RequireAuth`. The store
 * picker additionally sits behind `RequireMall`, and the catalog, the scanner,
 * the cart and the checkout all sit behind `RequireMall` and `RequireStore`, so
 * browsing, scanning and buying require a mall AND a store. The receipt and the
 * purchase history belong to the USER, not to a store: they only require a
 * session, so a receipt can be reopened from either the checkout or the history.
 * Unknown paths fall back to the root, which then applies the guards.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<MallPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/receipt/:orderId" element={<ReceiptPage />} />

        <Route element={<RequireMall />}>
          <Route path="/stores" element={<StorePage />} />

          <Route element={<RequireStore />}>
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
