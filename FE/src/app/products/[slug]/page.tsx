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

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm | Renewed Mobile Store',
    }
  }

  return {
    title: `${product.name} ${product.storage} | Renewed Mobile Store`,
    description: product.shortDescription,
  }
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.slug)

  return (
    <section className="shell page-shell">
      <div className="breadcrumb-row">
        <Link href="/products">Điện thoại</Link>
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
            <span>Giá mới tham khảo {formatCurrency(product.originalPrice)}</span>
            <small>Trả góp từ {formatCurrency(product.monthlyPrice)} / tháng.</small>
          </div>

          <div className="detail-stats">
            <div>
              <span>Tình trạng máy</span>
              <strong>{product.grade}</strong>
            </div>
            <div>
              <span>Pin</span>
              <strong>{product.batteryHealth}%</strong>
            </div>
            <div>
              <span>Bảo hành</span>
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
          <span className="section-heading__eyebrow">Điểm nổi bật</span>
          <h2>Lý do nhiều khách sẽ cân mẫu máy này.</h2>
          <ul className="bullet-list">
            {product.highlightBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </article>

        <article className="panel detail-panel">
          <span className="section-heading__eyebrow">Trong hộp có gì</span>
          <h2>Phụ kiện và giấy tờ đi kèm khi nhận máy.</h2>
          <ul className="bullet-list">
            {product.accessories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="panel specs-panel">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Thông số</span>
          <h2>Thông số đáng quan tâm khi so máy cũ.</h2>
          <p>Đây là những chi tiết người mua thường xem đầu tiên trước khi quyết định chốt máy.</p>
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
          eyebrow="Mẫu cùng tầm giá"
          title="Những máy đáng cân thêm trước khi chốt."
          description="Các lựa chọn liên quan giúp bạn so nhanh pin, đời máy và mức giá trong cùng phân khúc."
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
