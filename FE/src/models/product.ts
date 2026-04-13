export type ProductBrand = 'Apple' | 'Samsung' | 'Google'
export type ProductGrade = 'A+' | 'A' | 'B+'
export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'battery-desc' | 'newest'

export interface ProductSpec {
  label: string
  value: string
}

export interface PhoneProduct {
  id: string
  slug: string
  brand: ProductBrand
  name: string
  heroTitle: string
  shortDescription: string
  longDescription: string
  category: string
  storage: string
  color: string
  grade: ProductGrade
  batteryHealth: number
  launchYear: number
  price: number
  originalPrice: number
  monthlyPrice: number
  rating: number
  reviewCount: number
  featured: boolean
  badge: string
  finish: string
  display: string
  chipset: string
  camera: string
  warranty: string
  stockLabel: string
  maxTradeIn: number
  gradient: string
  accessories: string[]
  summaryBullets: string[]
  highlightBullets: string[]
  specs: ProductSpec[]
}

export interface CatalogFilters {
  search: string
  brand: 'all' | ProductBrand
  grade: 'all' | ProductGrade
  sort: ProductSort
  maxPrice: number | null
}

export interface CartLine {
  slug: string
  quantity: number
}

export interface EnrichedCartLine {
  product: PhoneProduct
  quantity: number
  lineTotal: number
}
