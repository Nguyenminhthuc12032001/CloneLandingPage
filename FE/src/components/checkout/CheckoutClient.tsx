'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

import { calculateCartTotalsWithProducts, enrichCartLinesWithProducts } from '@/lib/cart'
import { useStore } from '@/components/store/StoreProvider'
import { formatCurrency } from '@/lib/format'
import type { CheckoutResult } from '@/models/order'
import type { PhoneProduct } from '@/models/product'

const initialCustomer = {
  fullName: '',
  email: '',
  phone: '',
  city: 'TP. Hồ Chí Minh',
  address: '',
  note: '',
}

export function CheckoutClient({ products }: { products: PhoneProduct[] }) {
  const { cartLines, clearCart } = useStore()
  const [customer, setCustomer] = useState(initialCustomer)
  const [result, setResult] = useState<CheckoutResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const lines = enrichCartLinesWithProducts(cartLines, products)
  const totals = calculateCartTotalsWithProducts(cartLines, products)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lines: cartLines, customer }),
      })

      const data = (await response.json()) as CheckoutResult | { error: string }

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Thanh toán thất bại.')
      }

      setResult(data)
      clearCart()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Thanh toán thất bại.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <section className="shell empty-state">
        <h1>Đơn hàng đã được xác nhận: {result.orderNumber}</h1>
        <p>{result.eta}</p>
        <p>Tổng thanh toán: {formatCurrency(result.totals.total)}</p>
        <Link href="/account" className="button button--primary">
          Xem trang tài khoản
        </Link>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="shell empty-state">
        <h1>Chưa có sản phẩm nào sẵn sàng để thanh toán.</h1>
        <p>Hãy thêm thiết bị vào giỏ trước, rồi quay lại đây để hoàn tất đơn hàng.</p>
        <Link href="/products" className="button button--primary">
          Xem điện thoại
        </Link>
      </section>
    )
  }

  return (
    <section className="shell checkout-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="section-heading">
          <span className="section-heading__eyebrow">Thanh toán</span>
          <h2>Hoàn tất đơn hàng nhanh và rõ ràng.</h2>
          <p>Điền thông tin nhận hàng một lần để chốt máy, giao hàng và hỗ trợ cài đặt sau khi nhận.</p>
        </div>

        <div className="form-grid">
          <label>
            Họ và tên
            <input
              required
              autoComplete="name"
              value={customer.fullName}
              onChange={(event) => setCustomer((current) => ({ ...current, fullName: event.target.value }))}
            />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={customer.email}
              onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
            />
          </label>
          <label>
            Số điện thoại
            <input
              required
              type="tel"
              autoComplete="tel"
              value={customer.phone}
              onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))}
            />
          </label>
          <label>
            Thành phố
            <input
              required
              autoComplete="address-level2"
              value={customer.city}
              onChange={(event) => setCustomer((current) => ({ ...current, city: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            Địa chỉ
            <input
              required
              autoComplete="street-address"
              value={customer.address}
              onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            Ghi chú
            <textarea value={customer.note} onChange={(event) => setCustomer((current) => ({ ...current, note: event.target.value }))} rows={4} />
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary button--wide" type="submit" disabled={submitting}>
          {submitting ? 'Đang xử lý đơn hàng...' : 'Xác nhận đặt hàng'}
        </button>

        <div className="checkout-care">
          <div>
            <span>Kiểm định</span>
            <strong>Pin, khung, camera và màn hình đều được kiểm tra trước khi đóng gói.</strong>
          </div>
          <div>
            <span>Giao hàng</span>
            <strong>2-4 ngày làm việc kèm hướng dẫn cài đặt và hỗ trợ sau mua.</strong>
          </div>
        </div>
      </form>

      <aside className="panel cart-summary">
        <span className="section-heading__eyebrow">Rà soát đơn</span>
        <h2>{formatCurrency(totals.total)}</h2>
        <div className="summary-stack">
          {lines.map((line) => (
            <div key={line.product.slug}>
              <span>
                {line.product.name} x {line.quantity}
              </span>
              <strong>{formatCurrency(line.lineTotal)}</strong>
            </div>
          ))}
        </div>
        <div className="summary-stack summary-stack--bordered">
          <div>
            <span>Vận chuyển</span>
            <strong>{formatCurrency(totals.shipping)}</strong>
          </div>
          <div>
            <span>Hỗ trợ cài đặt</span>
            <strong>{formatCurrency(totals.setupFee)}</strong>
          </div>
        </div>

        <div className="checkout-trust">
          <div>
            <span>Bảo hành</span>
            <strong>Đã bao gồm hỗ trợ phần cứng trong 12 tháng</strong>
          </div>
          <div>
            <span>Đóng gói</span>
            <strong>Trong hộp có phiếu QC, cáp và hướng dẫn cài đặt</strong>
          </div>
          <div>
            <span>Thu cũ đổi mới</span>
            <strong>Giá trị thu cũ có thể dùng cho lần nâng cấp kế tiếp</strong>
          </div>
        </div>
      </aside>
    </section>
  )
}
