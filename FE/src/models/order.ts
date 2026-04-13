import type { CartLine } from '@/models/product'

export interface CheckoutCustomer {
  fullName: string
  email: string
  phone: string
  city: string
  address: string
  note?: string
}

export interface CheckoutPayload {
  lines: CartLine[]
  customer: CheckoutCustomer
}

export interface CartTotals {
  itemCount: number
  subtotal: number
  savings: number
  shipping: number
  setupFee: number
  total: number
}

export interface CheckoutResult {
  orderNumber: string
  eta: string
  totals: CartTotals
  customer: CheckoutCustomer
  items: Array<{
    slug: string
    name: string
    quantity: number
    price: number
  }>
}

export interface AccountOrder {
  orderNumber: string
  status: 'Delivered' | 'Shipping' | 'Ready for setup'
  createdAt: string
  total: number
  items: Array<{
    slug: string
    name: string
    quantity: number
    price: number
  }>
}

export interface CustomerProfile {
  name: string
  email: string
  tier: string
  nextCheckIn: string
  availableTradeInCredit: number
}
