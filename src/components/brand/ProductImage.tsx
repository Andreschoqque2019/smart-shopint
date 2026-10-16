import type { ReactNode } from 'react'

import type { Product } from '../../data/types'
import { cn } from '../ui/cn'

type Shape = 'carton' | 'bag' | 'bottle' | 'pack' | 'can' | 'slimBottle' | 'box' | 'jug' | 'pouch'

/**
 * Deterministic sku → silhouette map.
 *
 * Every seeded product gets its own shape so the catalog reads as a set of
 * distinct items (milk carton, rice sack, oil bottle, pasta pack, tuna can, soda
 * bottle, water bottle, detergent box, bleach jug, biscuit pouch). Any sku that
 * is not mapped falls back to the neutral `box`, never a broken placeholder.
 */
const SKU_SHAPES: Record<string, Shape> = {
  'SKU-0001': 'carton',
  'SKU-0002': 'bag',
  'SKU-0003': 'bottle',
  'SKU-0004': 'pack',
  'SKU-0005': 'can',
  'SKU-0006': 'bottle',
  'SKU-0007': 'slimBottle',
  'SKU-0008': 'box',
  'SKU-0009': 'jug',
  'SKU-0010': 'pouch',
}

const CATEGORY_TILES: Record<string, { tile: string; ink: string }> = {
  'cat-groceries': { tile: 'bg-surface-rose', ink: 'text-primary' },
  'cat-dairy': { tile: 'bg-surface-blue', ink: 'text-accent-blue' },
  'cat-beverages': { tile: 'bg-surface-mint', ink: 'text-accent-green' },
  'cat-cleaning': { tile: 'bg-surface-lilac', ink: 'text-accent-purple' },
  'cat-snacks': { tile: 'bg-surface-blue', ink: 'text-accent-blue' },
}

const FALLBACK: { tile: string; ink: string } = {
  tile: 'bg-surface-rose',
  ink: 'text-primary',
}

function shapeFor(sku: string): Shape {
  return SKU_SHAPES[sku] ?? 'box'
}

function renderShape(shape: Shape): ReactNode {
  switch (shape) {
    case 'carton':
      return (
        <>
          <path d="M14 18h20v20a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="currentColor" />
          <path d="M14 18 24 9l10 9z" fill="currentColor" opacity="0.55" />
          <rect x="19" y="26" width="10" height="4" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'bag':
      return (
        <>
          <path d="M14 20h20l-1.6 18a3 3 0 0 1-3 2.7H18.6a3 3 0 0 1-3-2.7z" fill="currentColor" />
          <path
            d="M17 20c0-4.4 3.1-7 7-7s7 2.6 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <rect x="19" y="28" width="10" height="3" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'bottle':
      return (
        <>
          <rect x="20" y="6" width="8" height="5" rx="1.6" fill="currentColor" />
          <path
            d="M21 11h6v5.5a6 6 0 0 1 4.5 5.8V41a1.5 1.5 0 0 1-1.5 1.5H18A1.5 1.5 0 0 1 16.5 41V22.3A6 6 0 0 1 21 16.5z"
            fill="currentColor"
          />
          <rect x="17" y="27" width="14" height="4" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'slimBottle':
      return (
        <>
          <rect x="21.5" y="6" width="5" height="5" rx="1.6" fill="currentColor" />
          <path
            d="M22 11h4v6a5 5 0 0 1 3.5 4.8V41a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 18.5 41V21.8A5 5 0 0 1 22 17z"
            fill="currentColor"
          />
          <rect x="18.6" y="28" width="10.8" height="3.5" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'can':
      return (
        <>
          <rect x="13" y="13" width="22" height="24" rx="5" fill="currentColor" />
          <ellipse cx="24" cy="13" rx="11" ry="3.6" fill="currentColor" opacity="0.55" />
          <rect x="13" y="22" width="22" height="5" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'pack':
      return (
        <>
          <rect x="16" y="8" width="16" height="33" rx="3.5" fill="currentColor" />
          <rect x="16" y="15" width="16" height="6" fill="currentColor" opacity="0.4" />
          <path d="M24 9v6" stroke="currentColor" strokeWidth="1.6" opacity="0.5" />
        </>
      )
    case 'jug':
      return (
        <>
          <path d="M19 16h10v22a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="currentColor" />
          <rect x="21.5" y="10" width="5" height="6" rx="1.6" fill="currentColor" />
          <path
            d="M19 21h-3.5a3 3 0 0 0-3 3v6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          <rect x="20" y="29" width="8" height="3.5" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'pouch':
      return (
        <>
          <path d="M14 16h20v22a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3z" fill="currentColor" />
          <path d="M14 16l3-5h14l3 5z" fill="currentColor" opacity="0.5" />
          <rect x="19" y="26" width="10" height="3.5" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
    case 'box':
    default:
      return (
        <>
          <rect x="12" y="15" width="24" height="22" rx="3.5" fill="currentColor" />
          <path d="M20 15h8v4h-8z" fill="currentColor" opacity="0.5" />
          <rect x="18" y="25" width="12" height="4" rx="1" fill="currentColor" opacity="0.35" />
        </>
      )
  }
}

interface ProductImageProps {
  product: Product
  className?: string
}

/**
 * Own product illustration.
 *
 * A pastel tile with a single-colour silhouette, keyed by sku with a
 * deterministic fallback. Decorative only: the product name is always real text
 * next to it, so this is hidden from assistive tech.
 */
export function ProductImage({ product, className }: ProductImageProps) {
  const palette = CATEGORY_TILES[product.categoryId] ?? FALLBACK
  const shape = shapeFor(product.sku)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl',
        palette.tile,
        palette.ink,
        className,
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-[64%] w-[64%]"
        fill="none"
        focusable="false"
      >
        {renderShape(shape)}
      </svg>
    </span>
  )
}
