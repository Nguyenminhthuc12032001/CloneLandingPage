'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

import type { CartLine } from '@/models/product'

interface StoreContextValue {
  cartLines: CartLine[]
  compareSlugs: string[]
  addToCart: (slug: string) => void
  setQuantity: (slug: string, quantity: number) => void
  removeFromCart: (slug: string) => void
  clearCart: () => void
  toggleCompare: (slug: string) => void
  isCompared: (slug: string) => boolean
  cartCount: number
  compareCount: number
}

const cartStorageKey = 'renewed-cart'
const compareStorageKey = 'renewed-compare'

const StoreContext = createContext<StoreContextValue | null>(null)

function parseStoredCart(rawValue: string | null) {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseStoredCompare(rawValue: string | null) {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as string[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartLines, setCartLines] = useState<CartLine[]>([])
  const [compareSlugs, setCompareSlugs] = useState<string[]>([])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setCartLines(parseStoredCart(window.localStorage.getItem(cartStorageKey)))
      setCompareSlugs(parseStoredCompare(window.localStorage.getItem(compareStorageKey)))
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(cartStorageKey, JSON.stringify(cartLines))
  }, [cartLines])

  useEffect(() => {
    window.localStorage.setItem(compareStorageKey, JSON.stringify(compareSlugs))
  }, [compareSlugs])

  const value = useMemo<StoreContextValue>(
    () => ({
      cartLines,
      compareSlugs,
      addToCart: (slug: string) => {
        setCartLines((current) => {
          const existing = current.find((line) => line.slug === slug)

          if (!existing) {
            return [...current, { slug, quantity: 1 }]
          }

          return current.map((line) =>
            line.slug === slug ? { ...line, quantity: Math.min(9, line.quantity + 1) } : line,
          )
        })
      },
      setQuantity: (slug: string, quantity: number) => {
        if (quantity <= 0) {
          setCartLines((current) => current.filter((line) => line.slug !== slug))
          return
        }

        setCartLines((current) =>
          current.map((line) => (line.slug === slug ? { ...line, quantity: Math.min(9, quantity) } : line)),
        )
      },
      removeFromCart: (slug: string) => {
        setCartLines((current) => current.filter((line) => line.slug !== slug))
      },
      clearCart: () => {
        setCartLines([])
      },
      toggleCompare: (slug: string) => {
        setCompareSlugs((current) => {
          if (current.includes(slug)) {
            return current.filter((item) => item !== slug)
          }

          return [...current.slice(-3), slug]
        })
      },
      isCompared: (slug: string) => compareSlugs.includes(slug),
      cartCount: cartLines.reduce((total, line) => total + line.quantity, 0),
      compareCount: compareSlugs.length,
    }),
    [cartLines, compareSlugs],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used inside StoreProvider')
  }

  return context
}
