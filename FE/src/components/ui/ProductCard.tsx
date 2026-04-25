import Link from 'next/link'

import { AddToCartButton } from '@/components/store/AddToCartButton'
import { CompareButton } from '@/components/store/CompareButton'
import { formatCurrency, formatRating } from '@/lib/format'
import type { PhoneProduct } from '@/models/product'

import { ProductVisual } from '@/components/ui/ProductVisual'

export function ProductCard({ product }: { product: PhoneProduct }) {
  const saving = product.originalPrice - product.price
  const keySignals = [product.storage, `${product.batteryHealth}% pin`, product.stockLabel]
  const summary = `Máy ${product.grade}, pin ${product.batteryHealth}%, ${product.stockLabel.toLowerCase()}.`

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__visual-column">
        <div className="product-card__visual">
          <ProductVisual product={product} compact />
        </div>

        <div className="product-card__visual-meta">
          <span>{product.badge}</span>
          <strong>{product.name}</strong>
          <small>
            {product.color} / {product.storage}
          </small>
        </div>
      </Link>

      <div className="product-card__content">
        <div className="product-card__topline">
          <span className="badge">{product.grade}</span>
          <span className="muted">
            {formatRating(product.rating)} / 5 · {product.reviewCount} đánh giá
          </span>
        </div>

        <div>
          <h3>{product.name}</h3>
          <p>{summary}</p>
        </div>

        <div className="product-card__specs">
          {keySignals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </div>

        <div className="product-card__decision">
          <div className="product-card__price">
            <strong>{formatCurrency(product.price)}</strong>
            <span>Giá tốt hơn máy mới {formatCurrency(saving)}</span>
            <small>Thu cũ tối đa {formatCurrency(product.maxTradeIn)}</small>
          </div>

          <div className="product-card__assurance">
            <span>{product.warranty}</span>
            <small>{product.finish}</small>
          </div>
        </div>

        <div className="product-card__footer">
          <Link href={`/products/${product.slug}`} className="text-link product-card__detail">
            Xem máy
          </Link>
        </div>

        <div className="product-card__actions">
          <AddToCartButton slug={product.slug} />
          <CompareButton slug={product.slug} />
        </div>
      </div>
    </article>
  )
}
