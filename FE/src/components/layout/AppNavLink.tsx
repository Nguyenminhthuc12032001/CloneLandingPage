'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface AppNavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  exact?: boolean
  onClick?: () => void
}

function buildClassName(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(' ')
}

export function AppNavLink({
  href,
  children,
  className,
  activeClassName,
  exact = false,
  onClick,
}: AppNavLinkProps) {
  const pathname = usePathname()
  const currentPath = pathname ?? ''
  const active =
    href === '/'
      ? currentPath === '/'
      : exact
        ? currentPath === href
        : currentPath === href || currentPath.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={buildClassName(className, active && activeClassName)}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
