import { promotionPrice, type Promotion } from '../data/promotions'
import type { Cart, CartLine, Order, Product } from '../data/types'

export interface RecommendedPromotion {
  product: Product
  promotion: Promotion
  price: number
}

/**
 * Ranks the offers available in one store using category affinity.
 *
 * The same sku is sold by several stores, so the sku-to-category map is built
 * from the full product list before any order or cart line is counted. Cart
 * lines weigh twice as much as order lines. Offers with no affinity signal are
 * ordered by discount and then sku, keeping the result deterministic.
 */
export function recommendedPromotions(
  products: Product[],
  promotions: Promotion[],
  orders: Order[],
  cart: Cart,
  storeId: string,
  limit = 3,
): RecommendedPromotion[] {
  const categoryBySku = new Map<string, string>()
  for (const product of products) {
    if (!categoryBySku.has(product.sku)) {
      categoryBySku.set(product.sku, product.categoryId)
    }
  }

  const affinity = new Map<string, number>()
  function countLines(lines: CartLine[], weight: number) {
    for (const line of lines) {
      const categoryId = categoryBySku.get(line.sku)
      if (categoryId) {
        affinity.set(categoryId, (affinity.get(categoryId) ?? 0) + weight)
      }
    }
  }
  for (const order of orders) {
    countLines(order.lines, 1)
  }
  countLines(cart, 2)

  const seen = new Set<string>()
  const items: RecommendedPromotion[] = []

  for (const product of products) {
    if (product.storeId !== storeId || seen.has(product.sku)) {
      continue
    }
    // The supplied campaign is the source of truth; passing an empty list
    // disables recommendations instead of falling back to the global campaign.
    const promotion = promotions.find((item) => item.sku === product.sku)
    if (!promotion) {
      continue
    }
    seen.add(product.sku)
    items.push({
      product,
      promotion,
      price: promotionPrice(product.price, promotion),
    })
  }

  items.sort((a, b) => {
    const byAffinity =
      (affinity.get(b.product.categoryId) ?? 0) -
      (affinity.get(a.product.categoryId) ?? 0)
    if (byAffinity !== 0) {
      return byAffinity
    }
    if (a.promotion.discountPercent !== b.promotion.discountPercent) {
      return b.promotion.discountPercent - a.promotion.discountPercent
    }
    return a.product.sku.localeCompare(b.product.sku)
  })

  return items.slice(0, Math.max(0, limit))
}
