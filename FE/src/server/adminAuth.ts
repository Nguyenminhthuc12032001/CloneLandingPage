import { timingSafeEqual } from 'node:crypto'

import { ApiError } from '@/server/apiErrors'
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/server/adminSession'

function getConfiguredAdminToken() {
  return process.env.ORDER_ADMIN_TOKEN ?? process.env.ADMIN_API_TOKEN ?? ''
}

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  if (leftBuffer.length !== rightBuffer.length) {
    return false
  }

  return timingSafeEqual(leftBuffer, rightBuffer)
}

export function assertAdminToken(token: string) {
  const configuredToken = getConfiguredAdminToken()

  if (!configuredToken) {
    if (process.env.NODE_ENV === 'production') {
      throw new ApiError('Admin token chưa được cấu hình.', 503, 'ADMIN_TOKEN_NOT_CONFIGURED')
    }

    return token.trim().length > 0
  }

  return safeCompare(token, configuredToken)
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`))

  return match ? decodeURIComponent(match.slice(name.length + 1)) : ''
}

export async function assertAdminRequest(request: Request) {
  const authorization = request.headers.get('authorization') ?? ''
  const bearerToken = authorization.toLowerCase().startsWith('bearer ') ? authorization.slice(7).trim() : ''
  const headerToken = request.headers.get('x-admin-token') ?? ''
  const token = bearerToken || headerToken

  if (token && assertAdminToken(token)) {
    return
  }

  const sessionCookie = readCookie(request, getAdminSessionCookieName())

  if (await verifyAdminSessionCookieValue(sessionCookie)) {
    return
  }

  throw new ApiError('Bạn không có quyền truy cập tài nguyên này.', 401, 'UNAUTHORIZED', {
    'WWW-Authenticate': 'Bearer',
  })
}
