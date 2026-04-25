import Link from 'next/link'

import { filterProductList, getAllProducts, parseCatalogFilters } from '@/controllers/catalogController'
import { formatCurrency, formatRating } from '@/lib/format'
import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'

type SearchParams =
  | Record<string, string | string[] | undefined>
  | Promise<Record<string, string | string[] | undefined>>

export const dynamic = 'force-dynamic'

function readFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

function buildProductsHref(
  searchParams: Record<string, string | string[] | undefined>,
  updates: Record<string, string | null>,
) {
  const params = new URLSearchParams()

  Object.entries(searchParams).forEach(([key, value]) => {
    const current = readFirst(value)

    if (current) {
      params.set(key, current)
    }
  })

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      params.delete(key)
      return
    }

    params.set(key, value)
  })

  const query = params.toString()
  return query ? `/products?${query}` : '/products'
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams
  const filters = parseCatalogFilters(resolvedSearchParams)
  const catalog = await getAllProducts()
  const products = filterProductList(catalog, filters)
  const averageBattery = catalog.length
    ? Math.round(catalog.reduce((total, product) => total + product.batteryHealth, 0) / catalog.length)
    : 0
  const averageRating = catalog.length
    ? catalog.reduce((total, product) => total + product.rating, 0) / catalog.length
    : 0
  const readyToShipCount = catalog.filter((product) => product.stockLabel === 'Sẵn hàng').length
  const highBatteryCount = catalog.filter((product) => product.batteryHealth >= 90).length
  const topTradeIn = catalog.length ? Math.max(...catalog.map((product) => product.maxTradeIn)) : 0
  const activeFilters = [
    filters.search
      ? { label: `Tìm kiếm: ${filters.search}`, clearHref: buildProductsHref(resolvedSearchParams, { search: null }) }
      : null,
    filters.brand !== 'all'
      ? { label: `Hãng: ${filters.brand}`, clearHref: buildProductsHref(resolvedSearchParams, { brand: null }) }
      : null,
    filters.grade !== 'all'
      ? { label: `Tình trạng: ${filters.grade}`, clearHref: buildProductsHref(resolvedSearchParams, { grade: null }) }
      : null,
    filters.maxPrice !== null
      ? {
          label: `Giá dưới ${Math.round(filters.maxPrice / 1000000)} triệu`,
          clearHref: buildProductsHref(resolvedSearchParams, { maxPrice: null }),
        }
      : null,
    filters.sort !== 'featured'
      ? { label: `Sắp xếp: ${filters.sort}`, clearHref: buildProductsHref(resolvedSearchParams, { sort: null }) }
      : null,
  ].filter((filter): filter is { label: string; clearHref: string } => Boolean(filter))

  const curatedPaths = [
    {
      eyebrow: 'Giá tốt',
      title: 'Máy dưới 13 triệu',
      description: 'Phân khúc dễ chốt cho người cần iPhone ổn định với chi phí vừa tầm.',
      count: catalog.filter((product) => product.price <= 13000000).length,
      href: '/products?maxPrice=13000000&sort=price-asc',
    },
    {
      eyebrow: 'Pin cao',
      title: 'Máy pin từ 90% trở lên',
      description: 'Ưu tiên nhóm máy còn pin đẹp để dùng bền và yên tâm hơn khi mua máy cũ.',
      count: highBatteryCount,
      href: '/products?sort=battery-desc',
    },
    {
      eyebrow: 'Android',
      title: 'Máy Android cao cấp',
      description: 'Samsung và Pixel cho người cần flagship mạnh, AI mới và camera tốt ngoài hệ sinh thái Apple.',
      count: catalog.filter((product) => product.brand !== 'Apple').length,
      href: '/products?brand=Samsung&sort=featured',
    },
  ]

  const catalogStats = [
    {
      label: 'Máy sẵn hàng',
      value: `${readyToShipCount}/${catalog.length} thiết bị`,
      detail: 'Nhóm có thể chốt đơn nhanh và giao sớm.',
    },
    {
      label: 'Pin trung bình',
      value: `${averageBattery}%`,
      detail: `${highBatteryCount} máy đang từ 90% pin trở lên.`,
    },
    {
      label: 'Đánh giá chung',
      value: `${formatRating(averageRating)} / 5`,
      detail: 'Tổng hợp từ đánh giá hiển thị trong danh mục.',
    },
    {
      label: 'Thu cũ tối đa',
      value: formatCurrency(topTradeIn),
      detail: 'Giúp cân nhanh khoản bù khi muốn lên đời.',
    },
  ]

  const assistLinks = [
    {
      label: 'Cần so sánh song song',
      detail: 'Mở so sánh để đặt pin, camera và giá cạnh nhau.',
      href: '/compare',
    },
    {
      label: 'Đang có máy cũ',
      detail: 'Định giá nhanh để biết số tiền thật sự cần thêm.',
      href: '/trade-in',
    },
  ]

  return (
    <section className="shell page-shell">
      <div className="catalog-hero panel">
        <div className="catalog-hero__main">
          <SectionHeading
            eyebrow="Điện thoại"
            title="Lọc nhanh máy đẹp, pin cao và giá hợp túi tiền."
            description="Danh mục ưu tiên đúng cách người mua hay nhìn trên thị trường Việt Nam: giá tốt, tình trạng máy, pin, bảo hành và hỗ trợ thu cũ."
          />

          <div className="catalog-hero__stats">
            {catalogStats.map((stat) => (
              <article className="catalog-stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.detail}</small>
              </article>
            ))}
          </div>
        </div>

        <aside className="catalog-hero__aside" aria-label="Lối vào nhanh theo nhu cầu">
          <span className="section-heading__eyebrow">Đi nhanh theo nhu cầu</span>
          <div className="catalog-jump-list">
            {curatedPaths.map((collection) => (
              <Link href={collection.href} className="catalog-jump" key={collection.title}>
                <span>{collection.eyebrow}</span>
                <strong>{collection.title}</strong>
                <small>{collection.description}</small>
                <b>{collection.count} sản phẩm</b>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <div className="catalog-filter-layout">
        <div className="panel filter-bar__intro-panel">
          <div className="filter-bar__intro">
            <span className="section-heading__eyebrow">Bộ lọc nhanh</span>
            <strong id="catalog-filter-title">Chọn đúng máy theo hãng, pin và ngân sách.</strong>
            <p id="catalog-filter-help">
              Tìm theo tên máy, thương hiệu, tình trạng, mức giá và cách sắp xếp phù hợp nhu cầu.
            </p>
          </div>
        </div>

        <form
          className="panel filter-bar filter-bar--catalog"
          method="GET"
          role="search"
          aria-labelledby="catalog-filter-title"
          aria-describedby="catalog-filter-help"
        >
          <div className="filter-bar__controls">
            <label className="filter-field filter-field--search">
              <span>Từ khóa</span>
              <input
                type="search"
                name="search"
                defaultValue={filters.search}
                placeholder="Ví dụ: iPhone 15, Galaxy S24, 256GB"
              />
            </label>

            <label className="filter-field">
              <span>Hãng</span>
              <select name="brand" defaultValue={filters.brand}>
                <option value="all">Tất cả hãng</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Google">Google</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Tình trạng</span>
              <select name="grade" defaultValue={filters.grade}>
                <option value="all">Tất cả mức tình trạng</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Ngân sách</span>
              <select name="maxPrice" defaultValue={filters.maxPrice?.toString() ?? ''}>
                <option value="">Mọi mức giá</option>
                <option value="13000000">Dưới 13 triệu</option>
                <option value="17000000">Dưới 17 triệu</option>
                <option value="20000000">Dưới 20 triệu</option>
                <option value="25000000">Dưới 25 triệu</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Sắp xếp</span>
              <select name="sort" defaultValue={filters.sort}>
                <option value="featured">Nổi bật</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="battery-desc">Pin tốt nhất</option>
                <option value="newest">Đời mới nhất</option>
              </select>
            </label>

            <div className="filter-bar__actions">
              <button className="button button--primary" type="submit">
                Áp dụng
              </button>
              {activeFilters.length > 0 ? (
                <Link href="/products" className="button button--ghost">
                  Xóa bộ lọc
                </Link>
              ) : null}
            </div>
          </div>
        </form>
      </div>

      <div className="page-meta page-meta--catalog">
        <div className="page-meta__summary">
          <strong>Tìm thấy {products.length} máy phù hợp</strong>
          <span>
            {activeFilters.length > 0
              ? `Danh mục đang được thu hẹp theo ${activeFilters.length} tiêu chí để bạn chốt máy nhanh hơn.`
              : 'Chưa áp bộ lọc nào, danh mục đang ưu tiên các mẫu dễ chọn và giá tốt để bạn bắt đầu.'}
          </span>
        </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="filter-chip-row">
          {activeFilters.map((filter) => (
            <Link href={filter.clearHref} className="filter-chip" key={filter.label}>
              {filter.label}
            </Link>
          ))}
        </div>
      ) : (
        <div className="catalog-hint-row">
          {assistLinks.map((link) => (
            <Link href={link.href} className="catalog-hint" key={link.label}>
              <strong>{link.label}</strong>
              <span>{link.detail}</span>
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="empty-state empty-state--panel panel">
          <h1>Chưa có máy nào khớp với bộ lọc này.</h1>
          <p>Hãy nới bớt điều kiện tìm kiếm hoặc đi nhanh vào một nhóm gợi ý ở phía trên.</p>
          <div className="hero-actions">
            <Link href="/products" className="button button--primary">
              Xem lại toàn bộ máy
            </Link>
            <Link href="/trade-in" className="button button--ghost">
              Định giá máy cũ
            </Link>
          </div>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      )}
    </section>
  )
}
