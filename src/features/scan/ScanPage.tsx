import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppStore } from '../../app/store'
import { products } from '../../data/catalog'
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
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 py-8">
      <header className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">Escanear producto</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {store.name}
        </h1>
        {mall && <p className="text-sm text-slate-600">{mall.name}</p>}
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

      <button
        type="button"
        onClick={() => navigate('/catalog')}
        className="mt-auto self-start text-sm font-medium text-slate-500 underline"
      >
        Volver al catálogo
      </button>
    </main>
  )
}
