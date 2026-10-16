import { stores } from '../../data/catalog'
import type { SkuResolution } from '../../lib/sku'
import { ProductDetailCard } from './ProductDetailCard'

interface ScanResultProps {
  resolution: SkuResolution
  /** The raw payload that was scanned, echoed back in the unknown-code error. */
  rawSku: string
  currentStoreName: string
}

/**
 * Renders the outcome of a scan.
 *
 * A product of the current store gets the detail card; an unknown code or a
 * code that belongs to another store gets an explicit error banner and NEVER a
 * card.
 */
export function ScanResult({
  resolution,
  rawSku,
  currentStoreName,
}: ScanResultProps) {
  if (resolution.status === 'found') {
    return <ProductDetailCard product={resolution.product} />
  }

  if (resolution.status === 'other-store') {
    const otherStore = stores.find(
      (store) => store.id === resolution.product.storeId,
    )
    return (
      <p
        role="alert"
        className="flex items-start gap-3 rounded-card bg-surface-rose p-4 text-sm font-medium text-primary"
      >
        Este producto ({resolution.product.name}) se vende en{' '}
        {otherStore?.name ?? 'otra tienda'}, no en {currentStoreName}.
      </p>
    )
  }

  return (
    <p
      role="alert"
      className="flex items-start gap-3 rounded-card bg-surface-rose p-4 text-sm font-medium text-primary"
    >
      No encontramos ningún producto con el código «{rawSku}». Verificá que el
      código sea correcto.
    </p>
  )
}
