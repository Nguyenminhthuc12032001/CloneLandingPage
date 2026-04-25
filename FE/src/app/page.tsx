import type { Metadata } from 'next'
import Link from 'next/link'

import { getAllProducts, getFeaturedProducts } from '@/controllers/catalogController'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductVisual } from '@/components/ui/ProductVisual'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Renewed - Điện thoại cũ đẹp, giá tốt',
  description: 'Điện thoại đã qua sử dụng được kiểm tra kỹ, hiển thị rõ pin, giá bán, thu cũ và bảo hành 12 tháng.',
}

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const allProducts = await getAllProducts()
  const featuredProducts = await getFeaturedProducts(4)
  const heroProduct = featuredProducts[0] ?? allProducts[0]

  if (!heroProduct) {
    return (
      <section className="shell empty-state">
        <h1>Chưa có sản phẩm thật trong hệ thống.</h1>
        <p>Hãy thêm sản phẩm vào bảng dữ liệu production trước khi mở bán.</p>
        <Link href="/admin" className="button button--primary">
          Mở admin
        </Link>
      </section>
    )
  }

  const averageBattery = Math.round(
    allProducts.reduce((total, product) => total + product.batteryHealth, 0) / allProducts.length,
  )
  const totalReviews = allProducts.reduce((total, product) => total + product.reviewCount, 0)
  const availableCount = allProducts.filter((product) => product.stockLabel !== 'Còn ít hàng').length

  const newestArrival =
    [...allProducts].sort(
      (left, right) => right.launchYear - left.launchYear || right.batteryHealth - left.batteryHealth,
    )[0] ?? heroProduct
  const strongestBattery =
    [...allProducts].sort((left, right) => right.batteryHealth - left.batteryHealth || right.rating - left.rating)[0] ??
    heroProduct
  const biggestSaving =
    [...allProducts].sort(
      (left, right) => right.originalPrice - right.price - (left.originalPrice - left.price),
    )[0] ?? heroProduct

  const brandOverview = [
    { brand: 'Apple', note: 'Máy bán chạy' },
    { brand: 'Samsung', note: 'Android cao cấp' },
    { brand: 'Google', note: 'Camera đẹp' },
  ]
    .map((entry) => ({
      ...entry,
      count: allProducts.filter((product) => product.brand === entry.brand).length,
    }))
    .filter((entry) => entry.count > 0)

  const heroStats = [
    { value: `${averageBattery}%`, label: 'pin trung bình' },
    { value: `${availableCount}`, label: 'máy sẵn hàng' },
    { value: `${totalReviews.toLocaleString('vi-VN')}`, label: 'lượt đánh giá' },
  ]

  const quickPicks = [
    {
      eyebrow: 'Đời mới',
      title: 'Ưu tiên đời mới',
      product: newestArrival,
      metric: `${newestArrival.launchYear} · ${newestArrival.storage}`,
      href: `/products/${newestArrival.slug}`,
    },
    {
      eyebrow: 'Pin cao',
      title: 'Ưu tiên pin đẹp',
      product: strongestBattery,
      metric: `${strongestBattery.batteryHealth}% pin`,
      href: `/products/${strongestBattery.slug}`,
    },
    {
      eyebrow: 'Giá tốt',
      title: 'Ưu tiên tiết kiệm',
      product: biggestSaving,
      metric: `Tiết kiệm ${formatCurrency(biggestSaving.originalPrice - biggestSaving.price)}`,
      href: `/products/${biggestSaving.slug}`,
    },
  ]

  const spotlightStats = [
    { label: 'Giá bán', value: formatCurrency(heroProduct.price) },
    { label: 'Tiết kiệm', value: formatCurrency(heroProduct.originalPrice - heroProduct.price) },
    { label: 'Thu cũ', value: formatCurrency(heroProduct.maxTradeIn) },
  ]

  const featuredGrid = featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4)

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Renewed Mobile Store',
    description: 'Điện thoại đã qua sử dụng với pin, giá bán, thu cũ và bảo hành được trình bày rõ ràng.',
    inLanguage: 'vi-VN',
  }

  const spotlightCopy = `Máy ${heroProduct.grade}, pin ${heroProduct.batteryHealth}%, ${heroProduct.stockLabel.toLowerCase()}. Phù hợp nếu bạn muốn lên đời tiết kiệm nhưng vẫn cần máy đẹp, dùng ổn định và có bảo hành rõ ràng.`

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="hero-section">
        <div className="shell hero-banner">
          <div className="hero-section__layout">
            <div className="hero-copy">
              <span className="section-heading__eyebrow">Máy cũ giá tốt</span>
              <h1>Chào mừng bạn đến với Renewed</h1>
              <p>
                Chọn điện thoại đã qua sử dụng theo cách quen thuộc với người mua Việt Nam: thấy ngay pin, tình trạng
                máy, giá tốt, hỗ trợ thu cũ và bảo hành 12 tháng.
              </p>

              <div className="hero-actions">
                <Link href="/products" className="button button--primary">
                  Xem điện thoại
                </Link>
                <Link href="/trade-in" className="button button--ghost">
                  Định giá máy cũ
                </Link>
              </div>

              <div className="metric-row">
                {heroStats.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-showcase">
              <div className="hero-visual-wrap">
                <ProductVisual product={heroProduct} />

                <article className="hero-floating-card hero-floating-card--top">
                  <span>Máy nổi bật</span>
                  <strong>{heroProduct.name}</strong>
                  <small>
                    {heroProduct.storage} / {heroProduct.color}
                  </small>
                </article>

                <article className="hero-floating-card hero-floating-card--bottom">
                  <span>Giá đang tốt</span>
                  <strong>{formatCurrency(heroProduct.originalPrice - heroProduct.price)}</strong>
                  <small>Thu cũ tối đa {formatCurrency(heroProduct.maxTradeIn)}</small>
                </article>
              </div>
            </div>
          </div>

          <div className="brand-row">
            {brandOverview.map((entry) => (
              <article className="brand-pill" key={entry.brand}>
                <span>{entry.brand}</span>
                <strong>{entry.count} mẫu</strong>
                <small>{entry.note}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell section-space">
        <SectionHeading eyebrow="Lối vào nhanh" title="Chọn theo đúng điều bạn đang ưu tiên." />

        <div className="collection-strip">
          {quickPicks.map((pick) => (
            <Link href={pick.href} className="panel collection-card" key={pick.title}>
              <span className="section-heading__eyebrow">{pick.eyebrow}</span>
              <h3>{pick.title}</h3>
              <p>{pick.product.name}</p>
              <strong>{pick.metric}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section-space" id="featured">
        <SectionHeading
          eyebrow="Máy nổi bật"
          title="Mẫu dễ chốt cho người mua lần đầu."
          description="Pin, ngoại hình, giá bán và mức bù thu cũ được đưa lên trước để bạn ra quyết định nhanh hơn."
        />

        <article className="panel spotlight-card">
          <div className="spotlight-card__copy">
            <span className="section-heading__eyebrow">{heroProduct.badge}</span>
            <h3>{heroProduct.name}</h3>
            <p>{spotlightCopy}</p>

            <div className="spotlight-chip-row">
              {heroProduct.summaryBullets.slice(0, 3).map((bullet) => (
                <span className="spotlight-chip" key={bullet}>
                  {bullet}
                </span>
              ))}
            </div>

            <div className="metric-row metric-row--compact">
              {spotlightStats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-actions">
              <Link href={`/products/${heroProduct.slug}`} className="button button--primary">
                Xem máy
              </Link>
              <Link href="/compare" className="button button--ghost">
                So sánh ngay
              </Link>
            </div>
          </div>

          <div className="spotlight-card__visual">
            <ProductVisual product={heroProduct} />
          </div>
        </article>

        <div className="product-grid product-grid--featured">
          {featuredGrid.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      </section>

      <section className="shell section-space section-space--last">
        <div className="dual-panels">
          <article className="panel feature-panel">
            <span className="section-heading__eyebrow">So sánh</span>
            <h2>So kè giá, pin và camera trong một màn hình.</h2>
            <p>Chọn tối đa bốn máy để nhìn nhanh mẫu nào hợp ngân sách và nhu cầu hơn trước khi chốt.</p>
            <Link href="/compare" className="text-link">
              Mở so sánh
            </Link>
          </article>

          <article className="panel feature-panel">
            <span className="section-heading__eyebrow">Thu cũ</span>
            <h2>Biết ngay khoản bù để lên đời.</h2>
            <p>Nhập máy đang dùng để xem giá trị thu cũ dự kiến, rồi cân luôn số tiền cần thêm.</p>
            <Link href="/trade-in" className="text-link">
              Định giá ngay
            </Link>
          </article>
        </div>
      </section>
    </>
  )
}
