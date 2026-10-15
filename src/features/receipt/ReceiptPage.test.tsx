import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Order } from '../../data/types'
import { StorageKeys } from '../../lib/storage'
import { renderApp } from '../../test/renderApp'

// The receipt QR contract is the `value` prop itself, so the mock exposes it as
// an attribute and the test asserts the exact payload the page passes down.
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

const ORDER: Order = {
  id: 'ord-test-1',
  lines: [
    { sku: 'SKU-0001', storeId: 'md-tottus', qty: 3, unitPrice: 4.9 },
    { sku: 'SKU-0002', storeId: 'md-tottus', qty: 1, unitPrice: 5.2 },
  ],
  total: 19.9,
  paymentMethod: 'yape',
  createdAt: '2026-10-12T12:00:00.000Z',
}

function seed() {
  window.localStorage.setItem(
    StorageKeys.auth,
    JSON.stringify({ accounts: [STORED_USER], currentUser: STORED_USER }),
  )
  window.localStorage.setItem(StorageKeys.orders, JSON.stringify([ORDER]))
}

describe('ReceiptPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('lists the order id, items, total and method', async () => {
    seed()

    renderApp([`/receipt/${ORDER.id}`])

    expect(
      await screen.findByRole('heading', { name: 'Gracias por tu compra' }),
    ).toBeInTheDocument()
    expect(screen.getByText(ORDER.id)).toBeInTheDocument()
    expect(screen.getByText('Leche Gloria Entera 400g')).toBeInTheDocument()
    expect(screen.getByText('Arroz Costeño Extra 1kg')).toBeInTheDocument()
    expect(screen.getByText('S/ 14.70')).toBeInTheDocument()
    expect(screen.getByText('S/ 19.90')).toBeInTheDocument()
    expect(screen.getByText(/Yape/)).toBeInTheDocument()
  })

  it('encodes exactly the order id in the receipt QR', async () => {
    seed()

    renderApp([`/receipt/${ORDER.id}`])

    expect(await screen.findByTestId('receipt-qr')).toHaveAttribute(
      'data-value',
      ORDER.id,
    )
  })

  it('shows an explicit Spanish state for an unknown order id', async () => {
    seed()

    renderApp(['/receipt/ord-does-not-exist'])

    expect(
      await screen.findByRole('heading', {
        name: 'Comprobante no encontrado',
      }),
    ).toBeInTheDocument()
    expect(screen.queryByTestId('receipt-qr')).toBeNull()
  })

  it('triggers window.print from the print button', async () => {
    const user = userEvent.setup()
    seed()
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    renderApp([`/receipt/${ORDER.id}`])

    await user.click(
      await screen.findByRole('button', { name: 'Imprimir comprobante' }),
    )

    expect(printSpy).toHaveBeenCalledTimes(1)
    printSpy.mockRestore()
  })
})
