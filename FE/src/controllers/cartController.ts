import { getProductsBySlugs } from '@/controllers/catalogController'
import { calculateEnrichedCartTotals, enrichCartLinesWithProducts } from '@/lib/cart'
import type { CartLine } from '@/models/product'

export async function enrichCartLines(lines: CartLine[]) {
  return enrichCartLinesWithProducts(lines, await getProductsBySlugs(lines.map((line) => line.slug)))
}

export async function calculateCartTotals(lines: CartLine[]) {
  return calculateEnrichedCartTotals(await enrichCartLines(lines))
}
