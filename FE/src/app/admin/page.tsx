import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getAllProducts } from '@/controllers/catalogController'
import { getAdminSessionCookieName, verifyAdminSessionCookieValue } from '@/server/adminSession'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAuthenticated = await verifyAdminSessionCookieValue(
    cookieStore.get(getAdminSessionCookieName())?.value,
  )

  if (!isAuthenticated) {
    redirect('/admin/login?next=/admin')
  }

  return <AdminDashboard products={await getAllProducts()} />
}
