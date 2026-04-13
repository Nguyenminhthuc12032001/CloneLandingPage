import { getAllProducts } from '@/controllers/catalogController'
import type { TradeInEstimate, TradeInRequest } from '@/models/tradeIn'

const conditionMultipliers = {
  'like-new': 1,
  great: 0.88,
  good: 0.74,
  fair: 0.58,
} as const

export function estimateTradeIn(request: TradeInRequest): TradeInEstimate {
  const catalog = getAllProducts()
  const normalizedModel = request.model.toLowerCase().trim()
  const matched =
    catalog.find((product) => product.name.toLowerCase() === normalizedModel) ??
    catalog.find((product) => product.name.toLowerCase().includes(normalizedModel))

  const storageBonus = request.storage.includes('512') ? 1400000 : request.storage.includes('256') ? 800000 : 0
  const batteryBonus = request.batteryHealth >= 90 ? 700000 : request.batteryHealth >= 85 ? 300000 : 0
  const seasonalBonus = request.brand.toLowerCase() === 'apple' ? 500000 : 250000
  const baseValue = matched?.maxTradeIn ?? 5500000
  const conditionValue = Math.round(baseValue * conditionMultipliers[request.condition])
  const estimatedValue = conditionValue + storageBonus + batteryBonus + seasonalBonus

  return {
    matchedModel: matched?.name ?? request.model,
    baseValue,
    conditionValue,
    batteryBonus: batteryBonus + storageBonus,
    seasonalBonus,
    estimatedValue,
    summary:
      estimatedValue >= 12000000
        ? 'High-value trade in with premium upgrade potential.'
        : 'Solid credit estimate for reducing checkout total on your next device.',
  }
}
