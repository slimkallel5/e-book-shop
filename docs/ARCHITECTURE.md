# System Architecture & Technical Specifications

## 1. Monorepo Overview & Directory Structure

The project is structured as an npm workspace monorepo separating frontend presentation, backend REST API, and domain logic.

```
.
├── AGENTS.md
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FEATURE_CHECKLIST.md
│   └── PROJECT_SPEC.md
├── package.json
├── .env.example
├── .gitignore
├── apps/
│   ├── web/                     # Frontend Application (Expo / React Native Web)
│   │   ├── package.json
│   │   ├── app.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── app/             # Expo Router screens/routes
│   │   │   ├── components/      # UI Design System, Shelf 3D, Book Viewer
│   │   │   ├── i18n/            # Locales (ar.json, fr.json, en.json)
│   │   │   ├── services/        # API client services
│   │   │   └── theme/           # Tokens (colors, typography, A4 ratios)
│   └── api/                     # Backend Application (NestJS API)
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── modules/         # NestJS Feature Modules (articles, orders, etc.)
│       │   ├── repositories/    # Interfaces & Adapters (JSON & PostgreSQL)
│       │   ├── common/          # Filters, Interceptors, Guard, reCAPTCHA
│       │   └── main.ts
```

---

## 2. Storage Layer & Dual Repository Adapters

To fulfill MVP requirements, all data persistence operations are decoupled through domain repository interfaces.

### Dual Adapter Implementation:
1. **JSON Storage Adapter (`DATA_STORE=json`):**
   - Stores entities in readable JSON files under `apps/api/data/`.
   - Used for rapid local development, demonstration, and isolated offline testing.
   - Strictly handles non-binary metadata; file uploads write to local disk (`uploads/`) with paths stored in JSON.
2. **PostgreSQL Storage Adapter (`DATA_STORE=postgres`):**
   - Powered by Prisma ORM for schema migration and query generation.
   - Used for persistent staging and production environments.
   - Enforces relational constraints, foreign keys, decimal precision for monetary fields, and ACID transaction guarantees.

Both adapters implement exact parity across domain methods (e.g., `ArticleRepository`, `OrderRepository`, `DeliveryRuleRepository`).

---

## 3. Dependency Compatibility & Technology Assessment

| Capability | Web Implementation | Native (iOS / Android) Implementation | Fallback / Risk Mitigation |
| :--- | :--- | :--- | :--- |
| **Interactive 3D Shelf & Book Viewer** | Three.js / React Three Fiber / CSS 3D / Reanimated | React Native Reanimated / Native Gesture Handler | Provide flat 2D page spread with touch gesture swiping if 3D context is unsupported |
| **PDF Sample Preview** | PDF.js web viewer | Pre-rendered JPEG/PNG page slides rendered on server | Fall back to page image thumbnails if native PDF rendering is blocked |
| **Multilingual RTL Layout** | Document direction (`dir="rtl"`), CSS logical properties | `I18nManager.forceRTL(true)`, Expo RTL configuration | Dynamic language toggle without full page reload; mirror directional icons |
| **Guest CAPTCHA Verification** | Google reCAPTCHA v2 / v3 Web Widget | Server-side verification of reCAPTCHA response token | Dev test-mode token strictly disallowed in production environment |

---

## 4. Security, Pricing & Business Logic Rules

1. **Server-Side Financial Revalidation:**
   - Client basket prices are strictly advisory.
   - Order endpoint recalculates subtotal, applies applicable delivery rule based on subtotal threshold, validates stock levels, and computes the verified final total in TND.
2. **Order & Status Management:**
   - Initial status: `pending`.
   - Status transitions: `pending` → `in_progress` → `delivered` or `rejected`.
   - Rejection requires an explicit reason string.
   - Payment status and fulfillment status remain separate records.
3. **Admin Security & Authentication:**
   - JWT authentication for protected routes under `/api/v1/admin/*`.
   - Password hashing with bcrypt.
   - Public user registration never assigns administrator roles.
