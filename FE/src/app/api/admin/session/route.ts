import { assertAdminToken } from '@/server/adminAuth'
import {
  createAdminSessionCookieValue,
  getAdminSessionCookieName,
  getAdminSessionCookieOptions,
  getExpiredAdminSessionCookieOptions,
  verifyAdminSessionCookieValue,
} from '@/server/adminSession'
import { ApiError } from '@/server/apiErrors'
import { errorJsonResponse, jsonResponse, parseJsonBody } from '@/server/http'
import { assertRateLimit } from '@/server/rateLimit'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type LoginPayload = {
  token?: unknown
}

export async function GET(request: Request) {
  try {
    const cookie = request.headers
      .get('cookie')
      ?.split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${getAdminSessionCookieName()}=`))
    const sessionValue = cookie ? decodeURIComponent(cookie.slice(getAdminSessionCookieName().length + 1)) : ''

    return jsonResponse({ authenticated: await verifyAdminSessionCookieValue(sessionValue) })
  } catch (error) {
    return errorJsonResponse(error, request, 'api.admin.session.read')
  }
}

export async function POST(request: Request) {
  try {
    assertRateLimit(request, 'admin-login', { limit: 8, windowMs: 60_000 })

    const payload = await parseJsonBody<LoginPayload>(request)
    const token = typeof payload.token === 'string' ? payload.token.trim() : ''

    if (!token || !assertAdminToken(token)) {
      throw new ApiError('Thông tin đăng nhập admin không hợp lệ.', 401, 'INVALID_ADMIN_LOGIN')
    }

    const response = jsonResponse({ authenticated: true })
    response.cookies.set(
      getAdminSessionCookieName(),
      await createAdminSessionCookieValue(),
      getAdminSessionCookieOptions(),
    )

    return response
  } catch (error) {
    return errorJsonResponse(error, request, 'api.admin.session.create')
  }
}

export function DELETE() {
  const response = jsonResponse({ authenticated: false })
  response.cookies.set(getAdminSessionCookieName(), '', getExpiredAdminSessionCookieOptions())

  return response
}
