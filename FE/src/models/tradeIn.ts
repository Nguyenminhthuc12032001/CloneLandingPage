export type TradeInCondition = 'like-new' | 'great' | 'good' | 'fair'

export interface TradeInRequest {
  brand: string
  model: string
  storage: string
  condition: TradeInCondition
  batteryHealth: number
}

export interface TradeInEstimate {
  matchedModel: string
  baseValue: number
  conditionValue: number
  batteryBonus: number
  seasonalBonus: number
  estimatedValue: number
  summary: string
}
