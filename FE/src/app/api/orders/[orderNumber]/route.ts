import type { NextRequest } from 'next/server'

import { ApiError } from '@/server/apiErrors'
import { assertAdminRequest } from '@/server/adminAuth'
import { errorJsonResponse, jsonResponse, parseJsonBody } from '@/server/http'
import { findOrderByNumber, saveOrder } from '@/server/ordersRepository'
import { assertRateLimit } from '@/server/rateLimit'
import type { OrderStatus } from '@/models/order'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    await assertAdminRequest(request)
    assertRateLimit(request, 'orders-admin', { limit: 60, windowMs: 60_000 })

    const { orderNumber } = await context.params
    const order = await findOrderByNumber(orderNumber)

    if (!order) {
      throw new ApiError('Không tìm thấy đơn hàng.', 404, 'ORDER_NOT_FOUND')
    }

    return jsonResponse(order)
  } catch (error) {
    return errorJsonResponse(error, request, 'api.orders.detail')
  }
}

const allowedStatuses = new Set<OrderStatus>([
  'Đã nhận đơn',
  'Đang xác nhận',
  'Đang giao',
  'Đã giao',
  'Sẵn sàng cài đặt',
])

function readStatus(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ApiError('Dữ liệu cập nhật đơn hàng không hợp lệ.', 400, 'INVALID_ORDER_UPDATE')
  }

  const status = (value as { status?: unknown }).status

  if (typeof status !== 'string' || !allowedStatuses.has(status as OrderStatus)) {
    throw new ApiError('Trạng thái đơn hàng không hợp lệ.', 400, 'INVALID_ORDER_STATUS')
  }

  return status as OrderStatus
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ orderNumber: string }> }) {
  try {
    await assertAdminRequest(request)
    assertRateLimit(request, 'orders-admin-update', { limit: 40, windowMs: 60_000 })

    const { orderNumber } = await context.params
    const order = await findOrderByNumber(orderNumber)

    if (!order) {
      throw new ApiError('Không tìm thấy đơn hàng.', 404, 'ORDER_NOT_FOUND')
    }

    const status = readStatus(await parseJsonBody<unknown>(request))
    const updatedOrder = await saveOrder({
      ...order,
      status,
      updatedAt: new Date().toISOString(),
    })

    return jsonResponse(updatedOrder)
  } catch (error) {
    return errorJsonResponse(error, request, 'api.orders.update')
  }
}
