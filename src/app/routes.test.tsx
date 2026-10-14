import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { renderApp } from '../test/renderApp'

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
      screen.queryByRole('heading', { name: 'Elige tu supermercado' }),
    ).not.toBeInTheDocument()
  })

  it('redirects an unknown path to the gate when there is no session', async () => {
    renderApp(['/not-a-route'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
  })

  it('keeps the catalog behind both the auth gate and a supermarket choice', async () => {
    renderApp(['/catalog'])

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Catálogo' }),
    ).not.toBeInTheDocument()
  })
})
