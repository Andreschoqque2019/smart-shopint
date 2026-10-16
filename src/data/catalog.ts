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
 * EVERY store carries a catalog now: the grocery universe (supermercado,
 * hipermercado, mayorista), the department-store universe (tienda por
 * departamento) and the home-center universe. That is why the same chain shows
 * the same products in two malls at different prices.
 */
export const products: Product[] = [
  // --- SKU-0001: Leche Gloria Entera 400g (dairy) ---
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'md-tottus', price: 4.9, currency: 'PEN', expiryDate: '2027-03-15' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'pn-makro', price: 4.5, currency: 'PEN', expiryDate: '2027-02-28' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'jp-plaza-vea', price: 4.7, currency: 'PEN', expiryDate: '2027-04-02' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'pn-metro', price: 4.8, currency: 'PEN', expiryDate: '2027-03-28' },
  { sku: 'SKU-0001', name: 'Leche Gloria Entera 400g', categoryId: 'cat-dairy', storeId: 'jp-tottus', price: 4.9, currency: 'PEN', expiryDate: '2027-03-25' },

  // --- SKU-0002: Arroz Costeño Extra 1kg (groceries) ---
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 5.2, currency: 'PEN', expiryDate: '2027-09-30' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 4.8, currency: 'PEN', expiryDate: '2027-11-20' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'pn-metro', price: 5.0, currency: 'PEN', expiryDate: '2027-10-10' },
  { sku: 'SKU-0002', name: 'Arroz Costeño Extra 1kg', categoryId: 'cat-groceries', storeId: 'jp-tottus', price: 5.4, currency: 'PEN', expiryDate: '2027-10-05' },

  // --- SKU-0003: Aceite Primor 1L (groceries) ---
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 12.9, currency: 'PEN', expiryDate: '2027-06-10' },
  { sku: 'SKU-0003', name: 'Aceite Primor 1L', categoryId: 'cat-groceries', storeId: 'jp-plaza-vea', price: 13.5, currency: 'PEN', expiryDate: '2027-06-30' },

  // --- SKU-0004: Fideos Don Vittorio 500g (groceries) ---
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 3.9, currency: 'PEN', expiryDate: '2027-08-01' },
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'jp-plaza-vea', price: 3.5, currency: 'PEN', expiryDate: '2027-07-15' },
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'jp-tottus', price: 3.9, currency: 'PEN', expiryDate: '2027-08-10' },
  { sku: 'SKU-0004', name: 'Fideos Don Vittorio 500g', categoryId: 'cat-groceries', storeId: 'pn-metro', price: 4.1, currency: 'PEN', expiryDate: '2027-07-20' },

  // --- SKU-0005: Atún Florida 170g (groceries) ---
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 7.4, currency: 'PEN', expiryDate: '2028-01-31' },
  { sku: 'SKU-0005', name: 'Atún Florida 170g', categoryId: 'cat-groceries', storeId: 'md-tottus', price: 7.9, currency: 'PEN', expiryDate: '2028-01-31' },

  // --- SKU-0006: Gaseosa Inca Kola 1.5L (beverages) ---
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'md-tottus', price: 8.5, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'pn-makro', price: 7.9, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'jp-plaza-vea', price: 8.2, currency: 'PEN', expiryDate: '2027-04-30' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'jp-tottus', price: 8.5, currency: 'PEN', expiryDate: '2027-05-20' },
  { sku: 'SKU-0006', name: 'Gaseosa Inca Kola 1.5L', categoryId: 'cat-beverages', storeId: 'pn-metro', price: 8.9, currency: 'PEN', expiryDate: '2027-05-15' },

  // --- SKU-0007: Agua San Luis 625ml (beverages) ---
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', storeId: 'pn-makro', price: 1.8, currency: 'PEN', expiryDate: '2027-12-01' },
  { sku: 'SKU-0007', name: 'Agua San Luis 625ml', categoryId: 'cat-beverages', storeId: 'jp-plaza-vea', price: 2.0, currency: 'PEN', expiryDate: '2027-12-01' },

  // --- SKU-0008: Detergente Bolívar 900g (cleaning) ---
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'md-tottus', price: 14.9, currency: 'PEN', expiryDate: '2029-01-01' },
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'pn-makro', price: 13.5, currency: 'PEN', expiryDate: '2029-01-01' },
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'jp-tottus', price: 14.9, currency: 'PEN', expiryDate: '2029-01-01' },
  { sku: 'SKU-0008', name: 'Detergente Bolívar 900g', categoryId: 'cat-cleaning', storeId: 'pn-metro', price: 15.5, currency: 'PEN', expiryDate: '2029-02-15' },

  // --- SKU-0009: Lejía Clorox 1L (cleaning) ---
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', storeId: 'pn-makro', price: 6.9, currency: 'PEN', expiryDate: '2028-06-30' },
  { sku: 'SKU-0009', name: 'Lejía Clorox 1L', categoryId: 'cat-cleaning', storeId: 'jp-plaza-vea', price: 7.3, currency: 'PEN', expiryDate: '2028-06-30' },

  // --- SKU-0010: Galletas Soda Field 300g (snacks) ---
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'md-tottus', price: 2.9, currency: 'PEN', expiryDate: '2027-10-15' },
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'jp-plaza-vea', price: 3.2, currency: 'PEN', expiryDate: '2027-10-15' },
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'jp-tottus', price: 2.9, currency: 'PEN', expiryDate: '2027-10-15' },
  { sku: 'SKU-0010', name: 'Galletas Soda Field 300g', categoryId: 'cat-snacks', storeId: 'pn-metro', price: 3.0, currency: 'PEN', expiryDate: '2027-10-20' },

  // --- SKU-0011: Yogur Gloria Fresa 1L (dairy) ---
  { sku: 'SKU-0011', name: 'Yogur Gloria Fresa 1L', categoryId: 'cat-dairy', storeId: 'md-tottus', price: 7.9, currency: 'PEN', expiryDate: '2027-04-15' },
  { sku: 'SKU-0011', name: 'Yogur Gloria Fresa 1L', categoryId: 'cat-dairy', storeId: 'jp-plaza-vea', price: 7.5, currency: 'PEN', expiryDate: '2027-04-12' },
  { sku: 'SKU-0011', name: 'Yogur Gloria Fresa 1L', categoryId: 'cat-dairy', storeId: 'jp-tottus', price: 7.9, currency: 'PEN', expiryDate: '2027-04-18' },
  { sku: 'SKU-0011', name: 'Yogur Gloria Fresa 1L', categoryId: 'cat-dairy', storeId: 'pn-metro', price: 7.7, currency: 'PEN', expiryDate: '2027-04-10' },
  { sku: 'SKU-0011', name: 'Yogur Gloria Fresa 1L', categoryId: 'cat-dairy', storeId: 'pn-makro', price: 6.9, currency: 'PEN', expiryDate: '2027-04-05' },

  // --- SKU-0012: Gaseosa Coca-Cola 1.5L (beverages) ---
  { sku: 'SKU-0012', name: 'Gaseosa Coca-Cola 1.5L', categoryId: 'cat-beverages', storeId: 'md-tottus', price: 7.5, currency: 'PEN', expiryDate: '2027-08-20' },
  { sku: 'SKU-0012', name: 'Gaseosa Coca-Cola 1.5L', categoryId: 'cat-beverages', storeId: 'jp-tottus', price: 7.5, currency: 'PEN', expiryDate: '2027-08-25' },
  { sku: 'SKU-0012', name: 'Gaseosa Coca-Cola 1.5L', categoryId: 'cat-beverages', storeId: 'pn-metro', price: 7.2, currency: 'PEN', expiryDate: '2027-08-15' },
  { sku: 'SKU-0012', name: 'Gaseosa Coca-Cola 1.5L', categoryId: 'cat-beverages', storeId: 'pn-makro', price: 6.8, currency: 'PEN', expiryDate: '2027-08-10' },

  // --- SKU-0013: Papel Higiénico Elite Doble Hoja 4 rollos (cleaning) ---
  { sku: 'SKU-0013', name: 'Papel Higiénico Elite Doble Hoja 4 rollos', categoryId: 'cat-cleaning', storeId: 'md-tottus', price: 12.9, currency: 'PEN', expiryDate: '2029-05-31' },
  { sku: 'SKU-0013', name: 'Papel Higiénico Elite Doble Hoja 4 rollos', categoryId: 'cat-cleaning', storeId: 'jp-tottus', price: 12.9, currency: 'PEN', expiryDate: '2029-05-31' },
  { sku: 'SKU-0013', name: 'Papel Higiénico Elite Doble Hoja 4 rollos', categoryId: 'cat-cleaning', storeId: 'pn-metro', price: 11.9, currency: 'PEN', expiryDate: '2029-06-30' },

  // --- SKU-0014: Chocolate Sublime 30g (snacks) ---
  { sku: 'SKU-0014', name: 'Chocolate Sublime 30g', categoryId: 'cat-snacks', storeId: 'md-tottus', price: 2.5, currency: 'PEN', expiryDate: '2027-12-31' },
  { sku: 'SKU-0014', name: 'Chocolate Sublime 30g', categoryId: 'cat-snacks', storeId: 'jp-tottus', price: 2.5, currency: 'PEN', expiryDate: '2027-12-31' },
  { sku: 'SKU-0014', name: 'Chocolate Sublime 30g', categoryId: 'cat-snacks', storeId: 'pn-metro', price: 2.4, currency: 'PEN', expiryDate: '2028-01-15' },

  // --- SKU-0015: Arroz Costeño Extra 5kg (groceries) ---
  { sku: 'SKU-0015', name: 'Arroz Costeño Extra 5kg', categoryId: 'cat-groceries', storeId: 'jp-plaza-vea', price: 24.9, currency: 'PEN', expiryDate: '2028-03-31' },
  { sku: 'SKU-0015', name: 'Arroz Costeño Extra 5kg', categoryId: 'cat-groceries', storeId: 'jp-tottus', price: 25.5, currency: 'PEN', expiryDate: '2028-04-15' },
  { sku: 'SKU-0015', name: 'Arroz Costeño Extra 5kg', categoryId: 'cat-groceries', storeId: 'pn-makro', price: 22.9, currency: 'PEN', expiryDate: '2028-02-28' },

  // --- SKU-0016: Polo Manga Corta para Mujer (fashion, women) ---
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-ripley', price: 39.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-oechsle', price: 36.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-falabella', price: 41.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-ripley', price: 40.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-oechsle', price: 37.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-falabella', price: 42.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-ripley', price: 38.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-oechsle', price: 35.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-falabella', price: 43.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0016', name: 'Polo Manga Corta para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-estilos', price: 32.9, currency: 'PEN', expiryDate: '2031-01-31' },

  // --- SKU-0017: Jean Slim para Mujer (fashion, women) ---
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-ripley', price: 89.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-oechsle', price: 84.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'md-falabella', price: 92.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-ripley', price: 90.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-oechsle', price: 86.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'jp-falabella', price: 94.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-ripley', price: 88.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-oechsle', price: 82.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-falabella', price: 95.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0017', name: 'Jean Slim para Mujer', categoryId: 'cat-fashion-women', storeId: 'pn-estilos', price: 79.9, currency: 'PEN', expiryDate: '2031-01-31' },

  // --- SKU-0018: Polo Piqué para Hombre (fashion, men) ---
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'md-ripley', price: 49.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'md-oechsle', price: 45.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'md-falabella', price: 52.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'jp-ripley', price: 50.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'jp-oechsle', price: 46.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'jp-falabella', price: 53.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'pn-ripley', price: 48.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'pn-oechsle', price: 44.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'pn-falabella', price: 54.9, currency: 'PEN', expiryDate: '2031-01-31' },
  { sku: 'SKU-0018', name: 'Polo Piqué para Hombre', categoryId: 'cat-fashion-men', storeId: 'pn-estilos', price: 42.9, currency: 'PEN', expiryDate: '2031-01-31' },

  // --- SKU-0019: Zapatillas Urbanas (footwear) ---
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'md-ripley', price: 159.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'md-oechsle', price: 149.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'md-falabella', price: 164.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'jp-ripley', price: 161.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'jp-oechsle', price: 151.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'jp-falabella', price: 166.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'pn-ripley', price: 158.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'pn-oechsle', price: 147.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'pn-falabella', price: 168.9, currency: 'PEN', expiryDate: '2031-03-31' },
  { sku: 'SKU-0019', name: 'Zapatillas Urbanas', categoryId: 'cat-footwear', storeId: 'pn-estilos', price: 139.9, currency: 'PEN', expiryDate: '2031-03-31' },

  // --- SKU-0020: Juego de Sábanas 2 Plazas (home linen) ---
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'md-ripley', price: 129.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'md-oechsle', price: 124.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'md-falabella', price: 134.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'jp-ripley', price: 131.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'jp-oechsle', price: 126.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'jp-falabella', price: 136.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'pn-ripley', price: 128.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'pn-oechsle', price: 122.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'pn-falabella', price: 138.9, currency: 'PEN', expiryDate: '2031-06-30' },
  { sku: 'SKU-0020', name: 'Juego de Sábanas 2 Plazas', categoryId: 'cat-home-linen', storeId: 'pn-estilos', price: 118.9, currency: 'PEN', expiryDate: '2031-06-30' },

  // --- SKU-0021: Audífonos Bluetooth (electronics) ---
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'md-ripley', price: 99.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'md-oechsle', price: 94.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'md-falabella', price: 104.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'jp-ripley', price: 101.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'jp-oechsle', price: 96.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'jp-falabella', price: 106.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'pn-ripley', price: 98.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'pn-oechsle', price: 92.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'pn-falabella', price: 108.9, currency: 'PEN', expiryDate: '2031-12-31' },
  { sku: 'SKU-0021', name: 'Audífonos Bluetooth', categoryId: 'cat-electronics', storeId: 'pn-estilos', price: 88.9, currency: 'PEN', expiryDate: '2031-12-31' },

  // --- SKU-0022: Taladro Percutor 650W (hardware) ---
  { sku: 'SKU-0022', name: 'Taladro Percutor 650W', categoryId: 'cat-hardware', storeId: 'jp-sodimac', price: 189.9, currency: 'PEN', expiryDate: '2032-01-31' },
  { sku: 'SKU-0022', name: 'Taladro Percutor 650W', categoryId: 'cat-hardware', storeId: 'pn-sodimac', price: 184.9, currency: 'PEN', expiryDate: '2032-01-31' },

  // --- SKU-0023: Juego de Destornilladores x6 (hardware) ---
  { sku: 'SKU-0023', name: 'Juego de Destornilladores x6', categoryId: 'cat-hardware', storeId: 'jp-sodimac', price: 39.9, currency: 'PEN', expiryDate: '2032-01-31' },
  { sku: 'SKU-0023', name: 'Juego de Destornilladores x6', categoryId: 'cat-hardware', storeId: 'pn-sodimac', price: 37.9, currency: 'PEN', expiryDate: '2032-01-31' },

  // --- SKU-0024: Pintura Látex Blanca 1 Galón (paint) ---
  { sku: 'SKU-0024', name: 'Pintura Látex Blanca 1 Galón', categoryId: 'cat-paint', storeId: 'jp-sodimac', price: 79.9, currency: 'PEN', expiryDate: '2032-06-30' },
  { sku: 'SKU-0024', name: 'Pintura Látex Blanca 1 Galón', categoryId: 'cat-paint', storeId: 'pn-sodimac', price: 76.9, currency: 'PEN', expiryDate: '2032-06-30' },

  // --- SKU-0025: Grifería Monomando para Cocina (plumbing) ---
  { sku: 'SKU-0025', name: 'Grifería Monomando para Cocina', categoryId: 'cat-plumbing', storeId: 'jp-sodimac', price: 129.9, currency: 'PEN', expiryDate: '2032-01-31' },
  { sku: 'SKU-0025', name: 'Grifería Monomando para Cocina', categoryId: 'cat-plumbing', storeId: 'pn-sodimac', price: 124.9, currency: 'PEN', expiryDate: '2032-01-31' },

  // --- SKU-0026: Juego de Macetas de Barro x3 (garden) ---
  { sku: 'SKU-0026', name: 'Juego de Macetas de Barro x3', categoryId: 'cat-garden', storeId: 'jp-sodimac', price: 34.9, currency: 'PEN', expiryDate: '2032-01-31' },
  { sku: 'SKU-0026', name: 'Juego de Macetas de Barro x3', categoryId: 'cat-garden', storeId: 'pn-sodimac', price: 32.9, currency: 'PEN', expiryDate: '2032-01-31' },

  // --- SKU-0027: Foco LED 9W (lighting) ---
  { sku: 'SKU-0027', name: 'Foco LED 9W', categoryId: 'cat-lighting', storeId: 'jp-sodimac', price: 12.9, currency: 'PEN', expiryDate: '2032-01-31' },
  { sku: 'SKU-0027', name: 'Foco LED 9W', categoryId: 'cat-lighting', storeId: 'pn-sodimac', price: 11.9, currency: 'PEN', expiryDate: '2032-01-31' },
]
