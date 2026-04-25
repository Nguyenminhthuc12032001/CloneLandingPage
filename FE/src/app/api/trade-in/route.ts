import { estimateTradeIn } from '@/controllers/tradeInController'
import type { TradeInCondition, TradeInRequest } from '@/models/tradeIn'
import { ApiError } from '@/server/apiErrors'
import { errorJsonResponse, jsonResponse, parseJsonBody } from '@/server/http'
import { assertRateLimit } from '@/server/rateLimit'

const allowedConditions = new Set<TradeInCondition>(['like-new', 'great', 'good', 'fair'])

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateTradeInPayload(payload: unknown): TradeInRequest {
  const candidate = Boolean(payload) && typeof payload === 'object' && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : null

  const request = {
    brand: normalizeText(candidate?.brand),
    model: normalizeText(candidate?.model),
    storage: normalizeText(candidate?.storage),
    condition: normalizeText(candidate?.condition) as TradeInCondition,
    batteryHealth: typeof candidate?.batteryHealth === 'number' ? candidate.batteryHealth : Number(candidate?.batteryHealth),
  }

  if (!request.brand || !request.model || !request.storage || !request.condition) {
    throw new ApiError('Vui lòng cung cấp đầy đủ thông tin thu cũ bắt buộc.', 400)
  }

  if (!allowedConditions.has(request.condition)) {
    throw new ApiError('Tình trạng máy không hợp lệ.', 400)
  }

  if (!Number.isFinite(request.batteryHealth) || request.batteryHealth < 0 || request.batteryHealth > 100) {
    throw new ApiError('Sức khỏe pin phải nằm trong khoảng 0-100%.', 400)
  }

  return request
}

export async function POST(request: Request) {
  try {
    assertRateLimit(request, 'trade-in', { limit: 30, windowMs: 60_000 })

    const payload = validateTradeInPayload(await parseJsonBody<unknown>(request))

    return jsonResponse(await estimateTradeIn(payload))
  } catch (error) {
    return errorJsonResponse(error, request, 'api.trade-in')
  }
}
