import { randomUUID } from 'node:crypto'

import { NextResponse } from 'next/server'

import { getErrorResponse } from '@/server/apiErrors'

const defaultApiHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
} as const

const maxJsonBodyBytes = 32 * 1024

type JsonResponseOptions = {
  status?: number
  headers?: HeadersInit
  cacheControl?: string
  requestId?: string
}

function createHeaders(options: JsonResponseOptions = {}) {
  const headers = new Headers(options.headers)

  for (const [key, value] of Object.entries(defaultApiHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value)
    }
  }

  if (options.cacheControl) {
    headers.set('Cache-Control', options.cacheControl)
  }

  if (options.requestId) {
    headers.set('X-Request-Id', options.requestId)
  }

  return headers
}

function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
    }
  }

  return { message: String(error) }
}

export function getRequestId(request: Request) {
  return request.headers.get('x-request-id') ?? randomUUID()
}

export function jsonResponse<T>(body: T, options: JsonResponseOptions = {}) {
  return NextResponse.json(body, {
    status: options.status ?? 200,
    headers: createHeaders(options),
  })
}

export function errorJsonResponse(error: unknown, request: Request, context: string) {
  const requestId = getRequestId(request)
  const response = getErrorResponse(error)

  if (response.status >= 500) {
    console.error(
      JSON.stringify({
        level: 'error',
        requestId,
        context,
        error: serializeError(error),
      }),
    )
  }

  return jsonResponse(
    {
      error: response.message,
      code: response.code,
      requestId,
    },
    {
      status: response.status,
      headers: response.headers,
      requestId,
    },
  )
}

export async function parseJsonBody<T>(request: Request, maxBytes = maxJsonBodyBytes): Promise<T> {
  const contentType = request.headers.get('content-type') ?? ''

  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('UNSUPPORTED_MEDIA_TYPE')
  }

  const contentLength = Number.parseInt(request.headers.get('content-length') ?? '0', 10)

  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new Error('PAYLOAD_TOO_LARGE')
  }

  const body = await request.text()

  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new Error('PAYLOAD_TOO_LARGE')
  }

  return JSON.parse(body) as T
}
