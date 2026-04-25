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
        throw new Error('error' in data ? data.error : 'Không thể định giá thu cũ.')
      }

      setResult(data)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể định giá thu cũ.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="shell trade-in-layout">
      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="section-heading">
          <span className="section-heading__eyebrow">Thu cũ đổi mới</span>
          <h2>Định giá máy cũ trước khi lên đời.</h2>
          <p>Nhập đời máy, dung lượng, ngoại hình và pin để xem nhanh mức thu cũ dự kiến trước khi chốt máy mới.</p>
        </div>

        <div className="form-grid">
          <label>
            Hãng
            <select value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Google</option>
            </select>
          </label>

          <label>
            Mẫu máy
            <input
              value={form.model}
              onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
              placeholder="Ví dụ: iPhone 14 Pro"
            />
          </label>

          <label>
            Dung lượng
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
            Ngoại hình
            <select
              value={form.condition}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  condition: event.target.value as typeof form.condition,
                }))
              }
            >
              <option value="like-new">Như mới</option>
              <option value="great">Rất đẹp</option>
              <option value="good">Tốt</option>
              <option value="fair">Khá</option>
            </select>
          </label>

          <label>
            Pin hiện tại
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
          {submitting ? 'Đang định giá...' : 'Định giá ngay'}
        </button>
      </form>

      <aside className="panel trade-in-result">
        {result ? (
          <>
            <span className="section-heading__eyebrow">Giá thu dự kiến</span>
            <h2>{formatCurrency(result.estimatedValue)}</h2>
            <p>{result.summary}</p>
            <div className="trade-in-breakdown">
              <div>
                <span>Mẫu đối chiếu</span>
                <strong>{result.matchedModel}</strong>
              </div>
              <div>
                <span>Giá theo ngoại hình</span>
                <strong>{formatCurrency(result.conditionValue)}</strong>
              </div>
              <div>
                <span>Cộng thêm pin và dung lượng</span>
                <strong>{formatCurrency(result.batteryBonus)}</strong>
              </div>
              <div>
                <span>Ưu đãi hỗ trợ lên đời</span>
                <strong>{formatCurrency(result.seasonalBonus)}</strong>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="section-heading__eyebrow">Lên đời dễ hơn</span>
            <h2>Biết trước khoản bù để cân ngân sách nhanh hơn.</h2>
            <p>Chỉ cần nhập máy đang dùng để xem giá thu cũ dự kiến, rồi so luôn số tiền cần thêm khi lên đời.</p>
          </>
        )}
      </aside>
    </div>
  )
}
