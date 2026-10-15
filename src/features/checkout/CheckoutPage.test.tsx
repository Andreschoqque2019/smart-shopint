import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

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
  qty: 3,
  unitPrice: 4.9,
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

describe('CheckoutPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('blocks checkout when the cart is empty', async () => {
    seedSession()

    renderApp(['/checkout'])

    expect(
      await screen.findByRole('heading', { name: 'No podés confirmar el pago' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Confirmar pedido' }),
    ).toBeNull()
  })

  it('states visibly that the payment is simulated', async () => {
    seedSession()
    seedCart([LECHE])

    renderApp(['/checkout'])

    expect(await screen.findByText('Pago SIMULADO')).toBeInTheDocument()
    expect(screen.getByText(/no se cobra dinero real/i)).toBeInTheDocument()
  })

  it('keeps confirm disabled until a method is chosen', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([LECHE])

    renderApp(['/checkout'])

    const confirm = await screen.findByRole('button', {
      name: 'Confirmar pedido',
    })
    expect(confirm).toBeDisabled()

    await user.click(screen.getByRole('radio', { name: 'Plin' }))
    expect(confirm).toBeEnabled()
  })

  it('creates and persists the order, then empties the cart', async () => {
    const user = userEvent.setup()
    seedSession()
    seedCart([LECHE])

    renderApp(['/checkout'])

    await user.click(await screen.findByRole('radio', { name: 'Yape' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }))

    expect(
      await screen.findByRole('heading', { name: 'Pedido confirmado' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(window.localStorage.getItem(StorageKeys.orders)).not.toBeNull()
    })

    const stored = JSON.parse(
      window.localStorage.getItem(StorageKeys.orders) as string,
    ) as Array<{ id: string; total: number; paymentMethod: string }>

    expect(stored).toHaveLength(1)
    expect(stored[0].paymentMethod).toBe('yape')
    expect(stored[0].total).toBe(14.7)
    expect(stored[0].id).toMatch(/^ord-/)
    expect(window.localStorage.getItem(StorageKeys.cart)).toBeNull()
  })
})
