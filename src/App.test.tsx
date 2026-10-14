import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('opens on the auth gate when there is no session', async () => {
    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
  })
})
