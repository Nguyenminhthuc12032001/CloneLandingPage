import { phoneCatalog } from '@/models/catalog'
import type { CatalogFilters, PhoneProduct, ProductBrand, ProductGrade, ProductSort } from '@/models/product'

const allowedBrands = new Set<ProductBrand>(['Apple', 'Samsung', 'Google'])
const allowedGrades = new Set<ProductGrade>(['A+', 'A', 'B+'])
const allowedSorts = new Set<ProductSort>(['featured', 'price-asc', 'price-desc', 'battery-desc', 'newest'])

function readFirst(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

export function getAllProducts() {
  return phoneCatalog
}

export function getFeaturedProducts(limit = 4) {
  return phoneCatalog.filter((product) => product.featured).slice(0, limit)
}

export function getProductBySlug(slug: string) {
  return phoneCatalog.find((product) => product.slug === slug)
}

export function getProductsBySlugs(slugs: string[]) {
  return slugs
    .map((slug) => getProductBySlug(slug))
    .filter((product): product is PhoneProduct => Boolean(product))
}

export function getRelatedProducts(slug: string, limit = 3) {
  const product = getProductBySlug(slug)

  if (!product) {
    return getFeaturedProducts(limit)
  }

  return phoneCatalog
    .filter((item) => item.slug !== slug && (item.brand === product.brand || item.category === product.category))
    .slice(0, limit)
}

export function parseCatalogFilters(
  searchParams: Record<string, string | string[] | undefined>,
): CatalogFilters {
  const search = readFirst(searchParams.search).trim()
  const brandRaw = readFirst(searchParams.brand)
  const gradeRaw = readFirst(searchParams.grade)
  const sortRaw = readFirst(searchParams.sort)
  const maxPriceRaw = readFirst(searchParams.maxPrice)

  const brand = allowedBrands.has(brandRaw as ProductBrand) ? (brandRaw as ProductBrand) : 'all'
  const grade = allowedGrades.has(gradeRaw as ProductGrade) ? (gradeRaw as ProductGrade) : 'all'
  const sort = allowedSorts.has(sortRaw as ProductSort) ? (sortRaw as ProductSort) : 'featured'
  const parsedMaxPrice = Number.parseInt(maxPriceRaw, 10)

  return {
    search,
    brand,
    grade,
    sort,
    maxPrice: Number.isFinite(parsedMaxPrice) ? parsedMaxPrice : null,
  }
}

export function filterProducts(filters: CatalogFilters) {
  const query = filters.search.toLowerCase()

  const filtered = phoneCatalog.filter((product) => {
    const matchesSearch =
      query.length === 0 ||
      [
        product.name,
        product.brand,
        product.category,
        product.storage,
        product.color,
        product.shortDescription,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)

    const matchesBrand = filters.brand === 'all' || product.brand === filters.brand
    const matchesGrade = filters.grade === 'all' || product.grade === filters.grade
    const matchesPrice = filters.maxPrice === null || product.price <= filters.maxPrice

    return matchesSearch && matchesBrand && matchesGrade && matchesPrice
  })

  return filtered.sort((left, right) => {
    switch (filters.sort) {
      case 'price-asc':
        return left.price - right.price
      case 'price-desc':
        return right.price - left.price
      case 'battery-desc':
        return right.batteryHealth - left.batteryHealth
      case 'newest':
        return right.launchYear - left.launchYear
      case 'featured':
      default:
        if (left.featured !== right.featured) {
          return left.featured ? -1 : 1
        }

        return right.launchYear - left.launchYear
    }
  })
}
