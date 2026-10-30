# Arabic-First 3D Educational Bookstore (Tunisia)

An e-commerce platform for selling supplementary educational books and book packs in Tunisia. Features an immersive digital library experience with education-level shelves, interactive 3D book previews with sample pages, multilingual support (`ar` default RTL, `fr` LTR, `en` LTR), server-side delivery pricing engine, and a dual-storage persistence architecture (JSON files for local development and PostgreSQL via Prisma for production).

---

## 1. Project Overview & Features

- **Primary Locale & Market:** Tunisia, default currency Tunisian Dinar (TND).
- **Languages:** Arabic (`ar`, RTL default), French (`fr`, LTR), English (`en`, LTR) with dynamic language toggling and structural RTL/LTR layout mirroring.
- **Interactive 3D Library:** Desktop 3-column experience with education-level shelf on the left, book collection grid in center, and 3D page-turning sample book viewer.
- **A4 Poster Aspect Ratio:** Preserves standard A4 portrait aspect ratio (`1:1.414`) across all book covers without distortion.
- **Dual Data Store Architecture:** Interchangeable repository adapters for `DATA_STORE=json` (zero-dependency local development) and `DATA_STORE=postgres` (Prisma ORM for production) with 100% domain interface parity.
- **Server-Side Financial Security:** All item subtotals, delivery fees, discounts, and order totals are strictly recalculated and verified on the NestJS backend. Client prices and totals are never trusted.
- **Admin Dashboard & Management:** Protected admin interface for managing educational articles, book packs, orders, delivery rules, customer reviews, and contact messages.
- **Guest Checkout & reCAPTCHA:** Guest checkout supporting cash-on-delivery and manual confirmation, backed by server-side Google reCAPTCHA verification and unique order references.

---

## 2. Directory & Workspace Structure

Monorepo layout using `npm` workspaces:

```
├── apps/
│   ├── web/                     # Expo / React Native Web Frontend (@ebookshop/web)
│   │   ├── src/
│   │   │   ├── app/             # Expo Router screens/routes (catalog, cart, checkout, admin)
│   │   │   ├── components/      # UI components (Shelf 3D, Book Viewer, Cards, Dialogs)
│   │   │   ├── i18n/            # Translation JSON files (ar.json, fr.json, en.json)
│   │   │   ├── services/        # REST API services
│   │   │   └── theme/           # Design tokens, ivory/emerald palette, typography
│   │   └── app.json
│   └── api/                     # NestJS REST API Backend (@ebookshop/api)
│       ├── src/
│       │   ├── common/          # Guards, Filters, Interceptors, reCAPTCHA service
│       │   ├── modules/         # NestJS modules (auth, articles, packs, orders, reviews)
│       │   ├── repositories/    # Domain interfaces, JSON & PostgreSQL adapters
│       │   └── seed.ts          # Seed script for initial data
│       └── prisma/
│           └── schema.prisma    # PostgreSQL Prisma database schema
├── docs/                        # Architecture, Feature Checklist, and Spec
├── docker-compose.yml           # Multi-container Docker configuration
├── .env.example                 # Template environment configuration
└── package.json                 # Root monorepo workspace configuration
```

---

## 3. Prerequisites & Installation

### Prerequisites
- **Node.js:** >= 18.x
- **npm:** >= 9.x
- **Docker & Docker Compose:** (Optional, for containerized database and services)

### Setup Instructions
1. Clone the repository and install all workspace dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

3. (Optional) Initialize default uploads directory:
   ```bash
   mkdir -p apps/api/uploads
   ```

---

## 4. Development & Running the Application

### Local Mode (JSON Data Store)
No database installation is required when running in JSON mode (`DATA_STORE=json`).

```bash
# Start NestJS API Backend (Runs on http://localhost:3000)
npm run api

# In a separate terminal, start Expo Web Frontend
npm run web
```

### PostgreSQL Mode
To run with PostgreSQL database persistence:

1. Update `.env`:
   ```env
   DATA_STORE=postgres
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ebookshop?schema=public"
   ```

2. Generate Prisma Client, push database schema, and seed initial data:
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

3. Start backend and web apps:
   ```bash
   npm run api
   npm run web
   ```

---

## 5. Docker Compose Deployment

The monorepo includes a complete `docker-compose.yml` orchestrating PostgreSQL, NestJS API, and Expo Web static frontend.

To spin up all services:

```bash
docker compose up --build
```

### Containerized Services:
- **`db` (PostgreSQL 15):** Exposed on `localhost:5432`. Health checked prior to API startup.
- **`api` (NestJS REST API):** Exposed on `http://localhost:3000`. Automatically applies database migrations and seeds initial data when running in `DATA_STORE=postgres` mode.
- **`web` (Nginx + Expo Web Build):** Exposed on `http://localhost:8080`. Serves the pre-compiled static Expo web application.

---

## 6. Build, Test, and Seed Commands

Execute commands from the repository root:

- **Build all workspace packages:**
  ```bash
  npm run build
  ```

- **Run Typecheck & Lint across all workspaces:**
  ```bash
  npm run lint
  ```

- **Run all automated test suites:**
  ```bash
  npm test
  ```
  *(Runs 6 test suites covering end-to-end integration journeys, adapter parity, orders, reviews, contact, auth, and dashboard metrics).*

- **Seed Database & JSON Data:**
  ```bash
  npm --workspace=apps/api run seed
  ```

---

## 7. Development Admin Setup & API Documentation

### Development Administrator Account
The seed script initializes a default system administrator account:
- **Email:** `admin@ebookshop.tn`
- **Password:** `admin123`

### OpenAPI / Swagger Documentation
Interactive API documentation is generated via NestJS Swagger and available at:
```
http://localhost:3000/api/docs
```

Endpoints include:
- `POST /api/v1/auth/login` - Admin authentication
- `GET /api/v1/articles` - Public article catalog with search & filters
- `GET /api/v1/education-levels` - Education level listing
- `GET /api/v1/packs` - Educational article packs
- `POST /api/v1/orders` - Guest order creation with reCAPTCHA token
- `POST /api/v1/orders/lookup` - Secure guest order lookup by reference & phone
- `GET/POST /api/v1/admin/*` - Protected admin endpoints (articles, packs, orders, delivery rules, reviews, contact messages, dashboard metrics)

---

## 8. Web and Mobile (Android / iOS) Build Instructions

### Web Production Export
To generate the static web distribution:
```bash
cd apps/web
npx expo export --platform web
```
Output static assets are generated under `apps/web/dist/`.

### Mobile Builds (Android & iOS)
The frontend application uses Expo / React Native and supports native mobile platforms.

- **Android Development Build:**
  ```bash
  cd apps/web
  npx expo run:android
  ```

- **iOS Development Build:** (macOS required)
  ```bash
  cd apps/web
  npx expo run:ios
  ```

- **EAS Cloud Build:**
  ```bash
  cd apps/web
  npx eas build --platform android
  npx eas build --platform ios
  ```

*Note:* If 3D WebGL context is unavailable on low-end mobile devices, the book preview viewer automatically falls back to an interactive 2D touch-swiping page spread.

---

## 9. Media Storage & Backups

### Local Storage Abstraction
Uploaded poster artwork and sample PDF preview files are handled via storage abstractions:
- Local uploads are saved to directory specified by `UPLOAD_DIR` (`apps/api/uploads/`).
- File metadata (filename, size, mimetype, relative path) is stored in the database or JSON store. Raw binary files are **never** stored inside database columns or JSON records.

### Backup Guidelines
- **PostgreSQL Database Backup:**
  ```bash
  docker exec ebookshop-db pg_dump -U postgres ebookshop > backup.sql
  ```
- **Media Asset Backup:**
  Backup the `apps/api/uploads/` directory alongside database snapshots.

---

## 10. Security & Business Logic Best Practices

1. **Server-Side Financial Recalculation:** Subtotal, delivery fee rule matching, discounts, and order totals are computed exclusively on the server.
2. **Google reCAPTCHA Verification:** Guest orders require server-side token validation (can be toggled via `RECAPTCHA_ENABLED=false` during development).
3. **Admin Security:** Administrator endpoints require JWT authentication. Public user registration never assigns administrator privileges.
4. **Order Status Rules:** Supported statuses are `pending`, `in_progress`, `delivered`, and `rejected`. Rejection requires an explicit rejection reason.
5. **No Online Payment Gateway:** In accordance with Tunisia market MVP requirements, payment options are Cash on Delivery and Manual Confirmation. Payment status remains distinct from order fulfillment status.

---

## 11. Known Limitations & Roadmap

- **Customer Accounts:** Guest checkout is supported; customer registration & saved account order history is planned for a future phase.
- **Online Gateway Integration:** Online card/mobile payments are out of scope for MVP; architecture remains extensible for payment gateways.
