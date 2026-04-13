import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__grid">
        <div>
          <span className="section-heading__eyebrow">Renewed care</span>
          <h2>Pre-owned phones, merchandised with premium trust.</h2>
          <p>
            Inspection-first catalog, transparent grading, trade-in credit, and support that keeps the buying flow
            calm and high confidence.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/products">Catalog</Link>
          <Link href="/trade-in">Trade-in</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/account">Account</Link>
        </div>

        <div className="footer-note">
          <p>12-month warranty on curated devices.</p>
          <p>Battery health and cosmetic grading shown before checkout.</p>
          <p>Support window: 09:00 - 21:00 every day.</p>
        </div>
      </div>
    </footer>
  )
}
