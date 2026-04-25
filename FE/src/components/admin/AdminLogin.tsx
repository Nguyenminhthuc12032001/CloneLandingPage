'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function AdminLogin({ nextPath }: { nextPath: string }) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('Đăng nhập bằng token admin để tiếp tục.')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage('Đang xác thực...')

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })
      const data = (await response.json()) as { authenticated?: boolean; error?: string }

      if (!response.ok || !data.authenticated) {
        throw new Error(data.error ?? 'Không thể đăng nhập admin.')
      }

      router.replace(nextPath)
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể đăng nhập admin.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-login-shell">
      <form className="admin-login-panel" onSubmit={handleSubmit}>
        <span className="section-heading__eyebrow">Admin</span>
        <h1>Đăng nhập quản trị</h1>
        <p>{message}</p>
        <label>
          <span>Admin token</span>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </section>
  )
}
