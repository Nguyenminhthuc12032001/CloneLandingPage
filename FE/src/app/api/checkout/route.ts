import { NextResponse } from 'next/server'

import { createCheckout } from '@/controllers/checkoutController'
import type { CheckoutPayload } from '@/models/order'

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutPayload

  try {
    const result = createCheckout(payload)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Checkout failed.' },
      { status: 400 },
    )
  }
}
