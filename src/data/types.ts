/**
 * Mock domain model for SMART SHOPINT.
 *
 * The application is a 100% frontend simulation: every entity below is stored
 * in `localStorage` by the storage layer and never leaves the browser.
 */

/** Product identifier encoded in a product QR code. */
export type Sku = string

/** Currency used across the catalog and orders. */
export type Currency = 'PEN'

/** Simulated checkout payment method. Never charged over the network. */
export type PaymentMethod = 'yape' | 'plin' | 'cash'

/** A shopping mall (level 1 of the selection flow). */
export interface Mall {
  id: string
  name: string
  /** District the mall is located in. */
  district: string
}

/** The kind of store, used for the category label shown to the user. */
export type StoreCategory =
  | 'supermercado'
  | 'hipermercado'
  | 'mayorista'
  | 'tienda por departamento'
  | 'home center'

/** A store inside a mall (level 2 of the selection flow). */
export interface Store {
  id: string
  mallId: string
  name: string
  category: StoreCategory
}

/** A catalog grouping used to render products section by section. */
export interface Category {
  id: string
  name: string
  /** Aisle that holds this category. */
  aisleId: string
}

/**
 * A physical store aisle.
 *
 * An aisle groups one or more catalog categories, so the code must never assume
 * a 1:1 category-to-aisle mapping.
 */
export interface Aisle {
  id: string
  /** Number shown to the user as "Pasillo N". */
  number: number
  /** Spanish name shown next to the number, e.g. "Abarrotes y aceites". */
  name: string
  /** Ids of the categories that live in this aisle. */
  categoryIds: string[]
}

/**
 * A single priced product row.
 *
 * A product is keyed by the (`sku`, `storeId`) pair, so the same `sku` can be
 * sold by several stores at different prices.
 */
export interface Product {
  sku: Sku
  name: string
  categoryId: string
  storeId: string
  price: number
  currency: Currency
  /** ISO date (YYYY-MM-DD) on which the product expires. */
  expiryDate: string
}

/** One line of the shopping cart. Unit price is captured when added. */
export interface CartLine {
  sku: Sku
  storeId: string
  qty: number
  unitPrice: number
}

/** The persisted cart. The displayed total is always derived from these lines. */
export type Cart = CartLine[]

/** A confirmed (simulated) purchase stored for the receipt and history. */
export interface Order {
  id: string
  lines: CartLine[]
  total: number
  paymentMethod: PaymentMethod
  /** ISO timestamp of when the order was confirmed. */
  createdAt: string
}

/** A registered demo account. Credentials are local-only demo data. */
export interface User {
  id: string
  email: string
  name: string
  password: string
}
