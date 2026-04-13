import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <section className="shell empty-state">
      <h1>Page not found.</h1>
      <p>The route does not exist in the storefront right now. Head back to the catalog and continue browsing.</p>
      <Link href="/products" className="button button--primary">
        Go to catalog
      </Link>
    </section>
  )
}
