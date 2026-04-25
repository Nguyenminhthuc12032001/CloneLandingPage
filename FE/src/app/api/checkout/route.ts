import { createCheckout } from '@/controllers/checkoutController'
import { errorJsonResponse, jsonResponse, parseJsonBody } from '@/server/http'
import { saveOrder } from '@/server/ordersRepository'
import { assertRateLimit } from '@/server/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    assertRateLimit(request, 'checkout', { limit: 10, windowMs: 60_000 })

    const payload = await parseJsonBody<unknown>(request)
    const result = await saveOrder({
      ...(await createCheckout(payload)),
      updatedAt: new Date().toISOString(),
    })

    return jsonResponse(result, { status: 201 })
  } catch (error) {
    return errorJsonResponse(error, request, 'api.checkout')
  }
}
