# Current Architecture Audit

## 1. Executive Summary

This document presents a comprehensive technical audit of the current e-commerce application codebase prior to commencing the complete 3D frontend redesign. It establishes the baseline boundaries between the frontend and backend, documents all technologies, dependencies, runtime constraints, and identifies technical risks associated with integrating Three.js, React Three Fiber, and motion libraries.

---

## 2. Monorepo Organization & Boundaries

The codebase is organized as an npm workspaces monorepo:
- **Root Directory (`/`)**: Workspace manager, centralized configuration files (`package.json`, `tsconfig.json`, `jest.config.js`, `docker-compose.yml`), development documentation (`AGENTS.md`, `README.md`, `docs/`).
- **`apps/api` (Backend)**: NestJS REST API application built in TypeScript.
- **`apps/web` (Frontend)**: Expo 50 / React Native Web application targeting modern web browsers while maintaining universal cross-platform code patterns.

### Strict Architectural Boundaries
- **Backend Protection:** The backend (`apps/api`), database schemas, storage repositories (JSON storage and Postgres Prisma adapter), authentication mechanisms, validation pipes, and domain DTOs are strictly out-of-scope for breaking changes or architectural redesign.
- **Frontend Target:** The complete redesign focuses entirely on `apps/web` (presentation layouts, 3D ambient canvases, design tokens, UI primitives, and user interaction layers) while preserving all data contracts with `apps/api`.

---

## 3. Technology Stack & Dependency Inventory

### Frontend (`apps/web`)
- **Framework & Runtime:** Expo `~50.0.0`, React `18.2.0`, React Native `0.73.2`, React Native Web `~0.19.10`.
- **Bundler & Tooling:** Expo CLI `0.17.13`, Metro Bundler (`@expo/metro-runtime` `~3.1.3`), Babel (`@babel/core` `^7.20.0`), TypeScript `^5.3.3`.
- **Icons & Graphics:** `lucide-react-native` `^1.66.0` powered by `react-native-svg` `^15.16.0`.
- **Static & Dynamic Assets:**
  - Standard book covers: stored under `apps/web/assets/covers/`.
  - Sample PDFs: stored under `apps/web/assets/samples/`.
  - Static 3D hero artwork: `assets/back-to-school-3d.jpg`.
- **Document Viewing:** Client-side dynamic PDF rendering using PDF.js (`v3.11.174`) via CDN script injection onto an HTML5 `<canvas>` element for page preview and rasterization.

### Backend (`apps/api`)
- **Framework:** NestJS 10 (`@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express` `^10.0.0`).
- **Language & Runtime:** TypeScript `^5.1.3`, Node.js (Node 18+ / 20+ compatible).
- **Authentication & Security:** `@nestjs/jwt` `^10.2.0`, `@nestjs/passport`, `passport-jwt`, `bcrypt` `^5.1.1`, CommonJS module format.
- **Storage Layer (Dual Adapter Repository Pattern):**
  - Configured via environment variable `DATA_STORE=json` or `DATA_STORE=postgres`.
  - JSON Storage adapter: file-based persistence under `apps/api/data/` (`articles.json`, `orders.json`, `reviews.json`, `contact-messages.json`, `packs.json`, `users.json`).
  - PostgreSQL adapter: Prisma ORM (`@prisma/client` `^5.10.2`, `prisma` `^5.10.2`).
- **Static Serving:** Statically serves `/assets` and `/uploads` directly from filesystem directories.

---

## 4. Frontend Application Architecture & Routing

Currently, `apps/web` operates as a high-performance single-page application (SPA) orchestrated in `apps/web/App.tsx`:
1. **Entry Point & Platform Initialization:**
   - Managed via `registerRootComponent(App)` from Expo.
   - Mounted inside `LanguageProvider` (`src/context/LanguageContext.tsx`) and `StoreProvider` (`src/context/StoreContext.tsx`).
2. **Layout Shell:**
   - Enclosed by `ImmersiveBackground.tsx` providing dark emerald atmospheric visuals.
   - Header (`src/components/Header.tsx`): Persistent search bar, cart item counter badge, favorites counter, order tracking launcher, contact launcher, and admin view toggle.
   - Footer (`src/components/Header.tsx` - `Footer` component): Educational links, trust badges, copyright, and payment method summaries.
3. **Storefront View vs. Admin View Switching:**
   - Storefront View:
     - Navigation category selector (`Bookshelf.tsx`): Primary education (`primary`), Middle school (`middle`), Secondary (`secondary`), Book Packs (`packs`), and Articles lookbook (`articles`).
     - Quarter filters: All quarters (`all`), Trimestre 1 (`q1`), Trimestre 2 (`q2`), Trimestre 3 (`q3`).
     - Interactive lookbook reveal hero (`BookLookbookGallery.tsx`).
     - Responsive product grid (`ProductCard.tsx`).
     - Article Lookbook showcase (`ArticleLookbookGallery.tsx`).
   - Admin View (Protected via JWT modal authentication):
     - Admin dashboard metrics (`AdminDashboard.tsx`).
     - Order status management (`OrderAdmin.tsx`).
     - Article publication CRUD (`ArticleAdmin.tsx`).
     - Educational Pack bundling CRUD (`PackAdmin.tsx`).
     - Customer reviews moderation (`ReviewAdmin.tsx`).
     - Customer contact messages management (`ContactAdmin.tsx`).
4. **Modal Overlays & Popups:**
   - `ProductDetailModal.tsx`: Comprehensive book description, pricing, discount calculations, recommendations, and sample reader trigger.
   - `BookViewer.tsx`: High-resolution canvas-based PDF sample viewer with dual-page navigation, zoom in/out, and keyboard shortcuts (ESC, Left/Right arrows).
   - `CheckoutModal.tsx`: Multi-step guest checkout with governorate selection, address validation, delivery fee calculations, and reCAPTCHA security.
   - `OrderLookupModal.tsx`: Real-time order tracking by tracking code or phone number.
   - `ContactModal.tsx`: Customer feedback and inquiry submission form.
   - `AdminLoginModal.tsx`: Secure username/password credential prompt.

---

## 5. Dependency Compatibility & 3D Integration Assessment

### Three.js & WebGL Compatibility Analysis
1. **React 18 & Three.js:**
   - `three` (`^0.160.0` - `^0.187.0`) is directly compatible with web canvas rendering.
   - React Native Web renders to standard DOM `<canvas>` elements on Web.
   - Three.js WebGLRenderer can attach directly to standard DOM canvas refs without requiring heavy native bridges.
2. **Risks & Constraints Identified:**
   - **WebGL Context Loss:** Mobile browsers or backgrounded tabs may discard WebGL contexts. Three.js scenes must handle `webglcontextlost` and `webglcontextrestored` events gracefully.
   - **Touch & Mobile Performance:** Mobile GPUs must not be overloaded by excessive polygon counts or uncached 2K/4K textures.
   - **Accessibility & Reduced Motion:** Users with `prefers-reduced-motion: reduce` enabled must receive a subtle, non-rotational or static presentation.
   - **Dual Platform Compatibility:** Native mobile builds (Expo iOS/Android) require graceful fallback when WebGL DOM elements are unavailable.

---

## 6. Build, Test, and CI/CD Verification

The repository provides the following verified commands:
- **Build Workspaces:** `npm run build` (runs `tsc --noEmit` across `apps/api` and `apps/web`).
- **Lint Workspaces:** `npm run lint` (runs TypeScript type-checking).
- **Run Tests:** `npm test` (executes Jest test suite in `apps/api` covering repository adapters, authentication, catalog controllers, and e2e integration).
- **Local Dev Server:**
  - API: `npm --workspace=apps/api run start:dev` (runs NestJS on port 3000).
  - Web: `npm --workspace=apps/web run start` (starts Expo development server on port 8081).
