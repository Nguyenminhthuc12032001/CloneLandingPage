'use client'

import Link from 'next/link'

import { calculateCartTotalsWithProducts, enrichCartLinesWithProducts } from '@/lib/cart'
import { formatCurrency } from '@/lib/format'
import { useStore } from '@/components/store/StoreProvider'
import type { PhoneProduct } from '@/models/product'

export function CartClient({ products }: { products: PhoneProduct[] }) {
  const { cartLines, setQuantity, removeFromCart } = useStore()
  const lines = enrichCartLinesWithProducts(cartLines, products)
  const totals = calculateCartTotalsWithProducts(cartLines, products)

  if (lines.length === 0) {
    return (
      <section className="empty-state shell">
        <h1>Giỏ hàng của bạn đang trống.</h1>
        <p>Hãy xem các mẫu đang có giá tốt, so sánh nhanh rồi thêm chiếc phù hợp vào giỏ.</p>
        <Link href="/products" className="button button--primary">
          Xem điện thoại
        </Link>
      </section>
    )
  }

  return (
    <section className="shell cart-layout">
      <div className="cart-lines">
        {lines.map((line) => (
          <article className="panel cart-line" key={line.product.slug}>
            <div className="cart-line__copy">
              <h2>{line.product.name}</h2>
              <p>
                {line.product.storage} / {line.product.color} / {line.product.grade}
              </p>
              <span>{line.product.batteryHealth}% pin</span>
            </div>

            <div className="cart-line__controls">
              <label>
                Số lượng
                <input
                  type="number"
                  min="1"
                  max="9"
                  value={line.quantity}
                  onChange={(event) => setQuantity(line.product.slug, Number.parseInt(event.target.value || '1', 10))}
                />
              </label>

              <strong>{formatCurrency(line.lineTotal)}</strong>
              <button type="button" className="text-link" onClick={() => removeFromCart(line.product.slug)}>
                Xóa
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="panel cart-summary">
        <span className="section-heading__eyebrow">Tóm tắt đơn hàng</span>
        <h2>{formatCurrency(totals.total)}</h2>
        <div className="summary-stack">
          <div>
            <span>Tạm tính</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div>
            <span>Tiết kiệm</span>
            <strong>{formatCurrency(totals.savings)}</strong>
          </div>
          <div>
            <span>Vận chuyển</span>
            <strong>{formatCurrency(totals.shipping)}</strong>
          </div>
          <div>
            <span>Hỗ trợ cài đặt</span>
            <strong>{formatCurrency(totals.setupFee)}</strong>
          </div>
        </div>

        <Link href="/checkout" className="button button--primary button--wide">
          Tiếp tục thanh toán
        </Link>
        <Link href="/products" className="button button--ghost button--wide">
          Xem thêm máy khác
        </Link>
      </aside>
    </section>
  )
}
