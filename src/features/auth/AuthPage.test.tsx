import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

const STORED_ACCOUNT = {
  id: 'user-seed',
  name: 'Ana',
  email: 'ana@example.com',
  password: 'secreto',
}

function seedAccounts() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_ACCOUNT], currentUser: null }),
  )
}

function readStoredAuth() {
  return JSON.parse(window.localStorage.getItem(StorageKeys.auth) as string)
}

describe('AuthPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('registers a new account, persists the session and unlocks the app', async () => {
    const user = userEvent.setup()
    renderApp(['/auth'])

    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await user.type(screen.getByLabelText('Nombre'), 'Beto')
    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'beto@example.com',
    )
    await user.type(screen.getByLabelText('Contraseña'), 'clave123')
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByRole('heading', { name: 'Elegí tu centro comercial' }),
    ).toBeInTheDocument()

    const stored = readStoredAuth()
    expect(stored.accounts).toHaveLength(1)
    expect(stored.currentUser).toMatchObject({ email: 'beto@example.com' })
  })

  it('signs an existing account in and persists the session', async () => {
    const user = userEvent.setup()
    seedAccounts()
    renderApp(['/auth'])

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'ana@example.com',
    )
    await user.type(screen.getByLabelText('Contraseña'), 'secreto')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(
      await screen.findByRole('heading', { name: 'Elegí tu centro comercial' }),
    ).toBeInTheDocument()
    expect(readStoredAuth().currentUser).toMatchObject({
      email: 'ana@example.com',
    })
  })

  it('rejects wrong credentials and keeps access blocked', async () => {
    const user = userEvent.setup()
    seedAccounts()
    renderApp(['/auth'])

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'ana@example.com',
    )
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Correo o contraseña incorrectos.',
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
    expect(readStoredAuth().currentUser).toBeNull()
  })

  it('restores a persisted session without asking again', async () => {
    window.localStorage.setItem(
      StorageKeys.auth,
      JSON.stringify({ accounts: [STORED_ACCOUNT], currentUser: STORED_ACCOUNT }),
    )
    renderApp(['/'])

    expect(
      await screen.findByRole('heading', { name: 'Elegí tu centro comercial' }),
    ).toBeInTheDocument()
    expect(screen.queryByLabelText('Contraseña')).not.toBeInTheDocument()
  })
})
