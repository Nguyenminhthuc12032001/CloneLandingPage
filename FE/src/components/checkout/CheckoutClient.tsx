'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'

import { calculateCartTotals, enrichCartLines } from '@/controllers/cartController'
import { useStore } from '@/components/store/StoreProvider'
import { formatCurrency } from '@/lib/format'
import type { CheckoutResult } from '@/models/order'

const initialCustomer = {
  fullName: '',
  email: '',
  phone: '',
  city: 'Ho Chi Minh City',
  address: '',
  note: '',
}

export function CheckoutClient() {
  const { cartLines, clearCart } = useStore()
  const [customer, setCustomer] = useState(initialCustomer)
  const [result, setResult] = useState<CheckoutResult | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const lines = enrichCartLines(cartLines)
  const totals = calculateCartTotals(cartLines)

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
        throw new Error('error' in data ? data.error : 'Checkout failed.')
      }

      setResult(data)
      clearCart()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Checkout failed.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <section className="shell empty-state">
        <h1>Order confirmed: {result.orderNumber}</h1>
        <p>{result.eta}</p>
        <p>Total paid: {formatCurrency(result.totals.total)}</p>
        <Link href="/account" className="button button--primary">
          View account dashboard
        </Link>
      </section>
    )
  }

  if (lines.length === 0) {
    return (
      <section className="shell empty-state">
        <h1>No items ready for checkout.</h1>
        <p>Add a device to cart first, then come back here to complete the order flow.</p>
        <Link href="/products" className="button button--primary">
          Shop catalog
        </Link>
      </section>
    )
  }

  return (
    <section className="shell checkout-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="section-heading">
          <span className="section-heading__eyebrow">Checkout</span>
          <h2>Complete the premium used-phone purchase flow.</h2>
          <p>Customer details, delivery address, and any setup notes are collected in one calm, guided form.</p>
        </div>

        <div className="form-grid">
          <label>
            Full name
            <input value={customer.fullName} onChange={(event) => setCustomer((current) => ({ ...current, fullName: event.target.value }))} />
          </label>
          <label>
            Email
            <input value={customer.email} onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label>
            Phone
            <input value={customer.phone} onChange={(event) => setCustomer((current) => ({ ...current, phone: event.target.value }))} />
          </label>
          <label>
            City
            <input value={customer.city} onChange={(event) => setCustomer((current) => ({ ...current, city: event.target.value }))} />
          </label>
          <label className="form-grid__full">
            Address
            <input value={customer.address} onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))} />
          </label>
          <label className="form-grid__full">
            Notes
            <textarea value={customer.note} onChange={(event) => setCustomer((current) => ({ ...current, note: event.target.value }))} rows={4} />
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary button--wide" type="submit" disabled={submitting}>
          {submitting ? 'Processing order...' : 'Place order'}
        </button>
      </form>

      <aside className="panel cart-summary">
        <span className="section-heading__eyebrow">Review</span>
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
            <span>Shipping</span>
            <strong>{formatCurrency(totals.shipping)}</strong>
          </div>
          <div>
            <span>Setup care</span>
            <strong>{formatCurrency(totals.setupFee)}</strong>
          </div>
        </div>
      </aside>
    </section>
  )
}
