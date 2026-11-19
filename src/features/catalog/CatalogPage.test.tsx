import { act, cleanup, fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { CartLine, Product } from '../../data/types'
import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

/**
 * Every seeded store now carries a catalog, so the "no catalog" screen can only
 * be reached by emptying the seed on purpose. `catalog.products` is the very
 * array the app reads from `src/data/catalog`, so one test can blank it and
 * restore it afterwards without weakening the assertion.
 */
const catalog = vi.hoisted(() => ({
  products: [] as Product[],
  seed: [] as Product[],
}))

vi.mock('../../data/catalog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../data/catalog')>()
  catalog.seed = [...actual.products]
  catalog.products = [...actual.products]
  return { ...actual, products: catalog.products }
})

const STORED_USER = {
  id: 'user-seed',
  name: 'Ana',
  email: 'ana@example.com',
  password: 'secreto',
}

const MALL_DEL_SUR = {
  id: 'mall-del-sur',
  name: 'Mall del Sur',
  district: 'San Juan de Miraflores',
}

const MALL_JOCKEY = {
  id: 'jockey-plaza',
  name: 'Jockey Plaza',
  district: 'Santiago de Surco',
}

const TOTTUS = {
  id: 'md-tottus',
  mallId: 'mall-del-sur',
  name: 'Tottus',
  category: 'supermercado',
}

const PLAZA_VEA = {
  id: 'jp-plaza-vea',
  mallId: 'jockey-plaza',
  name: 'Plaza Vea',
  category: 'supermercado',
}

const RIPLEY = {
  id: 'md-ripley',
  mallId: 'mall-del-sur',
  name: 'Ripley',
  category: 'tienda por departamento',
}

function seedSelection(store: unknown, mall: unknown = MALL_DEL_SUR) {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(mall))
  window.localStorage.setItem(StorageKeys.store, JSON.stringify(store))
}

describe('CatalogPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    // Restore the seed rows in case a previous test blanked the catalog.
    catalog.products.splice(0, catalog.products.length, ...catalog.seed)
  })

  it('restores the mall and store selection from storage', async () => {
    seedSelection(TOTTUS)

    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Catálogo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Comprando en Tottus — Mall del Sur.'),
    ).toBeInTheDocument()
  })

  it('groups the products of the chosen store by aisle', async () => {
    seedSelection(TOTTUS)

    renderApp(['/catalog'])

    await screen.findAllByText('Leche Gloria Entera 400g')
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pasillo 2 · Lácteos y huevos',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pasillo 1 · Abarrotes y aceites',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pasillo 3 · Bebidas y gaseosas',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Pasillo 5 · Snacks y galletas',
      }),
    ).toBeInTheDocument()
  })

  it('summarizes what each aisle of this store holds', async () => {
    seedSelection(TOTTUS)

    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Pasillos de esta tienda',
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('Pasillo 2')).toBeInTheDocument()
    expect(screen.getByText('Lácteos y huevos')).toBeInTheDocument()
  })

  it('exposes the sku, name and expiry of each product', async () => {
    seedSelection(TOTTUS)

    renderApp(['/catalog'])

    expect(
      await screen.findByText('SKU-0001 · Vence 15/03/2027'),
    ).toBeInTheDocument()
  })

  it('shows a different price for the same sku in another store', async () => {
    seedSelection(TOTTUS)
    renderApp(['/catalog'])

    // The same amount appears in the aisle row and as the promo card's old price.
    expect((await screen.findAllByText('S/ 4.90')).length).toBeGreaterThan(0)

    cleanup()
    seedSelection(PLAZA_VEA, MALL_JOCKEY)
    renderApp(['/catalog'])

    expect((await screen.findAllByText('S/ 4.70')).length).toBeGreaterThan(0)
    expect(screen.queryAllByText('S/ 4.90')).toHaveLength(0)
  })

  it('adds a promoted product at its discounted unit price', async () => {
    const user = userEvent.setup()
    seedSelection(TOTTUS)
    renderApp(['/catalog'])

    await user.click(
      await screen.findByRole('button', {
        name: 'Agregar Leche Gloria Entera 400g en promoción',
      }),
    )

    const cart = JSON.parse(
      window.localStorage.getItem(StorageKeys.cart) ?? '[]',
    ) as CartLine[]
    expect(cart).toEqual([
      { sku: 'SKU-0001', storeId: 'md-tottus', qty: 1, unitPrice: 3.92 },
    ])
  })

  it('does not show a confirmation toast before any add', async () => {
    seedSelection(TOTTUS)
    renderApp(['/catalog'])

    await screen.findByRole('heading', { level: 1, name: 'Catálogo' })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByText('Agregado al carrito')).not.toBeInTheDocument()
  })

  it('confirms an aisle add with the product name', async () => {
    const user = userEvent.setup()
    seedSelection(TOTTUS)
    renderApp(['/catalog'])

    await user.click(
      await screen.findByRole('button', {
        name: 'Agregar Leche Gloria Entera 400g',
      }),
    )

    const toast = await screen.findByRole('status')
    expect(toast).toHaveTextContent('Agregado al carrito')
    expect(toast).toHaveTextContent('Leche Gloria Entera 400g')
  })

  it('confirms a promotion add with the product name', async () => {
    const user = userEvent.setup()
    seedSelection(TOTTUS)
    renderApp(['/catalog'])

    await user.click(
      await screen.findByRole('button', {
        name: 'Agregar Leche Gloria Entera 400g en promoción',
      }),
    )

    const toast = await screen.findByRole('status')
    expect(toast).toHaveTextContent('Agregado al carrito')
    expect(toast).toHaveTextContent('Leche Gloria Entera 400g')
  })

  it('dismisses the toast after about 2.5 seconds', () => {
    vi.useFakeTimers()
    try {
      seedSelection(TOTTUS)
      renderApp(['/catalog'])

      fireEvent.click(
        screen.getByRole('button', { name: 'Agregar Leche Gloria Entera 400g' }),
      )
      expect(screen.getByRole('status')).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(2500)
      })

      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  it('explains that a store without catalog has no products', async () => {
    // No seeded store reaches this state any more, so the defensive screen is
    // simulated by emptying the catalog the page reads. The assertion stays
    // intact: an empty store must still show this message.
    catalog.products.length = 0
    seedSelection(RIPLEY)

    renderApp(['/catalog'])

    expect(
      await screen.findByText('Esta tienda todavía no tiene catálogo.'),
    ).toBeInTheDocument()
  })
})
