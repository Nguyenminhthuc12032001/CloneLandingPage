import { assertAdminRequest } from '@/server/adminAuth'
import { errorJsonResponse, jsonResponse } from '@/server/http'
import { listOrders } from '@/server/ordersRepository'
import { assertRateLimit } from '@/server/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    await assertAdminRequest(request)
    assertRateLimit(request, 'orders-admin', { limit: 60, windowMs: 60_000 })

    const orders = await listOrders()

    return jsonResponse({
      orders,
      meta: {
        total: orders.length,
      },
    })
  } catch (error) {
    return errorJsonResponse(error, request, 'api.orders.list')
  }
}
