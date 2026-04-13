import Link from 'next/link'

import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { getAccountDashboard } from '@/controllers/accountController'
import { formatCurrency } from '@/lib/format'

export default function AccountPage() {
  const { customer, orders, benefits, savedRecommendations } = getAccountDashboard()

  return (
    <section className="shell page-shell">
      <SectionHeading
        eyebrow="Account"
        title="Service-led ownership dashboard for premium refurbished customers."
        description="Mock account data is wired in so the MVC structure is ready for real auth and order data later."
      />

      <div className="account-hero">
        <article className="panel account-profile">
          <span className="section-heading__eyebrow">{customer.tier}</span>
          <h2>{customer.name}</h2>
          <p>{customer.email}</p>
          <div className="metric-row metric-row--compact">
            <div>
              <strong>{formatCurrency(customer.availableTradeInCredit)}</strong>
              <span>Available trade-in credit</span>
            </div>
            <div>
              <strong>{customer.nextCheckIn}</strong>
              <span>Next support check-in</span>
            </div>
          </div>
        </article>

        <article className="panel account-benefits">
          <span className="section-heading__eyebrow">Benefits</span>
          <h2>Post-purchase care keeps the storefront premium after checkout.</h2>
          <ul className="bullet-list">
            {benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </article>
      </div>

      <section className="section-space">
        <SectionHeading
          eyebrow="Orders"
          title="Mock order history is already part of the account layer."
          description="This section can later be connected to real payment, shipment, and support systems."
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
          eyebrow="Recommended"
          title="Keep high-value devices visible after purchase."
          description="The dashboard can surface upgrade candidates, accessories, or loyalty-driven trade-in prompts."
        />
        <div className="product-grid">
          {savedRecommendations.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>

        <div className="account-actions">
          <Link href="/trade-in" className="button button--ghost">
            Start next upgrade
          </Link>
        </div>
      </section>
    </section>
  )
}
