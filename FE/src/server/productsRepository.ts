import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

import pg from 'pg'

import type { PhoneProduct } from '@/models/product'

const { Pool } = pg

const dataDirectory = path.join(process.cwd(), 'data')
const productsFile = path.join(dataDirectory, 'products.json')

type ProductPool = InstanceType<typeof Pool>

type ProductsRepositoryGlobal = typeof globalThis & {
  __productsPool?: ProductPool
  __productsDatabaseReady?: Promise<void>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isPhoneProduct(value: unknown): value is PhoneProduct {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.id === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.brand === 'string' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.originalPrice === 'number' &&
    typeof value.batteryHealth === 'number' &&
    typeof value.launchYear === 'number' &&
    Array.isArray(value.specs)
  )
}

function parseProducts(value: unknown): PhoneProduct[] {
  if (!Array.isArray(value) || !value.every(isPhoneProduct)) {
    throw new Error('Products storage contains invalid records.')
  }

  return value
}

function parseProduct(value: unknown): PhoneProduct {
  const parsed = typeof value === 'string' ? (JSON.parse(value) as unknown) : value

  if (!isPhoneProduct(parsed)) {
    throw new Error('Products storage contains an invalid record.')
  }

  return parsed
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() ?? ''
}

function shouldRequireDatabase() {
  return process.env.NODE_ENV === 'production' && process.env.ALLOW_FILE_PRODUCT_STORAGE !== 'true'
}

function getPool() {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    if (shouldRequireDatabase()) {
      throw new Error('DATABASE_URL is required for production product storage.')
    }

    return null
  }

  const globalStore = globalThis as ProductsRepositoryGlobal

  if (!globalStore.__productsPool) {
    globalStore.__productsPool = new Pool({
      connectionString: databaseUrl,
      max: Number.parseInt(process.env.DATABASE_POOL_MAX ?? '3', 10),
      ssl:
        process.env.DATABASE_SSL === 'false' || databaseUrl.includes('localhost')
          ? false
          : { rejectUnauthorized: false },
    })
  }

  return globalStore.__productsPool
}

async function ensureDatabase() {
  const pool = getPool()

  if (!pool) {
    return null
  }

  const globalStore = globalThis as ProductsRepositoryGlobal

  globalStore.__productsDatabaseReady ??= pool
    .query(
      `
        CREATE TABLE IF NOT EXISTS products (
          slug TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `,
    )
    .then(() => undefined)

  await globalStore.__productsDatabaseReady

  return pool
}

async function ensureStorage() {
  await mkdir(dataDirectory, { recursive: true })
}

async function readProductsFile() {
  await ensureStorage()

  try {
    const content = await readFile(productsFile, 'utf8')
    return parseProducts(JSON.parse(content) as unknown)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeFile(productsFile, '[]\n', 'utf8')
      return []
    }

    throw error
  }
}

async function writeProductsFile(products: PhoneProduct[]) {
  await ensureStorage()
  const temporaryProductsFile = path.join(dataDirectory, `products.${process.pid}.${Date.now()}.tmp.json`)

  await writeFile(temporaryProductsFile, `${JSON.stringify(products, null, 2)}\n`, 'utf8')
  await rename(temporaryProductsFile, productsFile)
}

export async function listProducts() {
  const pool = await ensureDatabase()

  if (pool) {
    const result = await pool.query<{ payload: unknown }>('SELECT payload FROM products ORDER BY slug ASC')

    return result.rows.map((row) => parseProduct(row.payload))
  }

  return readProductsFile()
}

export async function findProductBySlug(slug: string) {
  const pool = await ensureDatabase()

  if (pool) {
    const result = await pool.query<{ payload: unknown }>('SELECT payload FROM products WHERE slug = $1 LIMIT 1', [
      slug,
    ])

    return result.rows[0] ? parseProduct(result.rows[0].payload) : null
  }

  const products = await readProductsFile()

  return products.find((product) => product.slug === slug) ?? null
}

export async function saveProduct(product: PhoneProduct) {
  const pool = await ensureDatabase()

  if (pool) {
    await pool.query(
      `
        INSERT INTO products (slug, payload, updated_at)
        VALUES ($1, $2::jsonb, now())
        ON CONFLICT (slug)
        DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()
      `,
      [product.slug, JSON.stringify(product)],
    )

    return product
  }

  const products = await readProductsFile()
  await writeProductsFile([product, ...products.filter((item) => item.slug !== product.slug)])

  return product
}
