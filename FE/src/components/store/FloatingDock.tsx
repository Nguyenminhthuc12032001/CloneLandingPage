'use client'

import Link from 'next/link'

import { useStore } from '@/components/store/StoreProvider'

export function FloatingDock() {
  const { cartCount, compareCount } = useStore()
  const items = [
    {
      href: '/compare',
      label: 'So sánh',
      count: compareCount,
      primary: cartCount === 0 && compareCount > 0,
    },
    {
      href: '/cart',
      label: 'Giỏ hàng',
      count: cartCount,
      primary: cartCount > 0,
    },
  ].filter((item) => item.count > 0)

  if (items.length === 0) {
    return null
  }

  return (
    <nav className="floating-dock" aria-label="Lối tắt hành động">
      {items.map((item) => (
        <Link
          href={item.href}
          className={`floating-dock__item ${item.primary ? 'floating-dock__item--primary' : ''}`}
          key={item.href}
          aria-label={`${item.label}: ${item.count} mục`}
        >
          <span>{item.label}</span>
          <strong>{item.count} mục</strong>
        </Link>
      ))}
    </nav>
  )
}
