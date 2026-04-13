import { ProductCard } from '@/components/ui/ProductCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { filterProducts, parseCatalogFilters } from '@/controllers/catalogController'

type SearchParams = Record<string, string | string[] | undefined> | Promise<Record<string, string | string[] | undefined>>

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams
  const filters = parseCatalogFilters(resolvedSearchParams)
  const products = filterProducts(filters)

  return (
    <section className="shell page-shell">
      <SectionHeading
        eyebrow="Catalog"
        title="Premium used phones with clear grading and premium merchandising."
        description="Search, filter, and sort the catalog the way a modern ecommerce storefront should."
      />

      <form className="panel filter-bar" method="GET">
        <input name="search" defaultValue={filters.search} placeholder="Search model, brand, or storage" />

        <select name="brand" defaultValue={filters.brand}>
          <option value="all">All brands</option>
          <option value="Apple">Apple</option>
          <option value="Samsung">Samsung</option>
          <option value="Google">Google</option>
        </select>

        <select name="grade" defaultValue={filters.grade}>
          <option value="all">All grades</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="B+">B+</option>
        </select>

        <select name="maxPrice" defaultValue={filters.maxPrice?.toString() ?? ''}>
          <option value="">Any price</option>
          <option value="13000000">Under 13M</option>
          <option value="17000000">Under 17M</option>
          <option value="20000000">Under 20M</option>
          <option value="25000000">Under 25M</option>
        </select>

        <select name="sort" defaultValue={filters.sort}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="battery-desc">Battery health</option>
          <option value="newest">Newest launch</option>
        </select>

        <button className="button button--primary" type="submit">
          Apply
        </button>
      </form>

      <div className="page-meta">
        <span>{products.length} devices found</span>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </section>
  )
}
