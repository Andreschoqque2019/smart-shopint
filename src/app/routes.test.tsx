import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { StorageKeys } from '../lib/storage'
import { renderApp } from '../test/renderApp'

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

function seedSession() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
}

describe('auth gate', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('blocks an unauthenticated visitor at the protected root', async () => {
    renderApp(['/'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Elegí tu centro comercial' }),
    ).not.toBeInTheDocument()
  })

  it('redirects an unknown path to the gate when there is no session', async () => {
    renderApp(['/not-a-route'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
  })
})

describe('selection gate', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSession()
  })

  it('keeps the catalog behind the auth gate for a signed-in user with no mall', async () => {
    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Elegí tu centro comercial',
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Catálogo' }),
    ).not.toBeInTheDocument()
  })

  it('redirects to the store picker when a mall is chosen but no store is', async () => {
    window.localStorage.setItem(StorageKeys.mall, JSON.stringify(MALL))

    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Mall del Sur' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 1, name: 'Catálogo' }),
    ).not.toBeInTheDocument()
  })

  it('redirects the store list to the mall picker when no mall is chosen', async () => {
    renderApp(['/stores'])

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Elegí tu centro comercial',
      }),
    ).toBeInTheDocument()
  })
})
