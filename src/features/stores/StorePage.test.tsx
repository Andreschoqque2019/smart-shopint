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

function seedSessionWithMall() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))
}

describe('StorePage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSessionWithMall()
  })

  it('lists only the stores of the chosen mall', async () => {
    renderApp(['/stores'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Mall del Sur' }),
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /Tottus/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Ripley/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Oechsle/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Falabella/ })).toBeInTheDocument()

    // Stores from other malls never show up in this list.
    expect(screen.queryByRole('button', { name: /Plaza Vea/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /Metro/ })).toBeNull()
    expect(screen.queryByRole('button', { name: /Makro/ })).toBeNull()
  })

  it('shows each store category label in Spanish', async () => {
    renderApp(['/stores'])

    await screen.findByRole('heading', { level: 1, name: 'Mall del Sur' })

    expect(screen.getByText('Supermercado')).toBeInTheDocument()
    expect(screen.getAllByText('Tienda por departamento').length).toBe(3)
  })

  it('persists the chosen store and opens the catalog', async () => {
    const user = userEvent.setup()
    renderApp(['/stores'])

    await user.click(await screen.findByRole('button', { name: /Tottus/ }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Catálogo' }),
    ).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem(StorageKeys.store) as string),
    ).toEqual({
      id: 'md-tottus',
      mallId: 'mall-del-sur',
      name: 'Tottus',
      category: 'supermercado',
    })
  })

  it('lets the user go back to the mall picker', async () => {
    const user = userEvent.setup()
    renderApp(['/stores'])

    await user.click(
      await screen.findByRole('button', { name: 'Volver a centros comerciales' }),
    )

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Elegí tu centro comercial',
      }),
    ).toBeInTheDocument()
  })
})
