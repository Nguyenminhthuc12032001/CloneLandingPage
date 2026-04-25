'use client'

import { useEffect, useState } from 'react'

import { useStore } from '@/components/store/StoreProvider'

interface AddToCartButtonProps {
  slug: string
  wide?: boolean
}

export function AddToCartButton({ slug, wide = false }: AddToCartButtonProps) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!added) {
      return
    }

    const timer = window.setTimeout(() => setAdded(false), 1400)
    return () => window.clearTimeout(timer)
  }, [added])

  return (
    <button
      type="button"
      className={`button button--primary ${wide ? 'button--wide' : ''}`}
      onClick={() => {
        addToCart(slug)
        setAdded(true)
      }}
    >
      {added ? 'Đã thêm vào giỏ' : 'Chọn mua'}
    </button>
  )
}
