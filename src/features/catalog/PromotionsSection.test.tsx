import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import type { Promotion } from '../../data/promotions'
import type { Product } from '../../data/types'
import type { RecommendedPromotion } from '../../lib/recommendations'
import { PromotionsSection } from './PromotionsSection'

const product: Product = {
  sku: 'SKU-0001',
  name: 'Leche Gloria Entera 400g',
  categoryId: 'cat-dairy',
  storeId: 'md-tottus',
  price: 4.9,
  currency: 'PEN',
  expiryDate: '2027-03-15',
}

const promotion: Promotion = {
  sku: 'SKU-0001',
  discountPercent: 20,
  label: 'Oferta en lácteos',
}

const item: RecommendedPromotion = {
  product,
  promotion,
  price: 3.92,
}

describe('PromotionsSection', () => {
  it('renders nothing when there are no offers', () => {
    const { container } = render(
      <PromotionsSection items={[]} onAdd={vi.fn()} />,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('shows the heading, the old price and the discounted price', () => {
    render(<PromotionsSection items={[item]} onAdd={vi.fn()} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'Promociones para vos' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Leche Gloria Entera 400g')).toBeInTheDocument()
    expect(screen.getByText('S/ 4.90')).toHaveClass('line-through')
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByText('S/ 3.92')).toBeInTheDocument()
    expect(screen.getByText('Oferta en lácteos')).toBeInTheDocument()
  })

  it('adds the promoted product with its discounted price', async () => {
    const user = userEvent.setup()
    const onAdd = vi.fn()
    render(<PromotionsSection items={[item]} onAdd={onAdd} />)

    await user.click(
      screen.getByRole('button', {
        name: 'Agregar Leche Gloria Entera 400g en promoción',
      }),
    )

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd).toHaveBeenCalledWith(item)
    expect(onAdd.mock.calls[0][0].price).toBe(3.92)
  })
})
