import { calculateCartTotals, enrichCartLines } from '@/controllers/cartController'
import type { CheckoutPayload, CheckoutResult } from '@/models/order'

export function createCheckout(payload: CheckoutPayload): CheckoutResult {
  const customer = payload.customer

  if (!customer.fullName || !customer.email || !customer.phone || !customer.city || !customer.address) {
    throw new Error('Please complete all required customer fields before checkout.')
  }

  const items = enrichCartLines(payload.lines)

  if (items.length === 0) {
    throw new Error('Cart is empty.')
  }

  const totals = calculateCartTotals(payload.lines)

  return {
    orderNumber: `RN-${Date.now().toString().slice(-6)}`,
    eta: 'Delivery within 2-4 business days',
    totals,
    customer,
    items: items.map((line) => ({
      slug: line.product.slug,
      name: line.product.name,
      quantity: line.quantity,
      price: line.product.price,
    })),
  }
}
