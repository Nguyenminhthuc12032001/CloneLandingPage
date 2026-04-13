'use client'

import { FormEvent, useState } from 'react'

import { formatCurrency } from '@/lib/format'
import type { TradeInEstimate } from '@/models/tradeIn'

const initialForm = {
  brand: 'Apple',
  model: 'iPhone 14 Pro',
  storage: '256GB',
  condition: 'great',
  batteryHealth: 89,
}

export function TradeInEstimator() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState<TradeInEstimate | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/trade-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = (await response.json()) as TradeInEstimate | { error: string }

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Unable to estimate trade-in.')
      }

      setResult(data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to estimate trade-in.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="shell trade-in-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="section-heading">
          <span className="section-heading__eyebrow">Trade-in</span>
          <h2>Estimate credit before checkout.</h2>
          <p>Use condition, storage, and battery health to preview how much your current phone can offset.</p>
        </div>

        <div className="form-grid">
          <label>
            Brand
            <select value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Google</option>
            </select>
          </label>

          <label>
            Model
            <input
              value={form.model}
              onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
              placeholder="Example: iPhone 14 Pro"
            />
          </label>

          <label>
            Storage
            <select
              value={form.storage}
              onChange={(event) => setForm((current) => ({ ...current, storage: event.target.value }))}
            >
              <option>128GB</option>
              <option>256GB</option>
              <option>512GB</option>
            </select>
          </label>

          <label>
            Condition
            <select
              value={form.condition}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  condition: event.target.value as typeof form.condition,
                }))
              }
            >
              <option value="like-new">Like new</option>
              <option value="great">Great</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </label>

          <label>
            Battery health
            <input
              type="number"
              min="70"
              max="100"
              value={form.batteryHealth}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  batteryHealth: Number.parseInt(event.target.value || '0', 10),
                }))
              }
            />
          </label>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button button--primary button--wide" type="submit" disabled={submitting}>
          {submitting ? 'Estimating...' : 'Estimate trade-in'}
        </button>
      </form>

      <aside className="panel trade-in-result">
        {result ? (
          <>
            <span className="section-heading__eyebrow">Estimated credit</span>
            <h2>{formatCurrency(result.estimatedValue)}</h2>
            <p>{result.summary}</p>
            <div className="trade-in-breakdown">
              <div>
                <span>Matched model</span>
                <strong>{result.matchedModel}</strong>
              </div>
              <div>
                <span>Condition-adjusted</span>
                <strong>{formatCurrency(result.conditionValue)}</strong>
              </div>
              <div>
                <span>Battery and storage bonus</span>
                <strong>{formatCurrency(result.batteryBonus)}</strong>
              </div>
              <div>
                <span>Seasonal bonus</span>
                <strong>{formatCurrency(result.seasonalBonus)}</strong>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="section-heading__eyebrow">Upgrade path</span>
            <h2>Trade-in is designed into the buying flow.</h2>
            <p>
              Customers can discover, compare, estimate credit, and complete checkout without leaving the storefront.
            </p>
          </>
        )}
      </aside>
    </div>
  )
}
