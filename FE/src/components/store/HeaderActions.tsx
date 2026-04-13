'use client'

import Link from 'next/link'

import { useStore } from '@/components/store/StoreProvider'

export function HeaderActions() {
  const { cartCount, compareCount } = useStore()

  return (
    <div className="header-actions">
      <Link href="/compare" className="header-chip">
        Compare <span>{compareCount}</span>
      </Link>
      <Link href="/cart" className="header-chip header-chip--strong">
        Cart <span>{cartCount}</span>
      </Link>
    </div>
  )
}
