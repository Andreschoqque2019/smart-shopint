import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { CART_CLEARED_MESSAGE } from '../../app/appState'
import type { CartLine } from '../../data/types'
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

const TOTTUS = {
  id: 'md-tottus',
  mallId: 'mall-del-sur',
  name: 'Tottus',
  category: 'supermercado',
}

const LECHE: CartLine = {
  sku: 'SKU-0001',
  storeId: 'md-tottus',
  qty: 1,
  unitPrice: 4.9,
}

const ARROZ: CartLine = {
  sku: 'SKU-0002',
  storeId: 'md-tottus',
  qty: 1,
  unitPrice: 5.2,
}

function seedSession() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))
  window.localStorage.setItem(StorageKeys.store, JSON.stringify(TOTTUS))
}

function seedCart(lines: CartLine[]) {
  window.localStorage.setItem(StorageKeys.cart, JSON.stringify(lines))
}

function totalGroup() {
  return screen.getByRole('group', { name: 'Total del carrito' })
}

describe('CartPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('restores the persisted cart and shows the exact live total', async () => {
    seedSession()
    seedCart([{ ...LECHE, qty: 3 }])

    renderApp(['/cart'])

    expect(
      await screen.findByText('Leche Gloria Entera 400g'),
    ).toBeInTheDocument()
    // 3 x 4.90 must render S/ 14.70, never 14.700000000000001.
    expect(within(totalGroup()).getByText('S/ 14.70')).toBeInTheDocument()
  })

  it('adds a catalog product and the total follows the added line', async () => {
    const user = userEvent.setup()
    seedSession()

    renderApp(['/catalog'])

    const add = await screen.findByRole('button', {
      name: 'Agregar Leche Gloria Entera 400g',
    })
    await user.click(add)
    expect(
      screen.getByRole('button', { name: 'Carrito (1)' }),
    ).toBeInTheDocument()

    // The same sku merges into one line instead of duplicating.
    await user.click(add)
    expect(
      screen.getByRole('button', { name: 'Carrito (2)' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Carrito (2)' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tu carrito' }),
    ).toBeInTheDocument()
    // 2 x 4.90
    expect(within(totalGroup()).getByText('S/ 9.80')).toBeInTheDocument()
  })

  it('decrements a line and lowers the total', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([{ ...LECHE, qty: 2 }])

    renderApp(['/cart'])

    await user.click(
      await screen.findByRole('button', {
        name: 'Quitar una unidad de Leche Gloria Entera 400g',
      }),
    )

    expect(within(totalGroup()).getByText('S/ 4.90')).toBeInTheDocument()
  })

  it('removes a line and lowers the total', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([LECHE, ARROZ])

    renderApp(['/cart'])

    expect(within(totalGroup()).getByText('S/ 10.10')).toBeInTheDocument()

    await user.click(
      screen.getByRole('button', { name: 'Eliminar Leche Gloria Entera 400g' }),
    )

    expect(within(totalGroup()).getByText('S/ 5.20')).toBeInTheDocument()
    expect(screen.queryByText('Leche Gloria Entera 400g')).toBeNull()
  })

  it('empties the cart when the last line is removed', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([LECHE])

    renderApp(['/cart'])

    await user.click(
      await screen.findByRole('button', {
        name: 'Eliminar Leche Gloria Entera 400g',
      }),
    )

    expect(await screen.findByText('Tu carrito está vacío.')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Total del carrito' })).toBeNull()
  })

  it('clears the cart and explains why when the store changes', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([LECHE])

    renderApp(['/stores'])

    await user.click(await screen.findByRole('button', { name: /Ripley/ }))

    expect(await screen.findByText(CART_CLEARED_MESSAGE)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Carrito (0)' }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(StorageKeys.cart)).toBeNull()
  })
})
