import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AddToCartButton } from '@/components/store/AddToCartButton'
import { CompareButton } from '@/components/store/CompareButton'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductVisual } from '@/components/ui/ProductVisual'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getProductBySlug, getRelatedProducts } from '@/controllers/catalogController'
import { formatCurrency } from '@/lib/format'

type Params = { slug: string } | Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Device not found | Renewed Mobile Store',
    }
  }

  return {
    title: `${product.name} ${product.storage} | Renewed Mobile Store`,
    description: product.shortDescription,
  }
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const resolvedParams = await params
  const product = getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.slug)

  return (
    <section className="shell page-shell">
      <div className="breadcrumb-row">
        <Link href="/products">Catalog</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="detail-hero">
        <div className="detail-hero__visual">
          <ProductVisual product={product} />
        </div>

        <div className="detail-hero__copy">
          <span className="section-heading__eyebrow">{product.badge}</span>
          <h1>{product.name}</h1>
          <p>{product.longDescription}</p>

          <div className="detail-price">
            <strong>{formatCurrency(product.price)}</strong>
            <span>Launch price {formatCurrency(product.originalPrice)}</span>
            <small>From {formatCurrency(product.monthlyPrice)} / month in financing-ready UI copy.</small>
          </div>

          <div className="detail-stats">
            <div>
              <span>Grade</span>
              <strong>{product.grade}</strong>
            </div>
            <div>
              <span>Battery</span>
              <strong>{product.batteryHealth}%</strong>
            </div>
            <div>
              <span>Warranty</span>
              <strong>{product.warranty}</strong>
            </div>
          </div>

          <div className="detail-actions">
            <AddToCartButton slug={product.slug} wide />
            <CompareButton slug={product.slug} />
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <article className="panel detail-panel">
          <span className="section-heading__eyebrow">Highlights</span>
          <h2>Why this device works in a premium refurbished catalog.</h2>
          <ul className="bullet-list">
            {product.highlightBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>

        <article className="panel detail-panel">
          <span className="section-heading__eyebrow">What is in the box</span>
          <h2>Accessories and trust signals.</h2>
          <ul className="bullet-list">
            {product.accessories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="panel specs-panel">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Specs</span>
          <h2>Technical story told in a cleaner, high-confidence way.</h2>
          <p>These are the details customers care about when they are comparing premium used devices.</p>
        </div>

        <div className="spec-grid">
          {product.specs.map((spec) => (
            <div className="spec-card" key={spec.label}>
              <span>{spec.label}</span>
              <strong>{spec.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space section-space--last">
        <SectionHeading
          eyebrow="Related picks"
          title="Cross-sell products that keep the same premium story."
          description="Related devices help the catalog feel curated rather than infinite."
        />
        <div className="product-grid">
          {relatedProducts.map((related) => (
            <ProductCard product={related} key={related.slug} />
          ))}
        </div>
      </section>
    </section>
  )
}
