import { ProductImage } from '../../components/brand/ProductImage'
import { Button } from '../../components/ui/Button'
import { Pill } from '../../components/ui/Pill'
import { SectionTitle } from '../../components/ui/SectionTitle'
import { formatPrice } from '../../lib/format'
import type { RecommendedPromotion } from '../../lib/recommendations'

interface PromotionsSectionProps {
  items: RecommendedPromotion[]
  onAdd: (item: RecommendedPromotion) => void
}

/**
 * Store-specific offers ranked from local purchase and cart affinity.
 *
 * Renders nothing when the store has no promoted products, so callers can mount
 * it unconditionally without leaving an empty heading behind.
 */
export function PromotionsSection({ items, onAdd }: PromotionsSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section aria-label="Promociones para vos" className="flex flex-col gap-3">
      <SectionTitle>Promociones para vos</SectionTitle>
      <p className="text-sm text-muted">
        Ofertas simuladas para esta tienda, elegidas según tus compras y tu
        carrito.
      </p>
      <ul className="flex flex-col gap-3">
        {items.map(({ product, promotion, price }) => (
          <li
            key={`${product.sku}:${product.storeId}`}
            className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-card"
          >
            <ProductImage product={product} />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-sm font-semibold text-ink">
                {product.name}
              </span>
              <span className="text-xs text-subtle line-through">
                {formatPrice(product.price, product.currency)}
              </span>
              <span className="flex items-center gap-2">
                <Pill>-{promotion.discountPercent}%</Pill>
                <span className="text-base font-bold text-ink">
                  {formatPrice(price, product.currency)}
                </span>
              </span>
              <span className="text-xs text-muted">{promotion.label}</span>
            </div>
            <Button
              size="sm"
              fullWidth={false}
              aria-label={`Agregar ${product.name} en promoción`}
              className="shrink-0 self-center"
              onClick={() => onAdd({ product, promotion, price })}
            >
              Agregar
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
