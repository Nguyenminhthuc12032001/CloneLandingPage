import Link from 'next/link'

import { AppNavLink } from '@/components/layout/AppNavLink'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { navItems } from '@/components/layout/navigation'
import { HeaderActions } from '@/components/store/HeaderActions'

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand-lockup">
          <span className="brand-mark">Renewed.</span>
          <small className="brand-lockup__note">Máy cũ giá tốt</small>
        </Link>

        <nav className="site-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <AppNavLink
              href={item.href}
              key={item.href}
              className="site-nav__link"
              activeClassName="site-nav__link--active"
              exact={item.href === '/'}
            >
              {item.label}
            </AppNavLink>
          ))}
        </nav>

        <div className="site-header__cta">
          <span className="site-header__support">Kiểm định kỹ • Bảo hành 12 tháng</span>
          <Link href="/products" className="button button--ghost button--small">
            Xem điện thoại
          </Link>
          <HeaderActions />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
