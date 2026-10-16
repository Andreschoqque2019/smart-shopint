import type { Aisle, Category, Mall, Product, Store, StoreCategory } from './types'

/**
 * Mock catalog seed.
 *
 * This is the single source of truth for the demo catalog: no network calls, no
 * backend. Products hang from a STORE (a shop inside a mall), and the same
 * `sku` is intentionally sold by several stores at DIFFERENT prices, so the
 * store selection is meaningful.
 */

export const malls: Mall[] = [
  { id: 'mall-del-sur', name: 'Mall del Sur', district: 'San Juan de Miraflores' },
  { id: 'jockey-plaza', name: 'Jockey Plaza', district: 'Santiago de Surco' },
  { id: 'plaza-norte', name: 'Plaza Norte', district: 'Independencia' },
]

/** The stores anchored in each mall. Every store carries its own catalog. */
export const stores: Store[] = [
  // Mall del Sur
  { id: 'md-tottus', mallId: 'mall-del-sur', name: 'Tottus', category: 'supermercado' },
  { id: 'md-ripley', mallId: 'mall-del-sur', name: 'Ripley', category: 'tienda por departamento' },
  { id: 'md-oechsle', mallId: 'mall-del-sur', name: 'Oechsle', category: 'tienda por departamento' },
  { id: 'md-falabella', mallId: 'mall-del-sur', name: 'Falabella', category: 'tienda por departamento' },

  // Jockey Plaza
  { id: 'jp-plaza-vea', mallId: 'jockey-plaza', name: 'Plaza Vea', category: 'supermercado' },
  { id: 'jp-tottus', mallId: 'jockey-plaza', name: 'Tottus', category: 'supermercado' },
  { id: 'jp-ripley', mallId: 'jockey-plaza', name: 'Ripley', category: 'tienda por departamento' },
  { id: 'jp-oechsle', mallId: 'jockey-plaza', name: 'Oechsle', category: 'tienda por departamento' },
  { id: 'jp-falabella', mallId: 'jockey-plaza', name: 'Falabella', category: 'tienda por departamento' },
  { id: 'jp-sodimac', mallId: 'jockey-plaza', name: 'Sodimac', category: 'home center' },

  // Plaza Norte
  { id: 'pn-metro', mallId: 'plaza-norte', name: 'Metro', category: 'hipermercado' },
  { id: 'pn-makro', mallId: 'plaza-norte', name: 'Makro', category: 'mayorista' },
  { id: 'pn-ripley', mallId: 'plaza-norte', name: 'Ripley', category: 'tienda por departamento' },
  { id: 'pn-oechsle', mallId: 'plaza-norte', name: 'Oechsle', category: 'tienda por departamento' },
  { id: 'pn-falabella', mallId: 'plaza-norte', name: 'Falabella', category: 'tienda por departamento' },
  { id: 'pn-estilos', mallId: 'plaza-norte', name: 'Estilos', category: 'tienda por departamento' },
  { id: 'pn-sodimac', mallId: 'plaza-norte', name: 'Sodimac', category: 'home center' },
]

/** Spanish labels for each store category, shown in the store picker. */
export const storeCategoryLabels: Record<StoreCategory, string> = {
  supermercado: 'Supermercado',
  hipermercado: 'Hipermercado',
  mayorista: 'Mayorista',
  'tienda por departamento': 'Tienda por departamento',
  'home center': 'Home center',
}

/**
 * Aisles for the whole demo.
 *
 * Intentional simplification: the aisle layout is defined ONCE and shared by
 * every store, instead of being keyed by store. A real product would keep a
 * per-store layout, but modelling that here would explode this mock seed. This
 * is a deliberate demo decision, not an oversight.
 *
 * The number stays numeric and the name a plain Spanish string; the word
 * "Pasillo" is a UI label built by the screens, never stored here.
 *
 * There are THREE layouts (grocery, department store, home center) and their
 * numbers REPEAT on purpose: each layout owns its own Pasillo 1-5. The repeat is
 * harmless because a store is grouped from its OWN products only, so it renders
 * just the aisles that actually hold them (see `groupProductsByAisle`). This is
 * a design decision, not a collision.
 */
export const aisles: Aisle[] = [
  // Grocery layout (supermercado, hipermercado, mayorista).
  {
    id: 'aisle-groceries',
    number: 1,
    name: 'Abarrotes y aceites',
    categoryIds: ['cat-groceries'],
  },
  {
    id: 'aisle-dairy',
    number: 2,
    name: 'Lácteos y huevos',
    categoryIds: ['cat-dairy'],
  },
  {
    id: 'aisle-beverages',
    number: 3,
    name: 'Bebidas y gaseosas',
    categoryIds: ['cat-beverages'],
  },
  {
    id: 'aisle-cleaning',
    number: 4,
    name: 'Limpieza del hogar',
    categoryIds: ['cat-cleaning'],
  },
  {
    id: 'aisle-snacks',
    number: 5,
    name: 'Snacks y galletas',
    categoryIds: ['cat-snacks'],
  },

  // Department store layout (tienda por departamento): Pasillo 1-5 again.
  {
    id: 'aisle-fashion-women',
    number: 1,
    name: 'Moda de mujer',
    categoryIds: ['cat-fashion-women'],
  },
  {
    id: 'aisle-fashion-men',
    number: 2,
    name: 'Moda de hombre',
    categoryIds: ['cat-fashion-men'],
  },
  {
    id: 'aisle-footwear',
    number: 3,
    name: 'Calzado',
    categoryIds: ['cat-footwear'],
  },
  {
    id: 'aisle-home-linen',
    number: 4,
    name: 'Hogar y blanco',
    categoryIds: ['cat-home-linen'],
  },
  {
    id: 'aisle-electronics',
    number: 5,
    name: 'Tecnología',
    categoryIds: ['cat-electronics'],
  },

  // Home center layout (home center).
  {
    id: 'aisle-hardware',
    number: 1,
    name: 'Herramientas',
    categoryIds: ['cat-hardware'],
  },
  {
    id: 'aisle-paint',
    number: 2,
    name: 'Pintura y acabados',
    categoryIds: ['cat-paint'],
  },
  {
    id: 'aisle-plumbing',
    number: 3,
    name: 'Grifería y baño',
    categoryIds: ['cat-plumbing'],
  },
  {
    id: 'aisle-garden',
    number: 4,
    name: 'Jardín',
    categoryIds: ['cat-garden'],
  },
  {
    id: 'aisle-lighting',
    number: 5,
    name: 'Iluminación',
    categoryIds: ['cat-lighting'],
  },
]

export const categories: Category[] = [
  { id: 'cat-groceries', name: 'Abarrotes', aisleId: 'aisle-groceries' },
  { id: 'cat-dairy', name: 'Lácteos', aisleId: 'aisle-dairy' },
  { id: 'cat-beverages', name: 'Bebidas', aisleId: 'aisle-beverages' },
  { id: 'cat-cleaning', name: 'Limpieza', aisleId: 'aisle-cleaning' },
  { id: 'cat-snacks', name: 'Snacks', aisleId: 'aisle-snacks' },

  // Department store categories.
  { id: 'cat-fashion-women', name: 'Moda mujer', aisleId: 'aisle-fashion-women' },
  { id: 'cat-fashion-men', name: 'Moda hombre', aisleId: 'aisle-fashion-men' },
  { id: 'cat-footwear', name: 'Calzado', aisleId: 'aisle-footwear' },
  { id: 'cat-home-linen', name: 'Hogar y blanco', aisleId: 'aisle-home-linen' },
  { id: 'cat-electronics', name: 'Tecnología', aisleId: 'aisle-electronics' },

  // Home center categories.
  { id: 'cat-hardware', name: 'Herramientas', aisleId: 'aisle-hardware' },
  { id: 'cat-paint', name: 'Pintura', aisleId: 'aisle-paint' },
  { id: 'cat-plumbing', name: 'Grifería', aisleId: 'aisle-plumbing' },
  { id: 'cat-garden', name: 'Jardín', aisleId: 'aisle-garden' },
  { id: 'cat-lighting', name: 'Iluminación', aisleId: 'aisle-lighting' },
]

/**
 * Catalog rows. A product is keyed by the (`sku`, `storeId`) pair, so the same
 * sku appears once per store that sells it, each at its own price.
 *
 * Only the grocery-type stores carry products for now: Tottus (Mall del Sur),
 * Plaza Vea (Jockey Plaza), Metro and Makro (Plaza Norte). Department stores
 * and home centers have no catalog yet.
 */
export const products: Product[] = [
  // --- SKU-0001: Leche Gloria Entera 400g (dairy) ---
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'md-tottus', price: 4.9, currency: 'PEN', expiryDate: '2027-03-15' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'pn-makro', price: 4.5, currency: 'PEN', expiryDate: '2027-02-28' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'jp-plaza-vea', price: 4.7, currency: 'PEN', expiryDate: '2027-04-02' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'pn-metro', price: 4.8, currency: 'PEN', expiryDate: '2027-03-28' },

  // --- SKU-0002: Arroz Costeño Extra 1kg (groceries) ---
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 5.2, currency: 'PEN', expiryDate: '2027-09-30' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 4.8, currency: 'PEN', expiryDate: '2027-11-20' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'pn-metro', price: 5.0, currency: 'PEN', expiryDate: '2027-10-10' },

  // --- SKU-0003: Aceite Primor 1L (groceries) ---
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 12.9, currency: 'PEN', expiryDate: '2027-06-10' },
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', storeId: 'jp-plaza-vea', price: 13.5, currency: 'PEN', expiryDate: '2027-06-30' },

  // --- SKU-0004: Fideos Don Vittorio 500g (groceries) ---
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 3.9, currency: 'PEN', expiryDate: '2027-08-01' },
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'jp-plaza-vea', price: 3.5, currency: 'PEN', expiryDate: '2027-07-15' },

  // --- SKU-0005: Atún Florida 170g (groceries) ---
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 7.4, currency: 'PEN', expiryDate: '2028-01-31' },
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 7.9, currency: 'PEN', expiryDate: '2028-01-31' },

  // --- SKU-0006: Gaseosa Inca Kola 1.5L (beverages) ---
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'md-tottus', price: 8.5, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'pn-makro', price: 7.9, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'jp-plaza-vea', price: 8.2, currency: 'PEN', expiryDate: '2027-04-30' },

  // --- SKU-0007: Agua San Luis 625ml (beverages) ---
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', storeId: 'pn-makro', price: 1.8, currency: 'PEN', expiryDate: '2027-12-01' },
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', storeId: 'jp-plaza-vea', price: 2.0, currency: 'PEN', expiryDate: '2027-12-01' },

  // --- SKU-0008: Detergente Bolívar 900g (cleaning) ---
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'md-tottus', price: 14.9, currency: 'PEN', expiryDate: '2029-01-01' },
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'pn-makro', price: 13.5, currency: 'PEN', expiryDate: '2029-01-01' },

  // --- SKU-0009: Lejía Clorox 1L (cleaning) ---
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', storeId: 'pn-makro', price: 6.9, currency: 'PEN', expiryDate: '2028-06-30' },
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', storeId: 'jp-plaza-vea', price: 7.3, currency: 'PEN', expiryDate: '2028-06-30' },

  // --- SKU-0010: Galletas Soda Field 300g (snacks) ---
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'md-tottus', price: 2.9, currency: 'PEN', expiryDate: '2027-10-15' },
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'jp-plaza-vea', price: 3.2, currency: 'PEN', expiryDate: '2027-10-15' },
]
