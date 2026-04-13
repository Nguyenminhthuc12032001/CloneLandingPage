import { NextResponse } from 'next/server'

import { getAllProducts } from '@/controllers/catalogController'

export function GET() {
  return NextResponse.json(getAllProducts())
}
