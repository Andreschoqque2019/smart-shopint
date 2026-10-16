import { useState } from 'react'

import type { Product } from '../../data/types'
import { cn } from '../ui/cn'

/**
 * Product thumbnails, bundled with the app.
 *
 * Resolved eagerly so Vite fingerprints and emits every file into the build:
 * the demo has to render with no internet connection, so nothing may be fetched
 * from a remote host at runtime. Keys are the bare skus, taken from file names.
 *
 * The files themselves come from `scripts/fetch-product-images.mjs`; see
 * `src/assets/products/CREDITS.md` for their sources.
 */
const MODULES = import.meta.glob('../../assets/products/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(MODULES).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1).replace(/\.[^.]+$/, ''),
    String(url),
  ]),
)

interface ProductImageProps {
  product: Product
  className?: string
}

/**
 * Reference photo for a product.
 *
 * Decorative only: the product name always appears as real text beside it, so
 * the image is hidden from assistive tech. A sku without a bundled photo — or
 * one whose file fails to decode — degrades to a neutral tile rather than the
 * browser's broken-image glyph.
 */
export function ProductImage({ product, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false)
  const photo = PHOTOS[product.sku]

  if (!photo || failed) {
    return (
      <span
        aria-hidden="true"
        className={cn('h-16 w-16 shrink-0 rounded-2xl bg-soft', className)}
      />
    )
  }

  return (
    <img
      src={photo}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn('h-16 w-16 shrink-0 rounded-2xl bg-soft object-cover', className)}
    />
  )
}
