'use client'

import { useStore } from '@/components/store/StoreProvider'

export function CompareButton({ slug }: { slug: string }) {
  const { isCompared, toggleCompare } = useStore()
  const active = isCompared(slug)

  return (
    <button type="button" className="button button--ghost" onClick={() => toggleCompare(slug)}>
      {active ? 'Remove compare' : 'Compare'}
    </button>
  )
}
