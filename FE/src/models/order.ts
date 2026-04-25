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

export type OrderStatus = 'Đã nhận đơn' | 'Đang xác nhận' | 'Đang giao' | 'Đã giao' | 'Sẵn sàng cài đặt'

export interface CheckoutResult {
  orderNumber: string
  status: OrderStatus
  createdAt: string
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

export interface StoredOrder extends CheckoutResult {
  updatedAt: string
}

export interface AccountOrder {
  orderNumber: string
  status: OrderStatus
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
