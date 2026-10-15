import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Order } from '../../data/types'
import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

vi.mock('qrcode.react', () => ({
  QRCodeSVG: ({ value }: { value: string }) => (
    <svg data-testid="receipt-qr" data-value={value} />
  ),
}))

const STORED_USER = {
  id: 'user-seed',
  name: 'Ana',
  email: 'ana@example.com',
  password: 'secreto',
}

function order(id: string, createdAt: string): Order {
  return {
    id,
    lines: [{ sku: 'SKU-0001', storeId: 'md-tottus', qty: 1, unitPrice: 4.9 }],
    total: 4.9,
    paymentMethod: 'yape',
    createdAt,
  }
}

// Deliberately stored out of chronological order, to prove the page sorts by
// `createdAt` (never by id).
const ORDERS: Order[] = [
  order('ord-middle', '2026-10-11T09:00:00.000Z'),
  order('ord-oldest', '2026-10-10T09:00:00.000Z'),
  order('ord-newest', '2026-10-12T09:00:00.000Z'),
]

function seed(orders: Order[]) {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.orders, JSON.stringify(orders))
}

describe('HistoryPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('lists the confirmed orders with the most recent first', async () => {
    seed(ORDERS)

    renderApp(['/history'])

    const ids = (await screen.findAllByTestId('history-order-id')).map(
      (node) => node.textContent,
    )
    expect(ids).toEqual(['ord-newest', 'ord-middle', 'ord-oldest'])
  })

  it('shows the pending list and a QR per entry', async () => {
    seed(ORDERS)

    renderApp(['/history'])

    expect(await screen.findAllByTestId('receipt-qr')).toHaveLength(3)
    expect(
      screen.getAllByRole('link', { name: 'Ver comprobante' }),
    ).toHaveLength(3)
  })

  it('shows a Spanish empty state when there are no orders', async () => {
    seed([])

    renderApp(['/history'])

    expect(await screen.findByText(/todavía no tenés compras/i)).toBeInTheDocument()
  })

  it('reopens the original receipt from a history entry', async () => {
    const user = userEvent.setup()
    seed(ORDERS)

    renderApp(['/history'])

    const links = await screen.findAllByRole('link', {
      name: 'Ver comprobante',
    })
    await user.click(links[0])

    expect(
      await screen.findByRole('heading', { name: 'Gracias por tu compra' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('receipt-qr')).toHaveAttribute(
      'data-value',
      'ord-newest',
    )
  })

  it('asks for confirmation before clearing the demo data', async () => {
    const user = userEvent.setup()
    seed(ORDERS)

    renderApp(['/history'])

    await user.click(
      await screen.findByRole('button', { name: 'Borrar datos de demo' }),
    )

    // Nothing is cleared until the confirmation is accepted.
    expect(window.localStorage.getItem(StorageKeys.orders)).not.toBeNull()
    expect(
      screen.getByRole('button', { name: 'Sí, borrar todo' }),
    ).toBeInTheDocument()
  })

  it('clears every shopint key and signs the user out on reset', async () => {
    const user = userEvent.setup()
    seed(ORDERS)
    // An unrelated slice, to prove the reset clears ALL shopint keys.
    window.localStorage.setItem(StorageKeys.cart, JSON.stringify([]))
    window.localStorage.setItem('other-app:token', 'keep-me')

    renderApp(['/history'])

    await user.click(
      await screen.findByRole('button', { name: 'Borrar datos de demo' }),
    )
    await user.click(await screen.findByRole('button', { name: 'Sí, borrar todo' }))

    await waitFor(() => {
      const shopintKeys = Object.keys(window.localStorage).filter((key) =>
        key.startsWith('shopint:'),
      )
      expect(shopintKeys).toEqual([])
    })
    expect(window.localStorage.getItem('other-app:token')).toBe('keep-me')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'SMART SHOPINT' }),
    ).toBeInTheDocument()
  })
})
