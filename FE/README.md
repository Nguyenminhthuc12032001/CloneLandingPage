# Renewed Mobile Store

Apple-inspired ecommerce app for selling used premium phones, rebuilt on `Next.js + TypeScript` with a simple MVC split.

## Scripts

- `npm run dev`: start local development
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint

## Architecture

- `src/app`: views and routes with Next App Router
- `src/models`: typed domain models and mock catalog/account data
- `src/controllers`: catalog, cart, checkout, trade-in, and account business logic
- `src/components`: reusable UI, store provider, and interactive client components
- `src/app/api`: mock API endpoints for products, trade-in, and checkout

## Main user flows

- Homepage with Apple-style merchandising and trust sections
- Product catalog with filter, sort, search, and featured collections
- Product detail pages with specs, quality notes, and add-to-cart
- Compare experience for multiple devices
- Trade-in estimator
- Cart and mock checkout flow
- Account dashboard with mock orders and service benefits
