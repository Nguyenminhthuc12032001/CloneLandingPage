import { randomBytes } from 'node:crypto'

import { enrichCartLines } from '@/controllers/cartController'
import { calculateEnrichedCartTotals } from '@/lib/cart'
import type { CheckoutCustomer, CheckoutResult } from '@/models/order'
import type { CartLine } from '@/models/product'
import { ApiError } from '@/server/apiErrors'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[0-9+\s().-]{8,20}$/
const maxCartLines = 20
const maxQuantityPerProduct = 5

function normalizeText(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function assertMaxLength(label: string, value: string | undefined, limit: number) {
  if (value && value.length > limit) {
    throw new ApiError(`${label} không được vượt quá ${limit} ký tự.`, 400, 'FIELD_TOO_LONG')
  }
}

function normalizeCustomer(customer: unknown): CheckoutCustomer {
  if (!isRecord(customer)) {
    throw new ApiError('Vui lòng điền thông tin nhận hàng.', 400)
  }

  const normalized = {
    fullName: normalizeText(customer.fullName),
    email: normalizeText(customer.email).toLowerCase(),
    phone: normalizeText(customer.phone),
    city: normalizeText(customer.city),
    address: normalizeText(customer.address),
    note: normalizeText(customer.note) || undefined,
  }

  if (!normalized.fullName || !normalized.email || !normalized.phone || !normalized.city || !normalized.address) {
    throw new ApiError('Vui lòng điền đầy đủ các trường bắt buộc trước khi thanh toán.', 400)
  }

  assertMaxLength('Họ và tên', normalized.fullName, 80)
  assertMaxLength('Email', normalized.email, 120)
  assertMaxLength('Số điện thoại', normalized.phone, 20)
  assertMaxLength('Thành phố', normalized.city, 80)
  assertMaxLength('Địa chỉ', normalized.address, 180)
  assertMaxLength('Ghi chú', normalized.note, 500)

  if (!emailPattern.test(normalized.email)) {
    throw new ApiError('Email nhận hàng chưa đúng định dạng.', 400)
  }

  if (!phonePattern.test(normalized.phone)) {
    throw new ApiError('Số điện thoại nhận hàng chưa đúng định dạng.', 400)
  }

  return normalized
}

function normalizeQuantity(quantity: unknown) {
  if (typeof quantity !== 'number' || !Number.isFinite(quantity)) {
    throw new ApiError('Số lượng sản phẩm không hợp lệ.', 400, 'INVALID_QUANTITY')
  }

  const normalized = Math.floor(quantity)

  if (normalized < 1 || normalized > maxQuantityPerProduct) {
    throw new ApiError(`Mỗi sản phẩm chỉ được đặt từ 1 đến ${maxQuantityPerProduct} máy.`, 400, 'INVALID_QUANTITY')
  }

  return normalized
}

function normalizeLines(lines: unknown): CartLine[] {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new ApiError('Giỏ hàng đang trống.', 400)
  }

  if (lines.length > maxCartLines) {
    throw new ApiError(`Giỏ hàng không được vượt quá ${maxCartLines} dòng sản phẩm.`, 400, 'TOO_MANY_CART_LINES')
  }

  const quantitiesBySlug = new Map<string, number>()

  for (const line of lines) {
    if (!isRecord(line)) {
      continue
    }

    const slug = normalizeText(line.slug)
    const quantity = normalizeQuantity(line.quantity)

    if (slug) {
      const nextQuantity = (quantitiesBySlug.get(slug) ?? 0) + quantity

      if (nextQuantity > maxQuantityPerProduct) {
        throw new ApiError(`Mỗi sản phẩm chỉ được đặt tối đa ${maxQuantityPerProduct} máy.`, 400, 'INVALID_QUANTITY')
      }

      quantitiesBySlug.set(slug, nextQuantity)
    }
  }

  if (quantitiesBySlug.size === 0) {
    throw new ApiError('Giỏ hàng đang trống.', 400)
  }

  return Array.from(quantitiesBySlug, ([slug, quantity]) => ({ slug, quantity }))
}

function createOrderNumber() {
  const dateSegment = new Date().toISOString().slice(2, 10).replaceAll('-', '')
  const randomSegment = randomBytes(3).toString('hex').toUpperCase()

  return `RN-${dateSegment}-${randomSegment}`
}

export async function createCheckout(payload: unknown): Promise<CheckoutResult> {
  if (!isRecord(payload)) {
    throw new ApiError('Dữ liệu thanh toán không hợp lệ.', 400)
  }

  const customer = normalizeCustomer(payload.customer)
  const lines = normalizeLines(payload.lines)
  const items = await enrichCartLines(lines)

  if (items.length === 0) {
    throw new ApiError('Không tìm thấy sản phẩm hợp lệ trong giỏ hàng.', 400)
  }

  if (items.length !== lines.length) {
    throw new ApiError('Giỏ hàng có sản phẩm không còn hợp lệ.', 400, 'INVALID_CART_ITEM')
  }

  const totals = calculateEnrichedCartTotals(items)
  const createdAt = new Date().toISOString()

  return {
    orderNumber: createOrderNumber(),
    status: 'Đã nhận đơn',
    createdAt,
    eta: 'Giao hàng trong 2-4 ngày làm việc',
    totals,
    customer,
    items: items.map((line) => ({
      slug: line.product.slug,
      name: line.product.name,
      quantity: line.quantity,
      price: line.product.price,
    })),
  }
}
