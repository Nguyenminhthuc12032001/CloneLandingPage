# Renewed Mobile Store

Apple-inspired ecommerce app for selling used premium phones, rebuilt on `Next.js + TypeScript` with a simple MVC split.

## Scripts

- `npm run dev`: start local development
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint
- `npm run typecheck`: run TypeScript checks
- `npm run check`: run lint, typecheck, and production build

## Architecture

- `src/app`: views and routes with Next App Router
- `src/models`: typed domain models
- `src/controllers`: catalog, cart, checkout, trade-in, and account business logic
- `src/components`: reusable UI, store provider, and interactive client components
- `src/app/api`: production API endpoints for products, orders, trade-in, checkout, and admin session auth

## Production API notes

- Set `ORDER_ADMIN_TOKEN` in production to protect `/api/orders` and `/api/orders/[orderNumber]`.
- Set `DATABASE_URL` in production so products and orders use PostgreSQL instead of local file storage.
- Product data is read from the `products` table. The app does not seed products automatically.
- Admin order APIs accept `Authorization: Bearer <token>` or `x-admin-token`.
- API responses include no-store/security headers, request IDs, rate limits, and safe error messages.
- Checkout and trade-in POST endpoints require `Content-Type: application/json` and reject oversized bodies.
- Local development can use `data/orders.json` and `data/products.json`. In `NODE_ENV=production`, `DATABASE_URL` is required unless the corresponding file-storage override is explicitly enabled.

## Main user flows

- Homepage with Apple-style merchandising and trust sections
- Product catalog with filter, sort, search, and featured collections
- Product detail pages with specs, quality notes, and add-to-cart
- Compare experience for multiple devices
- Trade-in estimator
- Cart and checkout flow backed by persisted orders
- Account dashboard backed by persisted order history
