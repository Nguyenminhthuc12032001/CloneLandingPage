'use client'

import Link from 'next/link'

import { useStore } from '@/components/store/StoreProvider'

interface HeaderActionsProps {
  onNavigate?: () => void
}

export function HeaderActions({ onNavigate }: HeaderActionsProps) {
  const { cartCount, compareCount } = useStore()

  return (
    <div className="header-actions">
      <Link
        href="/compare"
        className="header-chip"
        aria-label={`So sánh: ${compareCount} mục đang chọn`}
        onClick={onNavigate}
      >
        So sánh <span>{compareCount}</span>
      </Link>
      <Link
        href="/cart"
        className="header-chip header-chip--strong"
        aria-label={`Giỏ hàng: ${cartCount} sản phẩm`}
        onClick={onNavigate}
      >
        Giỏ hàng <span>{cartCount}</span>
      </Link>
    </div>
  )
}
