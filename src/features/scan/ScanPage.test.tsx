import { screen, within } from '@testing-library/react'
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

function seedSessionWithStore() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))
  window.localStorage.setItem(StorageKeys.store, JSON.stringify(TOTTUS))
}

describe('ScanPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSessionWithStore()
  })

  it('offers the simulate fallback when the camera is unavailable', async () => {
    renderApp(['/scan'])

    expect(
      await screen.findByText(/La cámara no está disponible/),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Simular escaneo' }),
    ).toBeInTheDocument()
  })

  it('lists only the skus of the chosen store in the simulate selector', async () => {
    renderApp(['/scan'])

    const select = await screen.findByLabelText('Producto')

    expect(
      within(select).getByRole('option', { name: /Leche Gloria/ }),
    ).toBeInTheDocument()
    // SKU-0003 is sold by Makro/Plaza Vea, never by Tottus.
    expect(
      within(select).queryByRole('option', { name: /Aceite Primor/ }),
    ).toBeNull()
  })

  it('shows the detail card for a known sku picked in the fallback', async () => {
    const user = userEvent.setup()
    renderApp(['/scan'])

    await user.selectOptions(
      await screen.findByLabelText('Producto'),
      'SKU-0001',
    )

    const card = await screen.findByRole('region', {
      name: 'Detalle del producto',
    })
    expect(within(card).getByText('Leche Gloria Entera 400g')).toBeInTheDocument()
    expect(within(card).getByText('S/ 4.90')).toBeInTheDocument()
    expect(within(card).getByText('15/03/2027')).toBeInTheDocument()
    expect(within(card).getByText('Pasillo 2')).toBeInTheDocument()
  })

  it('shows no card and an error banner for an unknown sku', async () => {
    const user = userEvent.setup()
    renderApp(['/scan'])

    await screen.findByText(/La cámara no está disponible/)
    await user.type(await screen.findByLabelText('Otro código'), 'SKU-9999')
    await user.click(screen.getByRole('button', { name: 'Escanear' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No encontramos ningún producto con el código «SKU-9999»',
    )
    expect(
      screen.queryByRole('region', { name: 'Detalle del producto' }),
    ).toBeNull()
  })

  it('shows no card and a distinct banner for a sku from another store', async () => {
    const user = userEvent.setup()
    renderApp(['/scan'])

    await screen.findByText(/La cámara no está disponible/)
    await user.type(await screen.findByLabelText('Otro código'), 'SKU-0003')
    await user.click(screen.getByRole('button', { name: 'Escanear' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'se vende en Makro, no en Tottus',
    )
    expect(
      screen.queryByRole('region', { name: 'Detalle del producto' }),
    ).toBeNull()
  })
})
