const encoder = new TextEncoder()
const sessionTtlMs = 8 * 60 * 60 * 1000
const cookieName = 'rms_admin_session'

type AdminSessionPayload = {
  sub: 'admin'
  exp: number
}

function getSessionSecret() {
  const configuredSecret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ORDER_ADMIN_TOKEN ?? process.env.ADMIN_API_TOKEN ?? ''

  if (configuredSecret || process.env.NODE_ENV === 'production') {
    return configuredSecret
  }

  return 'development-admin-session-secret'
}

function toBase64Url(value: string) {
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

function fromBase64Url(value: string) {
  const normalized = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  return atob(padded)
}

function bytesToBase64Url(bytes: ArrayBuffer) {
  const byteArray = new Uint8Array(bytes)
  let binary = ''

  byteArray.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return toBase64Url(binary)
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))

  return bytesToBase64Url(signature)
}

function safeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false
  }

  let mismatch = 0

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }

  return mismatch === 0
}

export function getAdminSessionCookieName() {
  return cookieName
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: Math.floor(sessionTtlMs / 1000),
  }
}

export function getExpiredAdminSessionCookieOptions() {
  return {
    ...getAdminSessionCookieOptions(),
    maxAge: 0,
  }
}

export async function createAdminSessionCookieValue() {
  const secret = getSessionSecret()

  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required.')
  }

  const payload: AdminSessionPayload = {
    sub: 'admin',
    exp: Date.now() + sessionTtlMs,
  }
  const encodedPayload = toBase64Url(JSON.stringify(payload))
  const signature = await sign(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

export async function verifyAdminSessionCookieValue(cookieValue: string | undefined | null) {
  const secret = getSessionSecret()

  if (!secret || !cookieValue) {
    return false
  }

  const [encodedPayload, signature, extra] = cookieValue.split('.')

  if (!encodedPayload || !signature || extra) {
    return false
  }

  const expectedSignature = await sign(encodedPayload, secret)

  if (!safeEqual(signature, expectedSignature)) {
    return false
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as Partial<AdminSessionPayload>

    return payload.sub === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}
