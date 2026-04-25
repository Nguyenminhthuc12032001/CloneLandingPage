'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { AppNavLink } from '@/components/layout/AppNavLink'
import { navItems } from '@/components/layout/navigation'
import { HeaderActions } from '@/components/store/HeaderActions'

export function MobileMenu() {
  const pathname = usePathname() ?? ''
  const [openAtPath, setOpenAtPath] = useState<string | null>(null)
  const open = openAtPath === pathname
  const navigationId = useId()
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpenAtPath(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenAtPath(null)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`} ref={menuRef}>
      <button
        type="button"
        className="mobile-menu__trigger"
        aria-expanded={open}
        aria-controls={navigationId}
        aria-haspopup="dialog"
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        onClick={() => setOpenAtPath((current) => (current === pathname ? null : pathname))}
      >
        <span />
        <span />
        <span className="sr-only">{open ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}</span>
      </button>

      {open ? (
        <button type="button" className="mobile-menu__backdrop" aria-label="Đóng menu" onClick={() => setOpenAtPath(null)} />
      ) : null}

      {open ? (
        <div className="mobile-menu__panel panel" id={navigationId} role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          <div className="mobile-menu__header">
            <div>
              <strong>Điều hướng</strong>
              <p className="mobile-menu__note">Chuyển trang nhanh mà không che mất ngữ cảnh đang xem.</p>
            </div>
            <button type="button" className="mobile-menu__close" onClick={() => setOpenAtPath(null)}>
              Đóng
            </button>
          </div>

          <nav className="mobile-menu__nav" aria-label="Điều hướng di động">
            {navItems.map((item) => (
              <AppNavLink
                href={item.href}
                key={item.href}
                className="mobile-menu__link"
                activeClassName="mobile-menu__link--active"
                exact={item.href === '/'}
                onClick={() => setOpenAtPath(null)}
              >
                {item.label}
              </AppNavLink>
            ))}
          </nav>

          <div className="mobile-menu__actions">
            <Link href="/products" className="button button--primary button--wide" onClick={() => setOpenAtPath(null)}>
              Xem điện thoại
            </Link>
            <HeaderActions onNavigate={() => setOpenAtPath(null)} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
