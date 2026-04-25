import type { NextRequest } from 'next/server'

import { filterProducts, parseCatalogFilters } from '@/controllers/catalogController'
import { errorJsonResponse, jsonResponse } from '@/server/http'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries())
    const filters = parseCatalogFilters(searchParams)
    const products = await filterProducts(filters)

    return jsonResponse(
      {
        products,
        filters,
        meta: {
          total: products.length,
        },
      },
      {
        cacheControl: 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400',
      },
    )
  } catch (error) {
    return errorJsonResponse(error, request, 'api.products.list')
  }
}
