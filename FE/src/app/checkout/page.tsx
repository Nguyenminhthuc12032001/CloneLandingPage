import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { getAllProducts } from '@/controllers/catalogController'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  return <CheckoutClient products={await getAllProducts()} />
}
