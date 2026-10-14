import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

const STORED_USER = {
  id: 'user-seed',
  name: 'Ana',
  email: 'ana@example.com',
  password: 'secreto',
}

const MALL = {
  id: 'mall-del-sur',
  name: 'Mall del Sur',
  district: 'San Juan de Miraflores',
}

const STORE_WITH_CATALOG = {
  id: 'md-tottus',
  mallId: 'mall-del-sur',
  name: 'Tottus',
  category: 'supermercado',
}

const STORE_WITHOUT_CATALOG = {
  id: 'md-ripley',
  mallId: 'mall-del-sur',
  name: 'Ripley',
  category: 'tienda por departamento',
}

function seedSelection(store: unknown) {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))
  window.localStorage.setItem(StorageKeys.store, JSON.stringify(store))
}

describe('CatalogPlaceholder', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores the mall and store selection from storage', async () => {
    seedSelection(STORE_WITH_CATALOG)

    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Catálogo' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Comprando en Tottus — Mall del Sur.'),
    ).toBeInTheDocument()
  })

  it('previews the products of a store that has a catalog', async () => {
    seedSelection(STORE_WITH_CATALOG)

    renderApp(['/catalog'])

    expect(
      await screen.findByText('Leche Gloria Entera 400g'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('Esta tienda todavía no tiene catálogo.'),
    ).toBeNull()
  })

  it('explains that a store without catalog has no products', async () => {
    seedSelection(STORE_WITHOUT_CATALOG)

    renderApp(['/catalog'])

    expect(
      await screen.findByText('Esta tienda todavía no tiene catálogo.'),
    ).toBeInTheDocument()
  })
})
