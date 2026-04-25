import { ApiError } from '@/server/apiErrors'

type RateLimitOptions = {
  limit: number
  windowMs: number
}

type RateLimitEntry = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitEntry>()

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()

  return forwardedFor || request.headers.get('x-real-ip') || 'local'
}

function pruneExpiredEntries(now: number) {
  if (buckets.size < 500) {
    return
  }

  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

export function assertRateLimit(request: Request, bucket: string, options: RateLimitOptions) {
  const now = Date.now()
  const key = `${bucket}:${getClientIp(request)}`
  const current = buckets.get(key)

  pruneExpiredEntries(now)

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    })

    return
  }

  current.count += 1

  if (current.count > options.limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))

    throw new ApiError(
      'Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.',
      429,
      'RATE_LIMITED',
      {
        'Retry-After': String(retryAfterSeconds),
      },
    )
  }
}
