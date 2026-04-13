import { CompareClient } from '@/components/compare/CompareClient'
import { getAllProducts } from '@/controllers/catalogController'

export default function ComparePage() {
  return <CompareClient products={getAllProducts()} />
}
