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
    { label: 'Giá', getValue: (product) => formatCurrency(product.price) },
    { label: 'Tình trạng', getValue: (product) => product.grade },
    { label: 'Pin', getValue: (product) => `${product.batteryHealth}%` },
    { label: 'Màn hình', getValue: (product) => product.display },
    { label: 'Chip', getValue: (product) => product.chipset },
    { label: 'Camera', getValue: (product) => product.camera },
    { label: 'Bảo hành', getValue: (product) => product.warranty },
  ]

  if (comparedProducts.length === 0) {
    return (
      <section className="empty-state shell">
        <h1>So sánh để chốt máy nhanh hơn.</h1>
        <p>Chọn tối đa bốn máy để đặt giá, pin, camera và bảo hành cạnh nhau trong cùng một màn hình.</p>
        <Link href="/products" className="button button--primary">
          Xem điện thoại
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
        <div className="compare-table__scroll" tabIndex={0}>
          <table className="compare-table__grid">
            <caption className="sr-only">Bảng so sánh chi tiết các thiết bị đã chọn</caption>
            <thead>
              <tr>
                <th scope="col">Tiêu chí</th>
                {comparedProducts.map((product) => (
                  <th scope="col" key={product.slug}>
                    {product.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compareMetrics.map(({ label, getValue }) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {comparedProducts.map((product) => (
                    <td key={`${product.slug}-${label}`}>
                      <span className="compare-table__value">{getValue(product)}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
