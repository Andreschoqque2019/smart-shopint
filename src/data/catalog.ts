import type { Category, Product, Supermarket } from './types'

/**
 * Mock catalog seed.
 *
 * This is the single source of truth for the demo catalog: no network calls, no
 * backend. The same `sku` is intentionally sold by several supermarkets at
 * DIFFERENT prices, so supermarket selection is meaningful.
 */

export const supermarkets: Supermarket[] = [
  { id: 'sm-mall-del-sur', name: 'Mall del Sur' },
  { id: 'sm-plaza-vea', name: 'Plaza Vea' },
  { id: 'sm-makro', name: 'Makro' },
]

export const categories: Category[] = [
  { id: 'cat-groceries', name: 'Abarrotes' },
  { id: 'cat-dairy', name: 'Lácteos' },
  { id: 'cat-beverages', name: 'Bebidas' },
  { id: 'cat-cleaning', name: 'Limpieza' },
  { id: 'cat-snacks', name: 'Snacks' },
]

/**
 * Catalog rows. A product is keyed by the (`sku`, `supermarketId`) pair, so the
 * same sku appears once per supermarket that sells it, each at its own price.
 */
export const products: Product[] = [
  // --- SKU-0001: Leche Gloria Entera 400g (dairy) ---
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', supermarketId: 'sm-mall-del-sur', price: 4.9, currency: 'PEN', expiryDate: '2027-03-15' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', supermarketId: 'sm-makro', price: 4.5, currency: 'PEN', expiryDate: '2027-02-28' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', supermarketId: 'sm-plaza-vea', price: 4.7, currency: 'PEN', expiryDate: '2027-04-02' },

  // --- SKU-0002: Arroz Costeño Extra 1kg (groceries) ---
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', supermarketId: 'sm-mall-del-sur', price: 5.2, currency: 'PEN', expiryDate: '2027-09-30' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', supermarketId: 'sm-makro', price: 4.8, currency: 'PEN', expiryDate: '2027-11-20' },

  // --- SKU-0003: Aceite Primor 1L (groceries) ---
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', supermarketId: 'sm-makro', price: 12.9, currency: 'PEN', expiryDate: '2027-06-10' },
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', supermarketId: 'sm-plaza-vea', price: 13.5, currency: 'PEN', expiryDate: '2027-06-30' },

  // --- SKU-0004: Fideos Don Vittorio 500g (groceries) ---
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', supermarketId: 'sm-mall-del-sur', price: 3.9, currency: 'PEN', expiryDate: '2027-08-01' },
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', supermarketId: 'sm-plaza-vea', price: 3.5, currency: 'PEN', expiryDate: '2027-07-15' },

  // --- SKU-0005: Atún Florida 170g (groceries) ---
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', supermarketId: 'sm-makro', price: 7.4, currency: 'PEN', expiryDate: '2028-01-31' },
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', supermarketId: 'sm-mall-del-sur', price: 7.9, currency: 'PEN', expiryDate: '2028-01-31' },

  // --- SKU-0006: Gaseosa Inca Kola 1.5L (beverages) ---
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', supermarketId: 'sm-mall-del-sur', price: 8.5, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', supermarketId: 'sm-makro', price: 7.9, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', supermarketId: 'sm-plaza-vea', price: 8.2, currency: 'PEN', expiryDate: '2027-04-30' },

  // --- SKU-0007: Agua San Luis 625ml (beverages) ---
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', supermarketId: 'sm-makro', price: 1.8, currency: 'PEN', expiryDate: '2027-12-01' },
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', supermarketId: 'sm-plaza-vea', price: 2.0, currency: 'PEN', expiryDate: '2027-12-01' },

  // --- SKU-0008: Detergente Bolívar 900g (cleaning) ---
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', supermarketId: 'sm-mall-del-sur', price: 14.9, currency: 'PEN', expiryDate: '2029-01-01' },
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', supermarketId: 'sm-makro', price: 13.5, currency: 'PEN', expiryDate: '2029-01-01' },

  // --- SKU-0009: Lejía Clorox 1L (cleaning) ---
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', supermarketId: 'sm-makro', price: 6.9, currency: 'PEN', expiryDate: '2028-06-30' },
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', supermarketId: 'sm-plaza-vea', price: 7.3, currency: 'PEN', expiryDate: '2028-06-30' },

  // --- SKU-0010: Galletas Soda Field 300g (snacks) ---
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', supermarketId: 'sm-mall-del-sur', price: 2.9, currency: 'PEN', expiryDate: '2027-10-15' },
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', supermarketId: 'sm-plaza-vea', price: 3.2, currency: 'PEN', expiryDate: '2027-10-15' },
]
