import { useState } from 'react'

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
    if (value !== '') {
      onDecode(value)
    }
  }

  function handleManual() {
    const value = manual.trim()
    if (value !== '') {
      onDecode(value)
    }
  }

  return (
    <section
      aria-labelledby="simulate-heading"
      className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >
      <div className="flex flex-col gap-1">
        <h2
          id="simulate-heading"
          className="text-lg font-semibold text-slate-900"
        >
          Simular escaneo
        </h2>
        <p className="text-sm text-slate-600">
          Elegí un producto para simular el escaneo, sin cámara.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="simulate-product"
          className="text-sm font-medium text-slate-700"
        >
          Producto
        </label>
        <select
          id="simulate-product"
          value={selected}
          onChange={(event) => handleSelect(event.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        >
          <option value="">Elegí un producto…</option>
          {products.map((product) => (
            <option key={product.sku} value={product.sku}>
              {product.name} ({product.sku})
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="simulate-manual"
          className="text-sm font-medium text-slate-700"
        >
          Otro código
        </label>
        <div className="flex gap-2">
          <input
            id="simulate-manual"
            type="text"
            value={manual}
            onChange={(event) => setManual(event.target.value)}
            placeholder="SKU-0000"
            className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
          />
          <button
            type="button"
            onClick={handleManual}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Escanear
          </button>
        </div>
      </div>
    </section>
  )
}
