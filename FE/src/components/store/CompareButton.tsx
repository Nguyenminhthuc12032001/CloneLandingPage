'use client'

import { useStore } from '@/components/store/StoreProvider'

export function CompareButton({ slug }: { slug: string }) {
  const { isCompared, toggleCompare } = useStore()
  const active = isCompared(slug)

  return (
    <button
      type="button"
      className="button button--ghost"
      aria-pressed={active}
      aria-label={active ? 'Bỏ sản phẩm khỏi danh sách so sánh' : 'Thêm sản phẩm vào danh sách so sánh'}
      onClick={() => toggleCompare(slug)}
    >
      {active ? 'Bỏ so sánh' : 'So sánh'}
    </button>
  )
}
