import type { Metadata } from 'next'

import { AdminLogin } from '@/components/admin/AdminLogin'

export const metadata: Metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
}

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>

function readFirst(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
}

export default async function AdminLoginPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams
  const nextParam = readFirst(resolvedSearchParams.next)
  const nextPath = nextParam.startsWith('/admin') && nextParam !== '/admin/login' ? nextParam : '/admin'

  return <AdminLogin nextPath={nextPath} />
}
