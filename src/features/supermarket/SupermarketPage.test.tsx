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

function seedSession() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
}

describe('SupermarketPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSession()
  })

  it('lists the seeded supermarkets', async () => {
    renderApp(['/'])

    expect(
      await screen.findByRole('button', { name: 'Wong' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Metro' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Plaza Vea' }),
    ).toBeInTheDocument()
  })

  it('persists the chosen supermarket and opens the catalog', async () => {
    const user = userEvent.setup()
    renderApp(['/'])

    await user.click(await screen.findByRole('button', { name: 'Metro' }))

    expect(
      await screen.findByRole('heading', { name: 'Catálogo' }),
    ).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem(StorageKeys.supermarket) as string),
    ).toEqual({ id: 'sm-metro', name: 'Metro' })
  })

  it('prompts to choose when the catalog is opened directly', async () => {
    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', { name: 'Elige tu supermercado' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Catálogo' }),
    ).not.toBeInTheDocument()
  })
})
