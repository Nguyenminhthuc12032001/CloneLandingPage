import Link from 'next/link'

import { getAllProducts, getFeaturedProducts } from '@/controllers/catalogController'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductVisual } from '@/components/ui/ProductVisual'
import { SectionHeading } from '@/components/ui/SectionHeading'

const trustPoints = [
  {
    title: 'Inspection first',
    text: 'Every phone includes grading, battery health disclosure, and a quality-control summary before checkout.',
  },
  {
    title: 'Apple-like flow',
    text: 'Clear merchandising, premium copy, strong spacing, and a calm path from discovery to checkout.',
  },
  {
    title: 'Upgrade logic',
    text: 'Compare devices, estimate trade-in credit, and complete the order without losing context.',
  },
]

const journeySteps = [
  'Browse premium used devices with transparent condition data.',
  'Compare up to four models side by side.',
  'Apply trade-in estimate and proceed to guided checkout.',
]

export default function HomePage() {
  const featured = getFeaturedProducts(4)
  const heroProduct = featured[0]
  const allProducts = getAllProducts()

  return (
    <>
      <section className="hero-section">
        <div className="shell hero-section__layout">
          <div className="hero-copy">
            <span className="section-heading__eyebrow">Premium renewed devices</span>
            <h1>Sell used phones with an Apple-grade storefront, not a second-hand look.</h1>
            <p>
              This app is structured for a premium resale brand: high-trust catalog pages, detailed product stories,
              trade-in flow, compare board, cart, checkout, and account dashboard.
            </p>

            <div className="hero-actions">
              <Link href="/products" className="button button--primary">
                Explore catalog
              </Link>
              <Link href="/trade-in" className="button button--ghost">
                Estimate trade-in
              </Link>
            </div>

            <div className="metric-row">
              <div>
                <strong>8</strong>
                <span>premium devices merchandised</span>
              </div>
              <div>
                <strong>12 mo</strong>
                <span>warranty narrative built in</span>
              </div>
              <div>
                <strong>4 flows</strong>
                <span>catalog, compare, trade-in, checkout</span>
              </div>
            </div>
          </div>

          <div className="hero-showcase">
            <ProductVisual product={heroProduct} />
            <div className="panel hero-panel">
              <span className="section-heading__eyebrow">Hero device</span>
              <h2>{heroProduct.name}</h2>
              <p>{heroProduct.heroTitle}</p>
              <ul className="bullet-list">
                {heroProduct.summaryBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="shell section-space">
        <SectionHeading
          eyebrow="Store pillars"
          title="Built to make used phones feel premium, legible, and high confidence."
          description="The UI direction is inspired by Apple merchandising while the product logic is tuned for the refurbished market."
        />
        <div className="info-grid">
          {trustPoints.map((point) => (
            <article className="panel info-card" key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section-space">
        <SectionHeading
          eyebrow="Featured picks"
          title="The catalog opens with hero products designed to convert quickly."
          description="Feature cards balance premium storytelling, technical proof, and fast cart actions."
        />
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </section>

      <section className="shell section-space dual-panels">
        <article className="panel feature-panel">
          <span className="section-heading__eyebrow">Comparison board</span>
          <h2>Side-by-side product positioning helps premium buyers decide faster.</h2>
          <p>
            Use compare to frame differences in battery, camera, chip, grade, and price without forcing customers to
            bounce across tabs.
          </p>
          <Link href="/compare" className="text-link">
            Open compare board
          </Link>
        </article>

        <article className="panel feature-panel">
          <span className="section-heading__eyebrow">Trade-in and upgrade</span>
          <h2>Trade-in is part of the conversion engine, not an afterthought.</h2>
          <p>
            Estimate credit, reduce purchase anxiety, and position the next phone as a clear upgrade path inside the
            same experience.
          </p>
          <Link href="/trade-in" className="text-link">
            Estimate device value
          </Link>
        </article>
      </section>

      <section className="shell section-space">
        <SectionHeading
          eyebrow="Buying journey"
          title="A simple premium flow from discovery to ownership."
          description="The app is scaffolded so you can attach real auth, CMS, payments, and inventory later without redoing the view layer."
        />
        <div className="journey-grid">
          {journeySteps.map((step, index) => (
            <article className="journey-step" key={step}>
              <span>0{index + 1}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section-space section-space--last">
        <SectionHeading
          eyebrow="Full inventory"
          title="The catalog is ready for both Apple-first and premium multi-brand positioning."
          description="Beyond iPhone, the storefront can also carry selected Android flagships while preserving the same elevated brand language."
        />
        <div className="mini-grid">
          {allProducts.slice(0, 3).map((product) => (
            <article className="panel mini-card" key={product.slug}>
              <strong>{product.name}</strong>
              <span>
                {product.storage} / {product.grade}
              </span>
              <p>{product.shortDescription}</p>
              <Link href={`/products/${product.slug}`} className="text-link">
                View device
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
