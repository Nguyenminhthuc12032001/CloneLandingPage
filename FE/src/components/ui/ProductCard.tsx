import Link from 'next/link'

import { CompareButton } from '@/components/store/CompareButton'
import { AddToCartButton } from '@/components/store/AddToCartButton'
import { ProductVisual } from '@/components/ui/ProductVisual'
import { formatCurrency, formatRating } from '@/lib/format'
import type { PhoneProduct } from '@/models/product'

export function ProductCard({ product }: { product: PhoneProduct }) {
  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__visual">
        <ProductVisual product={product} compact />
      </Link>

      <div className="product-card__content">
        <div className="product-card__topline">
          <span className="badge">{product.badge}</span>
          <span className="muted">
            {product.grade} / {formatRating(product.rating)}
          </span>
        </div>

        <div>
          <h3>{product.name}</h3>
          <p>{product.shortDescription}</p>
        </div>

        <div className="product-card__specs">
          <span>{product.storage}</span>
          <span>{product.batteryHealth}% battery</span>
          <span>{product.stockLabel}</span>
        </div>

        <div className="product-card__price">
          <strong>{formatCurrency(product.price)}</strong>
          <span>Was {formatCurrency(product.originalPrice)}</span>
        </div>

        <div className="product-card__actions">
          <AddToCartButton slug={product.slug} />
          <CompareButton slug={product.slug} />
        </div>
      </div>
    </article>
  )
}
