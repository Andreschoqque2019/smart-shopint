import { cleanup, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

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

    expect(await screen.findByText('S/ 4.90')).toBeInTheDocument()

    cleanup()
    seedSelection(PLAZA_VEA, MALL_JOCKEY)
    renderApp(['/catalog'])

    expect(await screen.findByText('S/ 4.70')).toBeInTheDocument()
    expect(screen.queryByText('S/ 4.90')).toBeNull()
  })

  it('explains that a store without catalog has no products', async () => {
    seedSelection(RIPLEY)

    renderApp(['/catalog'])

    expect(
      await screen.findByText('Esta tienda todavía no tiene catálogo.'),
    ).toBeInTheDocument()
  })
})
