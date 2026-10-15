import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

const TOTTUS = {
  id: 'md-tottus',
  mallId: 'mall-del-sur',
  name: 'Tottus',
  category: 'supermercado',
}

function seedSession() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))
  window.localStorage.setItem(StorageKeys.store, JSON.stringify(TOTTUS))
}

describe('adding a scanned product to the cart', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSession()
  })

  it('adds the resolved product and makes it visible in the cart', async () => {
    const user = userEvent.setup()

    renderApp(['/scan'])

    await user.selectOptions(
      await screen.findByLabelText('Producto'),
      'SKU-0001',
    )
    await user.click(
      await screen.findByRole('button', { name: 'Agregar al carrito' }),
    )

    await user.click(screen.getByRole('button', { name: 'Carrito (1)' }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tu carrito' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Leche Gloria Entera 400g')).toBeInTheDocument()
  })
})
