import Link from 'next/link'

import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAccountDashboard } from '@/controllers/accountController'
import { formatCurrency } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const { customer, orders, serviceStats, savedRecommendations } = await getAccountDashboard()

  return (
    <section className="shell page-shell">
      <SectionHeading
        eyebrow="Tài khoản"
        title="Bảng điều khiển hậu mãi cho khách hàng mua máy cũ cao cấp."
        description="Tổng hợp từ đơn hàng thật đã phát sinh trong hệ thống để chăm sóc sau mua và gợi ý nâng cấp."
      />

      <div className="account-hero">
        <article className="panel account-profile">
          <span className="section-heading__eyebrow">{customer.tier}</span>
          <h2>{customer.name}</h2>
          <p>{customer.email}</p>
          <div className="metric-row metric-row--compact">
            <div>
              <strong>{formatCurrency(customer.availableTradeInCredit)}</strong>
              <span>Giá trị thu cũ khả dụng</span>
            </div>
            <div>
              <strong>{customer.nextCheckIn}</strong>
              <span>Lịch chăm sóc tiếp theo</span>
            </div>
          </div>
        </article>

        <article className="panel account-benefits">
          <span className="section-heading__eyebrow">Hậu mãi</span>
          <h2>Dịch vụ sau mua được tính từ trạng thái đơn hàng thật.</h2>
          <div className="summary-stack">
            {serviceStats.map((stat) => (
              <div key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </div>
            ))}
          </div>
        </article>
      </div>

      <section className="section-space">
        <SectionHeading
          eyebrow="Đơn hàng"
          title="Lịch sử đơn hàng từ dữ liệu checkout thật."
          description="Các đơn được đọc từ kho lưu trữ đơn hàng production thay vì dữ liệu mẫu."
        />
        <div className="info-grid">
          {orders.map((order) => (
            <article className="panel info-card" key={order.orderNumber}>
              <span className="badge">{order.status}</span>
              <h3>{order.orderNumber}</h3>
              <p>{order.createdAt}</p>
              <strong>{formatCurrency(order.total)}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section-space section-space--last">
        <SectionHeading
          eyebrow="Gợi ý"
          title="Giữ các thiết bị đáng cân nhắc luôn hiện diện sau khi mua."
          description="Dashboard có thể gợi ý mẫu nâng cấp, phụ kiện hoặc lời nhắc thu cũ đổi mới theo hạng thành viên."
        />
        <div className="product-grid">
          {savedRecommendations.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>

        <div className="account-actions">
          <Link href="/trade-in" className="button button--ghost">
            Bắt đầu lần nâng cấp tiếp theo
          </Link>
        </div>
      </section>
    </section>
  )
}
