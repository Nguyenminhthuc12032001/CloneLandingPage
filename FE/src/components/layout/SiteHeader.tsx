import Link from 'next/link'

import { HeaderActions } from '@/components/store/HeaderActions'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Catalog' },
  { href: '/compare', label: 'Compare' },
  { href: '/trade-in', label: 'Trade-in' },
  { href: '/account', label: 'Account' },
]

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand-mark">
          Renewed.
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__cta">
          <Link href="/products" className="button button--ghost button--small">
            Shop now
          </Link>
          <HeaderActions />
        </div>
      </div>
    </header>
  )
}
