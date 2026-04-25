'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { formatCurrency } from '@/lib/format'
import type { OrderStatus, StoredOrder } from '@/models/order'
import type { PhoneProduct } from '@/models/product'

type OrdersResponse = {
  orders: StoredOrder[]
  meta: {
    total: number
  }
}

const orderStatuses: OrderStatus[] = [
  'Đã nhận đơn',
  'Đang xác nhận',
  'Đang giao',
  'Đã giao',
  'Sẵn sàng cài đặt',
]

const statusFilters = ['Tất cả', ...orderStatuses] as const

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function AdminDashboard({ products }: { products: PhoneProduct[] }) {
  const router = useRouter()
  const [orders, setOrders] = useState<StoredOrder[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilters)[number]>('Tất cả')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('Đang tải dữ liệu vận hành...')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadOrders() {
      setIsLoading(true)

      try {
        const response = await fetch('/api/orders', {
          credentials: 'same-origin',
          cache: 'no-store',
        })
        const data = (await response.json()) as OrdersResponse | { error?: string }

        if (!response.ok || !('orders' in data)) {
          throw new Error('error' in data ? data.error : 'Không thể tải đơn hàng.')
        }

        if (isMounted) {
          setOrders(data.orders)
          setMessage(`Đã đồng bộ ${data.meta.total} đơn hàng.`)
        }
      } catch (error) {
        if (isMounted) {
          setOrders([])
          setMessage(error instanceof Error ? error.message : 'Không thể tải dữ liệu admin.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'Tất cả' || order.status === statusFilter
      const matchesQuery =
        !normalizedQuery ||
        [order.orderNumber, order.customer.fullName, order.customer.email, order.customer.phone, order.customer.city]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)

      return matchesStatus && matchesQuery
    })
  }, [orders, query, statusFilter])

  const dashboardStats = useMemo(() => {
    const revenue = orders.reduce((total, order) => total + order.totals.total, 0)
    const waitingCount = orders.filter((order) => order.status !== 'Đã giao').length
    const averageOrderValue = orders.length ? revenue / orders.length : 0
    const premiumStock = products.filter((product) => product.grade === 'A+' || product.batteryHealth >= 90).length

    return [
      { label: 'Doanh thu đơn hàng', value: formatCurrency(revenue), detail: `${orders.length} đơn đã ghi nhận` },
      { label: 'Đơn cần xử lý', value: waitingCount.toString(), detail: 'Chưa ở trạng thái đã giao' },
      { label: 'Giá trị trung bình', value: formatCurrency(averageOrderValue), detail: 'Tính trên đơn đang lưu' },
      { label: 'Máy ưu tiên bán', value: `${premiumStock}/${products.length}`, detail: 'A+ hoặc pin từ 90%' },
    ]
  }, [orders, products])

  const catalogStats = useMemo(() => {
    const byBrand = products.reduce<Record<string, number>>((summary, product) => {
      summary[product.brand] = (summary[product.brand] ?? 0) + 1
      return summary
    }, {})
    const averageBattery = products.length
      ? products.reduce((total, product) => total + product.batteryHealth, 0) / products.length
      : 0
    const totalInventoryValue = products.reduce((total, product) => total + product.price, 0)

    return {
      byBrand,
      averageBattery: Math.round(averageBattery),
      totalInventoryValue,
      featured: products.filter((product) => product.featured).length,
    }
  }, [products])

  async function updateOrderStatus(orderNumber: string, status: OrderStatus) {
    setUpdatingOrder(orderNumber)
    setMessage(`Đang cập nhật ${orderNumber}...`)

    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ status }),
      })
      const data = (await response.json()) as StoredOrder | { error?: string }

      if (!response.ok || !('orderNumber' in data)) {
        throw new Error('error' in data ? data.error : 'Không thể cập nhật đơn hàng.')
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) => (order.orderNumber === orderNumber ? data : order)),
      )
      setMessage(`Đã cập nhật ${orderNumber}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Không thể cập nhật đơn hàng.')
    } finally {
      setUpdatingOrder(null)
    }
  }

  async function logout() {
    await fetch('/api/admin/session', {
      method: 'DELETE',
      credentials: 'same-origin',
    })
    router.replace('/admin/login')
    router.refresh()
  }

  return (
    <section className="admin-shell">
      <div className="admin-hero">
        <div>
          <span className="section-heading__eyebrow">Admin</span>
          <h1>Dashboard quản lý cửa hàng</h1>
          <p>Theo dõi đơn hàng, doanh thu, trạng thái xử lý và chất lượng danh mục máy đang bán.</p>
        </div>

        <div className="admin-session-card">
          <span>Phiên quản trị</span>
          <strong>Đã xác thực</strong>
          <button className="button button--ghost" type="button" onClick={logout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="admin-stat-grid">
        {dashboardStats.map((stat) => (
          <article className="admin-stat-card" key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            <small>{stat.detail}</small>
          </article>
        ))}
      </div>

      <div className="admin-layout">
        <section className="admin-panel admin-panel--wide">
          <div className="admin-panel__header">
            <div>
              <span className="section-heading__eyebrow">Đơn hàng</span>
              <h2>Quản lý trạng thái xử lý</h2>
            </div>
            <span className="admin-sync-state">{isLoading ? 'Đang tải...' : message}</span>
          </div>

          <div className="admin-toolbar">
            <label>
              <span>Tìm kiếm</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Mã đơn, tên, email, số điện thoại"
              />
            </label>

            <label>
              <span>Trạng thái</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as (typeof statusFilters)[number])}
              >
                {statusFilters.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-order-list">
            {filteredOrders.length === 0 ? (
              <div className="admin-empty-state">
                <strong>Chưa có đơn phù hợp</strong>
                <span>Thử đổi bộ lọc hoặc tạo đơn test từ trang checkout.</span>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <article className="admin-order-card" key={order.orderNumber}>
                  <div className="admin-order-card__main">
                    <div>
                      <span className="badge">{order.status}</span>
                      <h3>{order.orderNumber}</h3>
                      <p>
                        {order.customer.fullName} · {order.customer.phone} · {order.customer.city}
                      </p>
                    </div>
                    <strong>{formatCurrency(order.totals.total)}</strong>
                  </div>

                  <div className="admin-order-card__meta">
                    <span>{formatDate(order.createdAt)}</span>
                    <span>{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</span>
                  </div>

                  <label className="admin-status-select">
                    <span>Cập nhật trạng thái</span>
                    <select
                      value={order.status}
                      disabled={updatingOrder === order.orderNumber}
                      onChange={(event) => updateOrderStatus(order.orderNumber, event.target.value as OrderStatus)}
                    >
                      {orderStatuses.map((status) => (
                        <option value={status} key={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="admin-side-stack">
          <section className="admin-panel">
            <div className="admin-panel__header admin-panel__header--compact">
              <div>
                <span className="section-heading__eyebrow">Danh mục</span>
                <h2>Tổng quan sản phẩm</h2>
              </div>
            </div>

            <div className="admin-catalog-summary">
              <div>
                <span>Giá trị danh mục</span>
                <strong>{formatCurrency(catalogStats.totalInventoryValue)}</strong>
              </div>
              <div>
                <span>Pin trung bình</span>
                <strong>{catalogStats.averageBattery}%</strong>
              </div>
              <div>
                <span>Đang nổi bật</span>
                <strong>{catalogStats.featured} máy</strong>
              </div>
            </div>

            <div className="admin-brand-list">
              {Object.entries(catalogStats.byBrand).map(([brand, count]) => (
                <div key={brand}>
                  <span>{brand}</span>
                  <strong>{count} sản phẩm</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__header admin-panel__header--compact">
              <div>
                <span className="section-heading__eyebrow">Kho bán</span>
                <h2>Máy cần ưu tiên</h2>
              </div>
            </div>

            <div className="admin-product-list">
              {[...products]
                .sort((left, right) => right.batteryHealth - left.batteryHealth)
                .slice(0, 5)
                .map((product) => (
                  <article className="admin-product-row" key={product.slug}>
                    <div>
                      <strong>{product.name}</strong>
                      <span>
                        {product.brand} · {product.storage} · Pin {product.batteryHealth}%
                      </span>
                    </div>
                    <b>{formatCurrency(product.price)}</b>
                  </article>
                ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  )
}
