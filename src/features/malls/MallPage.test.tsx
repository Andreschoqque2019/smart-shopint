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

describe('MallPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    seedSession()
  })

  it('lists the three seeded malls with their district', async () => {
    renderApp(['/'])

    expect(
      await screen.findByRole('button', { name: /Mall del Sur/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Jockey Plaza/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Plaza Norte/ }),
    ).toBeInTheDocument()

    expect(screen.getByText('San Juan de Miraflores')).toBeInTheDocument()
    expect(screen.getByText('Santiago de Surco')).toBeInTheDocument()
    expect(screen.getByText('Independencia')).toBeInTheDocument()
  })

  it('persists the chosen mall and opens its store list', async () => {
    const user = userEvent.setup()
    renderApp(['/'])

    await user.click(
      await screen.findByRole('button', { name: /Mall del Sur/ }),
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Mall del Sur' }),
    ).toBeInTheDocument()
    expect(
      JSON.parse(window.localStorage.getItem(StorageKeys.mall) as string),
    ).toEqual({
      id: 'mall-del-sur',
      name: 'Mall del Sur',
      district: 'San Juan de Miraflores',
    })
  })
})
