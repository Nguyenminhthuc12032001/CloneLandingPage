import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'

import pg from 'pg'

import type { StoredOrder } from '@/models/order'

const { Pool } = pg

const dataDirectory = path.join(process.cwd(), 'data')
const ordersFile = path.join(dataDirectory, 'orders.json')

let writeQueue = Promise.resolve()

type OrderPool = InstanceType<typeof Pool>

type OrdersRepositoryGlobal = typeof globalThis & {
  __ordersPool?: OrderPool
  __ordersDatabaseReady?: Promise<void>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isStoredOrder(value: unknown): value is StoredOrder {
  if (!isRecord(value)) {
    return false
  }

  return (
    typeof value.orderNumber === 'string' &&
    typeof value.status === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string' &&
    typeof value.eta === 'string' &&
    isRecord(value.totals) &&
    isRecord(value.customer) &&
    Array.isArray(value.items)
  )
}

function parseStoredOrders(value: unknown): StoredOrder[] {
  if (!Array.isArray(value)) {
    throw new Error('Orders storage is corrupted.')
  }

  if (!value.every(isStoredOrder)) {
    throw new Error('Orders storage contains invalid records.')
  }

  return value
}

function parseStoredOrder(value: unknown): StoredOrder {
  const parsed = typeof value === 'string' ? (JSON.parse(value) as unknown) : value

  if (!isStoredOrder(parsed)) {
    throw new Error('Orders storage contains an invalid record.')
  }

  return parsed
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim() ?? ''
}

function shouldRequireDatabase() {
  return process.env.NODE_ENV === 'production' && process.env.ALLOW_FILE_ORDER_STORAGE !== 'true'
}

function getPool() {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    if (shouldRequireDatabase()) {
      throw new Error('DATABASE_URL is required for production order storage.')
    }

    return null
  }

  const globalStore = globalThis as OrdersRepositoryGlobal

  if (!globalStore.__ordersPool) {
    globalStore.__ordersPool = new Pool({
      connectionString: databaseUrl,
      max: Number.parseInt(process.env.DATABASE_POOL_MAX ?? '3', 10),
      ssl:
        process.env.DATABASE_SSL === 'false' || databaseUrl.includes('localhost')
          ? false
          : { rejectUnauthorized: false },
    })
  }

  return globalStore.__ordersPool
}

async function ensureDatabase() {
  const pool = getPool()

  if (!pool) {
    return null
  }

  const globalStore = globalThis as OrdersRepositoryGlobal

  globalStore.__ordersDatabaseReady ??= pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      order_number TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `).then(() => undefined)

  await globalStore.__ordersDatabaseReady

  return pool
}

function parseDate(value: string) {
  const time = Date.parse(value)

  return Number.isFinite(time) ? new Date(time) : new Date()
}

async function ensureStorage() {
  await mkdir(dataDirectory, { recursive: true })
}

async function readOrdersFile(): Promise<StoredOrder[]> {
  await ensureStorage()

  try {
    const content = await readFile(ordersFile, 'utf8')
    const parsed = JSON.parse(content) as unknown

    return parseStoredOrders(parsed)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      await writeFile(ordersFile, '[]', 'utf8')
      return []
    }

    throw error
  }
}

async function writeOrdersFile(orders: StoredOrder[]) {
  await ensureStorage()
  const temporaryOrdersFile = path.join(dataDirectory, `orders.${process.pid}.${Date.now()}.tmp.json`)

  await writeFile(temporaryOrdersFile, `${JSON.stringify(orders, null, 2)}\n`, 'utf8')
  await rename(temporaryOrdersFile, ordersFile)
}

export async function listOrders() {
  const pool = await ensureDatabase()

  if (pool) {
    const result = await pool.query<{ payload: unknown }>(
      'SELECT payload FROM orders ORDER BY created_at DESC',
    )

    return result.rows.map((row) => parseStoredOrder(row.payload))
  }

  const orders = await readOrdersFile()

  return [...orders].sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
}

export async function findOrderByNumber(orderNumber: string) {
  const pool = await ensureDatabase()

  if (pool) {
    const result = await pool.query<{ payload: unknown }>(
      'SELECT payload FROM orders WHERE order_number = $1 LIMIT 1',
      [orderNumber],
    )

    return result.rows[0] ? parseStoredOrder(result.rows[0].payload) : null
  }

  const orders = await readOrdersFile()

  return orders.find((order) => order.orderNumber === orderNumber) ?? null
}

export async function saveOrder(order: StoredOrder) {
  const pool = await ensureDatabase()

  if (pool) {
    await pool.query(
      `
        INSERT INTO orders (order_number, payload, created_at, updated_at)
        VALUES ($1, $2::jsonb, $3, $4)
        ON CONFLICT (order_number)
        DO UPDATE SET
          payload = EXCLUDED.payload,
          updated_at = EXCLUDED.updated_at
      `,
      [order.orderNumber, JSON.stringify(order), parseDate(order.createdAt), parseDate(order.updatedAt)],
    )

    return order
  }

  const task = writeQueue.catch(() => undefined).then(async () => {
    const orders = await readOrdersFile()
    const nextOrders = [order, ...orders.filter((item) => item.orderNumber !== order.orderNumber)]

    await writeOrdersFile(nextOrders)

    return order
  })

  writeQueue = task.then(
    () => undefined,
    () => undefined,
  )

  return task
}
