import { getFeaturedProducts } from '@/controllers/catalogController'
import { mockCustomer, mockOrders } from '@/models/account'

export function getAccountDashboard() {
  return {
    customer: mockCustomer,
    orders: mockOrders,
    savedRecommendations: getFeaturedProducts(3),
    benefits: [
      'Priority support for setup and activation.',
      'Battery health re-check on selected premium orders.',
      'Trade-in boost eligibility on your next upgrade.',
    ],
  }
}
