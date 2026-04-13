'use client'

import Link from 'next/link'

import { calculateCartTotals, enrichCartLines } from '@/controllers/cartController'
import { formatCurrency } from '@/lib/format'
import { useStore } from '@/components/store/StoreProvider'

export function CartClient() {
  const { cartLines, setQuantity, removeFromCart } = useStore()
  const lines = enrichCartLines(cartLines)
  const totals = calculateCartTotals(cartLines)

  if (lines.length === 0) {
    return (
      <section className="empty-state shell">
        <h1>Your cart is empty.</h1>
        <p>Browse curated devices, compare options, and add the ones that feel right for your next upgrade.</p>
        <Link href="/products" className="button button--primary">
          Explore catalog
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
              <span>{line.product.batteryHealth}% battery health</span>
            </div>

            <div className="cart-line__controls">
              <label>
                Qty
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
                Remove
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside className="panel cart-summary">
        <span className="section-heading__eyebrow">Order summary</span>
        <h2>{formatCurrency(totals.total)}</h2>
        <div className="summary-stack">
          <div>
            <span>Subtotal</span>
            <strong>{formatCurrency(totals.subtotal)}</strong>
          </div>
          <div>
            <span>Savings</span>
            <strong>{formatCurrency(totals.savings)}</strong>
          </div>
          <div>
            <span>Shipping</span>
            <strong>{formatCurrency(totals.shipping)}</strong>
          </div>
          <div>
            <span>Setup care</span>
            <strong>{formatCurrency(totals.setupFee)}</strong>
          </div>
        </div>

        <Link href="/checkout" className="button button--primary button--wide">
          Continue to checkout
        </Link>
        <Link href="/products" className="button button--ghost button--wide">
          Add another device
        </Link>
      </aside>
    </section>
  )
}
