import type { CSSProperties } from 'react'

import type { PhoneProduct } from '@/models/product'

interface ProductVisualProps {
  product: PhoneProduct
  compact?: boolean
}

export function ProductVisual({ product, compact = false }: ProductVisualProps) {
  return (
    <div
      className={`device-visual ${compact ? 'device-visual--compact' : ''}`}
      style={{ '--device-gradient': product.gradient } as CSSProperties}
    >
      <div className="device-visual__shell">
        <div className="device-visual__camera">
          <span />
          <span />
          <span />
        </div>
        <div className="device-visual__screen">
          <span>{product.badge}</span>
          <strong>{product.name}</strong>
          <small>
            {product.storage} / {product.color}
          </small>
        </div>
      </div>
    </div>
  )
}
