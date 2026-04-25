import { CartClient } from '@/components/cart/CartClient'
import { getAllProducts } from '@/controllers/catalogController'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  return <CartClient products={await getAllProducts()} />
}
