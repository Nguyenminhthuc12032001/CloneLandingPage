import type { AccountOrder, CustomerProfile } from '@/models/order'

export const mockCustomer: CustomerProfile = {
  name: 'Tran Minh Hoang',
  email: 'hoang@renewed.vn',
  tier: 'Concierge Care',
  nextCheckIn: '18 Apr 2026',
  availableTradeInCredit: 3200000,
}

export const mockOrders: AccountOrder[] = [
  {
    orderNumber: 'RN-240318',
    status: 'Delivered',
    createdAt: '18 Mar 2026',
    total: 19389000,
    items: [{ slug: 'iphone-15-128-blue', name: 'iPhone 15', quantity: 1, price: 18990000 }],
  },
  {
    orderNumber: 'RN-240221',
    status: 'Shipping',
    createdAt: '21 Feb 2026',
    total: 15039000,
    items: [{ slug: 'iphone-13-pro-256-sierra-blue', name: 'iPhone 13 Pro', quantity: 1, price: 14990000 }],
  },
  {
    orderNumber: 'RN-240110',
    status: 'Ready for setup',
    createdAt: '10 Jan 2026',
    total: 17039000,
    items: [{ slug: 'pixel-8-pro-128-bay-blue', name: 'Pixel 8 Pro', quantity: 1, price: 16990000 }],
  },
]
