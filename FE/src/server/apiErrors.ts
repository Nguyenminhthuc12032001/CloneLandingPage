export class ApiError extends Error {
  status: number
  code: string
  headers?: HeadersInit

  constructor(message: string, status = 400, code = 'BAD_REQUEST', headers?: HeadersInit) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.headers = headers
  }
}

export function getErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      headers: error.headers,
    }
  }

  if (error instanceof SyntaxError) {
    return {
      message: 'Dữ liệu JSON không hợp lệ.',
      status: 400,
      code: 'INVALID_JSON',
    }
  }

  if (error instanceof Error) {
    if (error.message === 'UNSUPPORTED_MEDIA_TYPE') {
      return {
        message: 'Content-Type phải là application/json.',
        status: 415,
        code: 'UNSUPPORTED_MEDIA_TYPE',
      }
    }

    if (error.message === 'PAYLOAD_TOO_LARGE') {
      return {
        message: 'Dữ liệu gửi lên quá lớn.',
        status: 413,
        code: 'PAYLOAD_TOO_LARGE',
      }
    }

    return {
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
    }
  }

  return {
    message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
    status: 500,
    code: 'INTERNAL_SERVER_ERROR',
  }
}
