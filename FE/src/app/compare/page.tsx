import { CompareClient } from '@/components/compare/CompareClient'
import { getAllProducts } from '@/controllers/catalogController'

export const dynamic = 'force-dynamic'

export default async function ComparePage() {
  return <CompareClient products={await getAllProducts()} />
}
