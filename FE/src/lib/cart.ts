import type { CartTotals } from '@/models/order'
import type { CartLine, EnrichedCartLine, PhoneProduct } from '@/models/product'

function normalizeQuantity(quantity: number) {
  return Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1
}

export function enrichCartLinesWithProducts(lines: CartLine[], products: PhoneProduct[]) {
  const productMap = new Map(products.map((product) => [product.slug, product]))

  return lines
    .map((line) => {
      const product = productMap.get(line.slug)

      if (!product) {
        return null
      }

      const quantity = normalizeQuantity(line.quantity)

      return {
        product,
        quantity,
        lineTotal: product.price * quantity,
      } satisfies EnrichedCartLine
    })
    .filter((line): line is EnrichedCartLine => Boolean(line))
}

export function calculateEnrichedCartTotals(enriched: EnrichedCartLine[]): CartTotals {
  const itemCount = enriched.reduce((total, line) => total + line.quantity, 0)
  const subtotal = enriched.reduce((total, line) => total + line.lineTotal, 0)
  const savings = enriched.reduce(
    (total, line) => total + (line.product.originalPrice - line.product.price) * line.quantity,
    0,
  )
  const shipping = itemCount === 0 || subtotal >= 18000000 ? 0 : 120000
  const setupFee = itemCount === 0 ? 0 : 49000

  return {
    itemCount,
    subtotal,
    savings,
    shipping,
    setupFee,
    total: subtotal + shipping + setupFee,
  }
}

export function calculateCartTotalsWithProducts(lines: CartLine[], products: PhoneProduct[]) {
  return calculateEnrichedCartTotals(enrichCartLinesWithProducts(lines, products))
}
