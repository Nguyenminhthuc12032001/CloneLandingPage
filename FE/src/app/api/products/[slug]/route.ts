import type { NextRequest } from 'next/server'

import { getProductBySlug } from '@/controllers/catalogController'
import { ApiError } from '@/server/apiErrors'
import { errorJsonResponse, jsonResponse } from '@/server/http'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params
    const product = await getProductBySlug(slug)

    if (!product) {
      throw new ApiError('Không tìm thấy sản phẩm.', 404, 'PRODUCT_NOT_FOUND')
    }

    return jsonResponse(product, {
      cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
    })
  } catch (error) {
    return errorJsonResponse(error, request, 'api.products.detail')
  }
}
