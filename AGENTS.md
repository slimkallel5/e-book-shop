# AGENTS.md - Developer and Agent Guidelines

This repository contains the **Arabic-First 3D Educational Bookstore**, an e-commerce platform for selling supplementary educational books and book packs in Tunisia.

---

## 1. Project Overview & Context

- **Target Market:** Tunisia
- **Default Language:** Arabic (`ar`, RTL)
- **Supported Languages:** Arabic (`ar`, RTL), French (`fr`, LTR), English (`en`, LTR)
- **Default Currency:** Tunisian Dinar (TND)
- **Architecture:** Monorepo using npm workspaces:
  - `apps/web`: Frontend application (Expo / React Native Web)
  - `apps/api`: Backend REST API (NestJS, TypeScript)

---

## 2. General Development & Coding Conventions

1. **TypeScript Strict Mode:** Enable strict type-checking across all packages. Avoid `any` types; prefer explicit interfaces and types.
2. **Naming Conventions:**
   - Files and directories: `kebab-case` (e.g., `book-card.tsx`, `order-repository.ts`).
   - Components & Classes: `PascalCase` (e.g., `BookCard`, `OrderService`).
   - Variables & Functions: `camelCase` (e.g., `calculateTotal`, `deliveryFee`).
   - Constants & Enums: `UPPER_SNAKE_CASE` (e.g., `ORDER_STATUS`, `DEFAULT_LOCALE`).
3. **Immutability & Pure Functions:** Maintain pure domain logic where feasible.
4. **Code Structure:**
   - Frontend (`apps/web`): Shared UI components, theme design tokens, localized assets, screens/routes.
   - Backend (`apps/api`): NestJS modules, controllers, services, repositories (JSON & PostgreSQL adapters), entities/DTOs.

---

## 3. Localization & Layout Constraints (Arabic / RTL)

1. **RTL First:** Arabic is the default locale and requires true structural right-to-left layout behavior, not just right-aligned text.
2. **Translation Keys:** All visible text must be localized via translation files (`ar.json`, `fr.json`, `en.json`). Do not hardcode user-facing text strings in components.
3. **Directional Elements:** Flip directional icons, drawers, navigation menus, and layout flex directions according to the active locale (`isRTL`).
4. **Cover Posters:** Preserve the standard A4 portrait aspect ratio (`1:1.414`) for book cover images without distortion.

---

## 4. Architectural Constraints & Repository Pattern

1. **Dual Storage Repository Adapters:**
   - Both `JSON` storage (for local development/demonstrations) and `PostgreSQL` storage (for production persistence) must implement identical domain repository interfaces.
   - Data adapter selection is controlled strictly via environment configuration (`DATA_STORE=json` or `DATA_STORE=postgres`).
2. **Server-Side Price Validation:**
   - Never trust prices, discounts, stock, or totals submitted by the client.
   - All subtotals, delivery fees (via dynamic delivery rules), discounts, and final totals are recalculated and verified on the server.
   - Monetary values must use exact decimal calculations to avoid rounding inaccuracies.
3. **Order Statuses & Security:**
   - Order statuses: `pending`, `in_progress`, `delivered`, `rejected`. Rejections require a mandatory rejection reason.
   - Guest checkout requires server-side Google reCAPTCHA verification.
   - Public registration must NEVER grant administrator privileges. Admin endpoints require authentication and role-based authorization.

---

## 5. Dependency Compatibility & 3D / PDF Guidelines

1. **3D Animation Viewer:**
   - Web uses Three.js / React Three Fiber / CSS 3D / Reanimated for interactive book opening and shelf selection.
   - Native builds must handle fallbacks gracefully without breaking touch interactions.
2. **PDF Preview:**
   - PDF.js on web renders permitted sample pages.
   - Never store raw binary files inside database JSON records; store metadata and serve files via media storage abstractions.

---

## 6. Testing, Verification, and Build Commands

Run commands from the repository root:

- **Install Dependencies:** `npm install`
- **Build All Workspaces:** `npm run build`
- **Lint All Workspaces:** `npm run lint`
- **Run Unit & Integration Tests:** `npm test`
- **Run API (Dev Mode):** `npm --workspace=apps/api run start:dev`
- **Run Web (Dev Mode):** `npm --workspace=apps/web run start`
