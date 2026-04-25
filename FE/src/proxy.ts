import { NextResponse, type NextRequest } from 'next/server'

import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/server/adminSession'

export async function proxy(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (!isAdminPage || isLoginPage) {
    return NextResponse.next()
  }

  const isAuthenticated = await verifyAdminSessionCookieValue(
    request.cookies.get(getAdminSessionCookieName())?.value,
  )

  if (isAuthenticated) {
    return NextResponse.next()
  }

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = '/admin/login'
  loginUrl.searchParams.set('next', request.nextUrl.pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*'],
}
