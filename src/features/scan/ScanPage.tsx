import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { Button } from '../../components/ui/Button'
import { CartIcon } from '../../components/ui/icons'
import { Screen } from '../../components/ui/Screen'
import { products } from '../../data/catalog'
import { cartCount } from '../../lib/cart'
import { resolveSku } from '../../lib/sku'
import { ScanPanel } from './ScanPanel'
import { ScanResult } from './ScanResult'
import { SimulateScan } from './SimulateScan'

/**
 * Product scan screen.
 *
 * The QR contract is "payload equals sku, nothing else": the camera and the
 * mandatory simulate fallback both feed one raw payload into the same resolver.
 * The result is ephemeral screen state: it is never persisted and never touches
 * the cart.
 */
export function ScanPage() {
  const { state } = useAppStore()
  const navigate = useNavigate()
  const [scannedSku, setScannedSku] = useState<string | null>(null)

  const store = state.selectedStore
  const mall = state.selectedMall

  if (!store) {
    return null
  }

  const storeProducts = products.filter(
    (product) => product.storeId === store.id,
  )
  const resolution =
    scannedSku === null ? null : resolveSku(scannedSku, store.id)

  function handleDecode(raw: string) {
    setScannedSku(raw)
  }

  return (
    <Screen>
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">Escanear producto</p>
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink">
            {store.name}
          </h1>
          {mall && <p className="text-sm text-muted">{mall.name}</p>}
        </div>
        <Button
          size="sm"
          fullWidth={false}
          icon={<CartIcon className="h-4 w-4" />}
          className="shrink-0"
          onClick={() => navigate('/cart')}
        >
          Carrito ({cartCount(state.cart)})
        </Button>
      </header>

      <ScanPanel onDecode={handleDecode} />
      <SimulateScan products={storeProducts} onDecode={handleDecode} />

      {resolution && (
        <ScanResult
          resolution={resolution}
          rawSku={scannedSku ?? ''}
          currentStoreName={store.name}
        />
      )}

      <Button
        variant="ghost"
        size="sm"
        fullWidth={false}
        className="mt-auto self-start"
        onClick={() => navigate('/catalog')}
      >
        Volver al catálogo
      </Button>
    </Screen>
  )
}
