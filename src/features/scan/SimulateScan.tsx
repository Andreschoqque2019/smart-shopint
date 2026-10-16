import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ScanIcon } from '../../components/ui/icons'
import { IconTile } from '../../components/ui/IconTile'
import type { Product } from '../../data/types'

interface SimulateScanProps {
  /** Products sold by the current store, offered as ready-to-pick skus. */
  products: Product[]
  /** Same callback the camera uses; injecting a sku mimics a real scan. */
  onDecode: (raw: string) => void
}

/**
 * Mandatory simulate-scan fallback.
 *
 * In-app browsers (WhatsApp, Instagram) block `getUserMedia`, so scanning must
 * stay usable without a camera. Picking a product fires the very same
 * `onDecode` the camera would. The free-text field covers payloads that are not
 * in this store (typos, foreign codes), which exercises the error paths.
 */
export function SimulateScan({ products, onDecode }: SimulateScanProps) {
  const [selected, setSelected] = useState('')
  const [manual, setManual] = useState('')

  function handleSelect(value: string) {
    setSelected(value)
    if (value) {
      onDecode(value)
    }
  }

  function handleManual() {
    if (manual) {
      onDecode(manual)
    }
  }

  return (
    <Card as="section" className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <IconTile tone="mint">
          <ScanIcon className="h-6 w-6" />
        </IconTile>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-ink">Simular escaneo</h2>
          <p className="text-sm text-muted">
            Elegí un producto para simular el escaneo, sin cámara.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="simulate-product" className="text-sm font-medium text-muted">
          Producto
        </label>
        <select
          id="simulate-product"
          value={selected}
          onChange={(event) => handleSelect(event.target.value)}
          className="rounded-control bg-soft px-4 py-3 text-sm text-ink outline-none transition-all focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Elegí un producto…</option>
          {products.map((product) => (
            <option key={product.sku} value={product.sku}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="simulate-manual" className="text-sm font-medium text-muted">
          Otro código
        </label>
        <div className="flex gap-2">
          <input
            id="simulate-manual"
            type="text"
            value={manual}
            onChange={(event) => setManual(event.target.value)}
            placeholder="SKU-0000"
            className="min-w-0 flex-1 rounded-control bg-soft px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-subtle focus:ring-2 focus:ring-primary/30"
          />
          <Button
            size="sm"
            fullWidth={false}
            className="shrink-0"
            onClick={handleManual}
          >
            Escanear
          </Button>
        </div>
      </div>
    </Card>
  )
}
