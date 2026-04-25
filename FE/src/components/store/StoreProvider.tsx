'use client'

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
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
const storeChangeEvent = 'renewed-store-change'
const emptyCartSnapshot: CartLine[] = []
const emptyCompareSnapshot: string[] = []

let cartSnapshotKey: string | null | undefined
let compareSnapshotKey: string | null | undefined
let cartSnapshotCache: CartLine[] = emptyCartSnapshot
let compareSnapshotCache: string[] = emptyCompareSnapshot

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

function subscribeStore(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const listener = () => callback()

  window.addEventListener('storage', listener)
  window.addEventListener(storeChangeEvent, listener)

  return () => {
    window.removeEventListener('storage', listener)
    window.removeEventListener(storeChangeEvent, listener)
  }
}

function readCartSnapshot() {
  if (typeof window === 'undefined') {
    return emptyCartSnapshot
  }

  const rawValue = window.localStorage.getItem(cartStorageKey)

  if (rawValue === cartSnapshotKey) {
    return cartSnapshotCache
  }

  cartSnapshotKey = rawValue
  cartSnapshotCache = parseStoredCart(rawValue)

  return cartSnapshotCache
}

function readCompareSnapshot() {
  if (typeof window === 'undefined') {
    return emptyCompareSnapshot
  }

  const rawValue = window.localStorage.getItem(compareStorageKey)

  if (rawValue === compareSnapshotKey) {
    return compareSnapshotCache
  }

  compareSnapshotKey = rawValue
  compareSnapshotCache = parseStoredCompare(rawValue)

  return compareSnapshotCache
}

function emitStoreChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(storeChangeEvent))
  }
}

function writeCartLines(lines: CartLine[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(cartStorageKey, JSON.stringify(lines))
  emitStoreChange()
}

function writeCompareSlugs(slugs: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(compareStorageKey, JSON.stringify(slugs))
  emitStoreChange()
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const cartLines = useSyncExternalStore(subscribeStore, readCartSnapshot, () => emptyCartSnapshot)
  const compareSlugs = useSyncExternalStore(subscribeStore, readCompareSnapshot, () => emptyCompareSnapshot)

  const value = useMemo<StoreContextValue>(
    () => ({
      cartLines,
      compareSlugs,
      addToCart: (slug: string) => {
        const current = readCartSnapshot()
        const existing = current.find((line) => line.slug === slug)

        if (!existing) {
          writeCartLines([...current, { slug, quantity: 1 }])
          return
        }

        writeCartLines(
          current.map((line) =>
            line.slug === slug ? { ...line, quantity: Math.min(9, line.quantity + 1) } : line,
          ),
        )
      },
      setQuantity: (slug: string, quantity: number) => {
        const current = readCartSnapshot()

        if (quantity <= 0) {
          writeCartLines(current.filter((line) => line.slug !== slug))
          return
        }

        writeCartLines(
          current.map((line) => (line.slug === slug ? { ...line, quantity: Math.min(9, quantity) } : line)),
        )
      },
      removeFromCart: (slug: string) => {
        writeCartLines(readCartSnapshot().filter((line) => line.slug !== slug))
      },
      clearCart: () => {
        writeCartLines([])
      },
      toggleCompare: (slug: string) => {
        const current = readCompareSnapshot()

        if (current.includes(slug)) {
          writeCompareSlugs(current.filter((item) => item !== slug))
          return
        }

        writeCompareSlugs([...current.slice(-3), slug])
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
