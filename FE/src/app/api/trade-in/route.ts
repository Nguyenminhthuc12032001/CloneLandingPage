import { NextResponse } from 'next/server'

import { estimateTradeIn } from '@/controllers/tradeInController'
import type { TradeInRequest } from '@/models/tradeIn'

export async function POST(request: Request) {
  const payload = (await request.json()) as TradeInRequest

  if (!payload.brand || !payload.model || !payload.storage || !payload.condition) {
    return NextResponse.json({ error: 'Please provide the required trade-in details.' }, { status: 400 })
  }

  return NextResponse.json(estimateTradeIn(payload))
}
