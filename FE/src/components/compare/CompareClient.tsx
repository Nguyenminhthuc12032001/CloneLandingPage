'use client'

import Link from 'next/link'

import { CompareButton } from '@/components/store/CompareButton'
import { ProductVisual } from '@/components/ui/ProductVisual'
import { formatCurrency } from '@/lib/format'
import type { PhoneProduct } from '@/models/product'
import { useStore } from '@/components/store/StoreProvider'

export function CompareClient({ products }: { products: PhoneProduct[] }) {
  const { compareSlugs } = useStore()
  const comparedProducts = products.filter((product) => compareSlugs.includes(product.slug))
  const compareMetrics: Array<{ label: string; getValue: (product: PhoneProduct) => string }> = [
    { label: 'Price', getValue: (product) => formatCurrency(product.price) },
    { label: 'Grade', getValue: (product) => product.grade },
    { label: 'Battery', getValue: (product) => `${product.batteryHealth}%` },
    { label: 'Display', getValue: (product) => product.display },
    { label: 'Chip', getValue: (product) => product.chipset },
    { label: 'Camera', getValue: (product) => product.camera },
    { label: 'Warranty', getValue: (product) => product.warranty },
  ]

  if (comparedProducts.length === 0) {
    return (
      <section className="empty-state shell">
        <h1>Build your comparison board.</h1>
        <p>Select up to four devices from the catalog and compare price, battery, camera, and value in one place.</p>
        <Link href="/products" className="button button--primary">
          Explore catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="shell compare-layout">
      <div className="compare-grid">
        {comparedProducts.map((product) => (
          <article className="compare-card" key={product.slug}>
            <ProductVisual product={product} compact />
            <div className="compare-card__content">
              <span className="badge">{product.badge}</span>
              <h2>{product.name}</h2>
              <p>{product.shortDescription}</p>
              <strong>{formatCurrency(product.price)}</strong>
              <CompareButton slug={product.slug} />
            </div>
          </article>
        ))}
      </div>

      <div className="compare-table">
        <div className="compare-table__row compare-table__row--label">
          <span>Metric</span>
          {comparedProducts.map((product) => (
            <span key={product.slug}>{product.name}</span>
          ))}
        </div>
        {compareMetrics.map(({ label, getValue }) => (
          <div className="compare-table__row" key={label}>
            <span>{label}</span>
            {comparedProducts.map((product) => (
              <span key={`${product.slug}-${label}`}>{getValue(product)}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
