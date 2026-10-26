# Feature Checklist and Sequential Implementation Matrix

This checklist tracks completion of features and acceptance criteria outlined in `docs/PROJECT_SPEC.md`.

---

## Task 1 — Repository Analysis, Architecture & Setup
- [x] Analyze project requirements, initial specification, and target environment (Tunisia, `ar` default RTL).
- [x] Document system architecture and dual storage repository strategy (`docs/ARCHITECTURE.md`).
- [x] Perform dependency compatibility assessment (3D animation, PDF previews, RTL support).
- [x] Create `AGENTS.md` with guidelines, coding conventions, constraints, and testing commands.
- [x] Establish minimal npm workspace monorepo layout (`apps/web`, `apps/api`).

---

## Task 2 — Design System & Multilingual Layout
- [ ] Implement design tokens (colors, ivory background, emerald primary, oak wood textures, typography).
- [ ] Implement localization files (`ar.json`, `fr.json`, `en.json`) with Arabic as default.
- [ ] Support dynamic language switching and true structural RTL/LTR layout mirroring.
- [ ] Create reusable UI controls (buttons, inputs, cards, badges, modal dialogs).
- [ ] Preserve A4 portrait cover image ratio (`1:1.414`) across all book components.

---

## Task 3 — Interactive 3D Library & Book Viewer
- [ ] Build desktop 3-column interactive library experience (left: education-level shelf, center: book grid, right/modal: book details).
- [ ] Implement realistic 3D book-opening interaction with page-turn animation.
- [ ] Support Arabic RTL right-to-left page turning and French/English LTR page turning.
- [ ] Provide touch swiping for mobile layouts and keyboard navigation controls.
- [ ] Include reduced-motion and lower-performance fallback views.

---

## Task 4 — Backend, Database & JSON Dual Storage
- [ ] Implement NestJS REST API framework with OpenAPI / Swagger documentation.
- [ ] Configure PostgreSQL database schema, migrations, and seed scripts using Prisma.
- [ ] Implement JSON file-based repository adapter for offline/local development.
- [ ] Guarantee 100% domain interface parity between JSON and PostgreSQL repository adapters.
- [ ] Add seed data for Tunisian education levels, sample Arabic/French books, and packs.

---

## Task 5 — Article & Pack Management (Admin)
- [ ] Build Admin CRUD interface for educational articles/books.
- [ ] Build Admin CRUD interface for article packs.
- [ ] Implement server-side poster image (A4 ratio validation) and sample PDF file uploads.
- [ ] Validate prices, discounts, quarter attributes, and active/inactive statuses.
- [ ] Ensure file metadata is safely persisted and uploaded media is served via storage abstractions.

---

## Task 6 — Secure Admin Authentication & Dashboard
- [ ] Implement secure JWT authentication and password hashing for admin users.
- [ ] Protect administrative API routes (`/api/v1/admin/*`) with server-side role guards.
- [ ] Create Admin Dashboard displaying total articles, packs, order metrics, date filters, and low-stock alerts.
- [ ] Ensure guest registration can never grant administrative privileges.

---

## Task 7 — Basket, Favourites & Product Details
- [ ] Connect storefront UI to live REST API endpoints.
- [ ] Implement guest basket state, quantity adjustments, and subtotal calculations.
- [ ] Implement favourites persistence.
- [ ] Implement product and pack detail views with related items and pack content breakdowns.
- [ ] Enforce server-side stock and availability checks.

---

## Task 8 — Checkout, Delivery Pricing Engine & Order Creation
- [ ] Implement guest checkout form for Tunisian delivery addresses (name, phone, city, address, instructions).
- [ ] Implement dynamic delivery pricing engine based on order subtotal rules.
- [ ] Integrate server-side Google reCAPTCHA verification for order submissions.
- [ ] Recalculate all totals, discounts, and delivery fees on the server.
- [ ] Save order snapshots (applied pricing, item snapshots, initial `pending` status).
- [ ] Generate unique order reference and guest order lookup view.

---

## Task 9 — Order Management, Reviews & Contact Form
- [ ] Implement Admin Order Management (status transitions: pending, in_progress, delivered, rejected).
- [ ] Enforce mandatory rejection reasons when rejecting an order.
- [ ] Implement 1–5 star article and store reviews with admin moderation controls.
- [ ] Implement localized Contact Us form with persistent request storage.

---

## Task 10 — End-to-End Integration & Regression Testing
- [ ] Audit and run end-to-end user journeys (storefront browsing → 3D preview → checkout → admin management).
- [ ] Run repository adapter parity tests (JSON vs PostgreSQL).
- [ ] Verify error handling, edge cases, and security authorization boundaries.

---

## Task 11 — Visual QA, Accessibility & Performance Pass
- [ ] Verify Arabic typography shaping, mixed RTL/LTR phone numbers, and price formatting in TND.
- [ ] Test screen responsive widths across desktop, tablet, and mobile screens without horizontal overflow.
- [ ] Verify keyboard accessibility, focus indicators, and reduced motion modes.

---

## Task 12 — Final Documentation, Deployment & Handover
- [ ] Configure Docker Compose setup for database and API services.
- [ ] Write deployment, seed, build, and test instructions in `README.md`.
- [ ] Document OpenAPI Swagger specifications and environment variables.
