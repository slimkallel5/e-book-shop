# Arabic-First 3D Educational Bookstore
## Project Specification and Jules Implementation Plan

**Document purpose:** Single source of truth for product requirements, architecture, UI/UX, MVP acceptance criteria, and the sequential tasks assigned to Jules.

**Reference website:** https://my-new-app-913719.onhercules.app/

**Initial market:** Tunisia  
**Default language:** Arabic (`ar`, RTL)  
**Other languages:** French (`fr`) and English (`en`)  
**Default currency:** Tunisian dinar (TND)

---

# 1. Product Vision

Build a modern, multilingual educational e-commerce platform for selling supplementary educational books and book packs. The key differentiator is an immersive digital library: education levels appear as books on a shelf, selecting a level reveals its books, and selecting a book opens a realistic interactive preview of sample pages.

The product combines:
- A premium, immersive library experience.
- A practical, fast e-commerce storefront.
- A protected administration dashboard.
- A backend with JSON-based local development storage and PostgreSQL persistence.
- Shared business logic and a responsive experience across web and mobile.

The result must be a working MVP, not merely a static landing page or visual mockup.

## 1.1 Reference-site review

Before designing the final experience, inspect the reference website and document:
- Its visual style and layout.
- The library and education-level navigation.
- Book selection and preview interactions.
- Animation and page-turn behavior.
- Mobile responsiveness and navigation.
- Useful interaction patterns worth improving.

Use the reference as inspiration for the core library experience. Create a more modern, accessible, polished, and responsive implementation. Do not copy protected assets or implementation code without permission.

If the reference site cannot be accessed, record that limitation and proceed using the requirements in this document. Do not claim to have inspected elements that were not accessible.

---

# 2. Confirmed Business Decisions

These decisions are part of the MVP requirements and must not be silently replaced with different assumptions.

## 2.1 Market and localization

- The initial market is Tunisia.
- Arabic is the default language and must use a complete right-to-left (RTL) layout.
- French and English must also be fully supported with left-to-right (LTR) layouts.
- Prices are displayed in Tunisian dinars (TND).
- Address forms must support Tunisian delivery details: customer name, phone number, city/locality, street address, and optional delivery instructions.
- Phone validation must accommodate Tunisian numbers.
- Delivery rules are configurable by the administrator.
- Prices, discounts, stock checks, delivery fees, and order totals are recalculated and validated on the server.
- Keep the model extensible for future countries, currencies, and delivery configurations.
- Do not hardcode delivery fees or business rules throughout the frontend.

## 2.2 Initial order fulfillment and payment

The MVP supports cash on delivery and/or manual order confirmation. No online payment gateway is required.

- Customers can place an order without online payment.
- Every successful order receives a unique reference.
- The customer sees an order confirmation with items, quantities, discounts, delivery fee, and final total.
- New orders start with `pending`.
- Supported order statuses: `pending`, `in_progress`, `delivered`, and `rejected`. Map these to the display labels “Pending”, “In progress”, “Delivered”, and “Rejected”.
- A rejection requires a reason.
- Payment method and payment status are separate from order fulfillment status.
- An order must not be marked paid merely because it was submitted or delivered.
- Online payment integration is explicitly out of scope for this MVP.
- Preserve an architecture that can accommodate a payment provider in a future phase.

## 2.3 Customer access and administrator security

- Guest browsing and guest shopping are supported.
- Visitors can browse, search, filter, preview sample pages, use favourites, and build a basket without creating an account.
- Guests can submit checkout details and place an order after successful server-side Google reCAPTCHA verification.
- Guest order lookup must use a secure reference or equivalent verification and must not expose other customers' private details.
- The admin dashboard requires authentication and server-side administrator authorization.
- Public registration must never grant administrator privileges.
- Use secure password hashing if password authentication is implemented.
- Provide a documented development-only administrator setup procedure.
- Do not hardcode production credentials or secrets.
- Customer accounts and account-based order history are optional future enhancements, not blockers for the MVP.

## 2.4 Definition of MVP completion

The MVP is complete only when a visitor can:
1. Browse the Arabic-first library.
2. Select an education level and book.
3. Open a book preview when sample pages are available.
4. Add books and packs to the basket.
5. Submit an order with validated Tunisian delivery information.
6. See the server-calculated delivery fee and total.
7. Receive an order reference and confirmation.

An administrator must be able to manage books, packs, orders, delivery rules, and reviews through a protected dashboard.

The application must support Arabic, French, and English, offer JSON-backed local development and PostgreSQL persistence, and pass the documented critical-path tests.

Static mockups, fake buttons, simulated order submission, or an admin dashboard that does not persist changes do not meet the MVP criteria.

---

# 3. Technology and Architecture

## 3.1 Frontend

Use:
- React Native with Expo.
- TypeScript in strict mode.
- React Native Web for browser support.
- Expo Router for navigation and deep linking.
- React Native Reanimated for supported animations.
- React Native Gesture Handler for touch and gesture interactions.
- A reusable design system with theme tokens and responsive components.
- Platform-specific files and implementations where web and native capabilities differ.

Keep domain logic, validation, data contracts, API clients, and suitable components shared across platforms. Do not force incompatible browser libraries into native builds.

## 3.2 Backend

Use:
- Node.js with NestJS and TypeScript.
- A versioned REST API, such as `/api/v1`.
- PostgreSQL for persistent production data.
- One ORM only: Prisma or TypeORM. Choose one, document the choice, and use it consistently.
- Consistent request validation, using one chosen validation approach at each boundary.
- Secure authentication and role-based access control.
- OpenAPI/Swagger documentation.

## 3.3 JSON and PostgreSQL storage

Provide two repository implementations behind the same domain interfaces:

1. JSON-file repositories for local development and demonstrations.
2. PostgreSQL repositories for persistent environments.

Select the adapter using environment configuration. Both adapters must implement the same core business behavior and have parity tests.

JSON files are for local development only; do not treat them as a safe concurrent production database. Do not store PDF or image binary contents in JSON records or large database text fields.

## 3.4 Media storage

- Store media metadata and ownership information in the database.
- Store poster images and sample PDFs through a media-storage abstraction.
- Provide local filesystem storage for development.
- Document production object-storage configuration.
- Use safe, non-predictable identifiers for private assets.
- Restrict access to files that should not be public.
- Validate uploads on the server.

## 3.5 Supporting tools

- Docker and Docker Compose.
- Automated unit, integration, and end-to-end tests.
- Environment variables and `.env.example` files with no secrets.
- Google reCAPTCHA with backend verification.
- Logging, structured errors, and appropriate operational documentation.

Pin compatible dependency versions and verify actual installation, build, and test commands. Do not invent APIs or claim tests passed unless they ran.

---

# 4. Multilingual and RTL/LTR Requirements

Support three complete locales:
- Arabic: `ar` — default.
- French: `fr`.
- English: `en`.

Requirements:
- Every page, navigation item, button, form, validation message, status, empty state, and notification is localized.
- Use structured locale files and translation keys rather than scattering translations throughout components.
- Preserve the selected language across navigation and refreshes.
- Provide a visible language selector.
- Arabic must use document-level RTL direction and correct layout behavior.
- French and English must use LTR.
- Switch direction dynamically without a full reload where practical.
- Mirror directional icons, drawers, breadcrumbs, navigation, and directional transitions where appropriate.
- Ensure mixed Arabic, Latin text, numbers, prices, phone numbers, and punctuation remain readable.
- Use an Arabic-compatible font, such as Noto Sans Arabic, and suitable Latin fonts.
- Test Arabic shaping, line wrapping, text input direction, alignment, and responsive behavior.
- Do not treat RTL as simply right-aligning text.
- Book-opening and page-turn behavior must follow the intended reading direction for each locale.

The first visit must default to Arabic unless a previously selected language is stored.

---

# 5. Visual Identity and Design System

Create a premium, modern, warm educational brand.

Suggested direction:
- Deep emerald green as the primary brand color.
- Warm ivory and cream page backgrounds.
- Natural oak or walnut colors for shelves.
- Muted gold for restrained accents.
- Soft shadows, realistic materials, depth, and subtle lighting.
- Colorful, credible educational book covers.
- Strong editorial headings and readable body text.
- Consistent border radii, spacing, and elevations.
- Subtle gradients only where they improve depth.

Avoid generic SaaS styling, excessive glassmorphism, clutter, overly bright gradients, cartoonish 3D objects, and gratuitous motion.

Define tokens for:
- Colors and semantic states.
- Typography.
- Spacing and breakpoints.
- Border radii and shadows.
- Elevations.
- Animation duration and easing.
- Focus and interaction states.

Use consistent A4 portrait cover artwork and avoid unrelated stock images or distorted book covers.

## 5.1 A4 posters

Book posters and cover images should use an A4 portrait aspect ratio of approximately `1:1.414`.

- Preserve the aspect ratio.
- Use `contain` or an equivalent non-distorting strategy when the complete cover must be visible.
- Provide optimized thumbnails and suitable image sizes.
- Show a graceful placeholder when a poster is absent.

---

# 6. Storefront Layout

## 6.1 Header

Include:
- Brand logo.
- Main navigation.
- Search input.
- Language selector.
- Favourites link.
- Basket icon and item count.
- Mobile navigation.
- Contact/customer support access.

The header must adapt correctly to RTL and LTR.

## 6.2 Hero section

Include:
- Concise educational value proposition.
- Prominent call to action to explore the library.
- A visually impressive library/shelf composition.
- Subtle ambient motion.
- Featured books or educational collections.

Avoid decorative elements that push useful product content too far below the fold.

## 6.3 Interactive library

### Desktop

Use a three-part experience:

**Left: education-level shelf**
- Display education levels as book-shaped items on a shelf.
- Support primary, middle, and secondary levels, plus configurable additional levels.
- Use localized level names.
- Highlight the selected level.
- Support pointer and keyboard interactions.
- Animate selection smoothly.

**Center: book collection**
- Show books in the selected level.
- Display cover, title, price, discount, availability, and rating.
- Support a grid and, where useful, a compact list.
- Provide search, filters, sorting, and pagination or incremental loading.
- Animate changes without delaying interaction.

**Right or overlay: book details**
- Open a detail panel, drawer, modal, or dedicated route.
- Show cover, title, description, price, discount, level, quarter, stock, reviews, and purchase controls.
- Show the sample PDF preview when available.
- Show related books and packs.

### Mobile

Transform the desktop experience into a touch-friendly flow:
1. Select an education level.
2. Browse a book grid.
3. Open a dedicated book detail and preview screen.

Do not squeeze the desktop three-column layout into a narrow phone screen.

## 6.4 Book-opening interaction

This is a core differentiator.

Implement:
1. A closed book with cover, spine, depth, and subtle shadow.
2. A smooth opening animation using a suitable 3D transform or rendering technique.
3. A readable page spread using actual sample PDF content when provided.
4. Next and previous page controls.
5. Close, zoom, and current-page controls.
6. Correct Arabic RTL page-turn behavior and appropriate LTR behavior for French and English.
7. Touch, mouse, and keyboard support where appropriate.
8. Reduced-motion and lower-performance fallbacks.
9. Non-blocking interactions and accessible page content.
10. Clear handling when no sample PDF is available.

Use PDF.js on web where appropriate and a compatible native preview approach on iOS/Android. Consider rendering PDF pages into optimized page images for the animated viewer while retaining the original uploaded sample as the source. Do not expose full books or private files through predictable URLs.

Do not use a large GIF as the interactive book viewer. GIFs may be used sparingly for small decorative animations; actual book opening and page turning must be interactive.

## 6.5 Product cards

Each book card should include:
- A4 cover image.
- Localized title.
- Current price.
- Original price when discounted.
- Discount badge when applicable.
- Education-level badge.
- Quarter label where applicable.
- Stock status.
- Review score and review count.
- Favourite control.
- Add-to-basket control.
- Clear action to inspect the book.

Packs must have a distinct `PACK` badge, a differentiated card treatment, their own configured price, and a way to inspect included books.

## 6.6 Other storefront sections

Include:
- Featured books.
- Popular books where meaningful data exists.
- Discounted books.
- Recommended packs.
- Browse by education level.
- Customer reviews.
- Contact/support information.
- Footer with navigation, language support, and applicable policies.

Do not fabricate popularity, reviews, contact details, or business claims.

---

# 7. Domain Models

## 7.1 Article/book

Each article supports:
- ID.
- Required localized name in Arabic, French, and English.
- Required price.
- Optional discount.
- Optional quantity/stock tracking.
- Required education level.
- Optional A4 poster/cover.
- Optional sample PDF containing the permitted first pages.
- Optional quarter.
- Optional localized description.
- Optional author/publisher.
- Active/inactive status.
- Creation and update timestamps.

Rules:
- Display prices in TND by default.
- Use an exact decimal strategy for money.
- Validate discounts and never allow a negative final price.
- If quarter is unset, the book is available throughout the academic year.
- Define and document stock behavior when quantity is unset.
- Do not allow unavailable or inactive products to be ordered.

## 7.2 Packs

Each pack supports:
- ID.
- Required localized name.
- Localized description.
- List of included articles.
- Configured pack selling price.
- Optional discount.
- Optional poster.
- Active/inactive status.

Rules:
- Prevent invalid or duplicate pack items unless duplicates are explicitly supported.
- Show all included articles on the pack detail page.
- Make the pack price semantics clear.
- If comparing pack price to individual prices, calculate the comparison transparently.
- Revalidate pack availability and included-item stock during checkout.

## 7.3 Suggested database entities

At minimum:
- User.
- Role/role assignment.
- EducationLevel.
- Article.
- ArticleTranslation.
- Pack.
- PackTranslation.
- PackItem.
- MediaAsset.
- Order.
- OrderItem.
- DeliveryRule.
- OrderStatusHistory.
- Review.
- ContactMessage.

Add any required authentication, guest basket, favourites, CAPTCHA/audit, or configuration entities.

Use normalized relationships, stable identifiers, timestamps, indexes, foreign keys, and deliberate deletion policies.

Order items must preserve a snapshot of product name, unit price, discount, quantity, and relevant pricing information at order time. Later product or delivery-rule changes must not alter historical order totals.

---

# 8. Customer Features

## 8.1 Catalog

- Browse all books and packs.
- Browse by education level.
- Search by title and relevant fields.
- Filter by level, quarter, price range, availability, discount, and type.
- Sort by price, name, newest, and popularity where data supports it.
- View product detail pages.
- Preview sample pages where available.
- View related books and packs.

## 8.2 Basket

- Add books and packs.
- Update quantities.
- Remove items.
- Show subtotal, discounts, delivery cost, and total.
- Revalidate price and stock on the server.
- Preserve the basket across refreshes for guests.
- Prevent invalid quantities and duplicate/invalid order lines.
- Clearly explain unavailable products.

## 8.3 Favourites

- Add/remove favourites.
- Provide a dedicated favourites page.
- Persist favourites appropriately for guests and authenticated users if accounts are implemented.
- Do not require account creation merely to browse the catalog.

## 8.4 Reviews

- Allow a customer to submit a 1–5 score and written review for an article.
- Display average score and number of reviews.
- Display individual reviews with dates and moderation status where appropriate.
- Prevent duplicate submissions according to a documented identity policy.
- Validate and moderate submitted content.
- Allow admins to hide and restore reviews.
- Clearly distinguish published reviews from pending reviews.

## 8.5 General reviews page

- Show general store/customer-experience reviews.
- Show reviews for a specific article.
- Clearly distinguish store reviews from product reviews.
- Provide filtering and pagination when useful.

## 8.6 Contact us

Provide a localized contact form with:
- Name.
- Email.
- Optional phone.
- Subject.
- Message.
- Validation and success/error feedback.
- Server-side handling.
- Spam protection and an appropriate privacy notice.

Persist requests. Do not claim that an email was sent unless an email service is configured and confirms success.

## 8.7 Checkout

Collect:
- Customer name.
- Email.
- Tunisian phone number.
- City/locality.
- Street address.
- Optional delivery instructions.

Display:
- Books and packs.
- Quantities.
- Unit prices.
- Discounts.
- Subtotal.
- Applicable delivery rule and delivery fee.
- Final total.
- Selected payment/fulfillment option, such as cash on delivery or manual confirmation.

Google reCAPTCHA:
- Obtain the challenge response on the client.
- Verify it on the backend using a secret held only in server configuration.
- Never trust a client-only result.
- Provide an explicit development-only test mode when credentials are absent.
- Never silently bypass CAPTCHA in production.

After successful submission:
- Generate an order reference.
- Display confirmation and order summary.
- Set initial order status to `pending`.
- Provide secure guest order lookup or authenticated access.
- Do not expose another customer's order.

## 8.8 Payment and status semantics

Payment and fulfillment status are distinct.

- No real payment gateway in the MVP.
- Support cash on delivery and/or manual order confirmation.
- Do not mark an order paid just because it is submitted or delivered.
- Record the payment method and payment status separately.
- Document valid status transitions.
- Record order-status history, timestamps, and responsible administrator.

---

# 9. Delivery Pricing Engine

Administrators configure delivery prices based on order subtotal.

Example rules (illustrative only):
- Subtotal within a configured range: fee A.
- Subtotal above a threshold: fee B.
- Optional free delivery above another threshold.

Implement:
- Create/update/activate/deactivate rules.
- Configurable thresholds and fees.
- Deterministic rule ordering.
- Validation for overlapping ranges, gaps, missing rules, and boundaries.
- Documented behavior for discounts and zero-value orders.
- Backend-only final calculation.
- A clear pre-confirmation display of delivery fee and final total.
- A persisted snapshot of the applied rule and fee on each order.

Use transactions or equivalent consistency controls to protect order creation and stock changes.

---

# 10. Admin Dashboard

## 10.1 Dashboard overview

Display:
- Total active articles.
- Total active packs.
- Total orders.
- Orders by status.
- Order value.
- Meaningful date-range filters.
- Overall published-review score.
- Recent orders.
- Latest reviews.
- Low-stock alerts when stock is configured.

Clearly distinguish order value from collected revenue. Do not count pending or rejected orders as completed sales. Document metric definitions.

## 10.2 Article management

- Searchable, filterable, paginated list.
- Create/edit/activate/deactivate/archive.
- Localized names and descriptions.
- Price and discount validation.
- Education-level selection.
- Optional quantity.
- Quarter selector with explicit all-year behavior.
- A4 poster upload and preview.
- Sample PDF upload and preview.
- Clear validation messages.
- Upload progress and error feedback.

Validate actual file type/signature, size, page count, and safe filename on the server. Configure reasonable file-size and page limits. Store files safely.

## 10.3 Pack management

- Create/edit packs.
- Searchable article selection.
- Manage included articles.
- Configure price and discount.
- Upload optional poster.
- Activate/deactivate.
- Preview before publication.

## 10.4 Order management

- Search and filter by status, date, and reference.
- View customer delivery information.
- View items, quantities, price breakdown, and delivery rule used.
- Change order status with validation.
- Require a rejection reason.
- Display status history.
- Provide clear success/error feedback.
- Prevent customers from changing order status.

## 10.5 Delivery configuration

- Create, update, activate, deactivate, and reorder pricing rules.
- Configure thresholds and fees.
- Validate invalid or ambiguous ranges.
- Preview which rule applies to sample order subtotals.

## 10.6 Review management

- Article review list.
- General store review list.
- Score summaries.
- Hide/restore moderation actions.
- Publication status.
- Review date and related article where applicable.

---

# 11. API Requirements

Document and validate endpoints for:
- Authentication and admin authorization.
- Education levels.
- Articles and localized content.
- Packs and pack contents.
- Search, filters, sorting, pagination.
- Media uploads and safe preview access.
- Basket and favourites.
- Reviews and moderation.
- Checkout and order creation.
- Delivery-price calculation.
- Customer order lookup.
- Admin order management.
- Dashboard metrics.
- Delivery-rule management.
- Contact messages.

Requirements:
- Separate public and administrative endpoints.
- Consistent HTTP status codes and error responses.
- Server-side validation and pagination conventions.
- Never trust client-supplied prices, discounts, delivery fees, stock values, role claims, or totals.
- Protect customer information.
- Document the API through OpenAPI/Swagger.

---

# 12. Security and Privacy

Implement:
- Server-side validation for every mutation.
- Secure password hashing if passwords are used.
- Rate limiting for authentication, reviews, contact forms, and checkout.
- Server-side CAPTCHA verification.
- Role-based authorization.
- Restricted media upload/retrieval.
- Protection against unauthorized customer-data access.
- Safe PDF and image handling.
- No secrets in source control or client bundles.
- No unrestricted administrator creation.
- Appropriate CORS configuration.
- Privacy-conscious logging.
- Clear user-facing errors.
- Synthetic data in demos and tests.

---

# 13. Responsive Design, Accessibility, and Performance

Support:
- Desktop browsers.
- Tablets.
- Mobile browsers.
- Android.
- iOS.

Acceptance requirements:
- No horizontal overflow on common phone widths.
- Touch-friendly primary actions.
- A4 cover aspect ratios preserved.
- Correct Arabic RTL and French/English LTR.
- Labeled forms and accessible validation.
- Accessible names for controls.
- Keyboard navigation on web.
- Visible focus indicators.
- Reduced-motion support.
- Loading, empty, success, error, and offline states.
- Animations must not block essential functionality.

Performance:
- Lazy-load images and PDF pages.
- Use optimized thumbnails.
- Limit PDF page preloading.
- Use responsive image sizes.
- Avoid continuous heavy WebGL rendering unless necessary.
- Prefer efficient transforms and composited animations.
- Provide fallbacks for low-powered devices.
- Do not use a large GIF as a substitute for an interactive book viewer.

---

# 14. Testing and Acceptance Criteria

Create automated tests for:
- Arabic default locale and RTL.
- French/English LTR switching.
- Product localization.
- Article CRUD.
- Pack creation and contents.
- Discount calculation.
- Stock validation.
- Delivery-rule boundaries.
- Server-side price recalculation.
- CAPTCHA verification and failure cases.
- Order creation and status changes.
- Required rejection reasons.
- Review submission and moderation.
- Admin authorization.
- Poster and PDF validation.
- JSON/PostgreSQL repository parity.

End-to-end journeys:
1. Browse Arabic library, choose level, open book, preview pages, add to basket.
2. Switch to French and English and verify LTR layouts.
3. Create a pack in admin and confirm it appears in the storefront.
4. Submit an order with valid details and verified CAPTCHA.
5. Verify server-calculated delivery fees and totals.
6. Change order from pending to in progress to delivered.
7. Reject an order with a required reason.
8. Submit and moderate a review.
9. Upload A4 poster and sample PDF.
10. Confirm unauthorized users cannot access admin features or another customer's order.

A successful compilation alone does not prove that a journey works. Report tests that actually ran and identify any untested platform.

---

# 15. Implementation Rules for Jules

- Read this file and `AGENTS.md` before each task.
- Inspect the existing code before changing it.
- Work in small, verifiable increments.
- Preserve working features and architecture.
- Use reusable components and shared business logic.
- Do not replace working code without explaining why.
- Do not use fake buttons or hardcoded responses as completed functionality.
- Clearly identify mock data and prototype features.
- Do not commit secrets or real customer information.
- Do not integrate online payment processing in the MVP.
- Keep core shopping usable if advanced 3D animation is unavailable.
- Run relevant tests and builds before declaring a task complete.
- Report changed files, commands run, test results, and remaining limitations.
- Do not begin the next phase until the current phase's acceptance criteria have been reviewed.

---

# 16. Sequential Jules Task Plan

**Execution rule:** Assign one task at a time. Review the changes and acceptance criteria before asking Jules to continue. These 12 tasks are the planned sequence, not a guarantee that no repair tasks will be necessary.

## Task 1 — Repository analysis and architecture

**Goal:** Establish a reliable foundation.

### Prompt to Jules

Read this specification and inspect the reference website and repository. Review the current code, dependencies, scripts, and existing functionality before changing anything.

Deliver:
1. Proposed architecture and directory structure for Expo, React Native Web, TypeScript, NestJS, PostgreSQL, and JSON development storage.
2. Dependency compatibility assessment, especially 3D animation and PDF preview across web/native.
3. Implementation plan aligned with this document.
4. `AGENTS.md` with coding conventions, localization rules, architecture constraints, and testing commands.
5. Feature checklist and acceptance criteria.

Do not implement the entire application in this task. If the repository is empty, establish only the minimal required structure. Run available checks and report exact results. Do not claim to have inspected inaccessible reference-site features.

### Acceptance criteria
- Architecture and project structure documented.
- Risks identified.
- `AGENTS.md` created.
- Existing working code preserved.
- No claims of unperformed tests.

## Task 2 — Design system and multilingual layout

**Goal:** Establish a polished, reusable visual system.

### Prompt to Jules

Implement the shared design system and multilingual application shell according to this specification.

Use Expo, React Native, React Native Web, and TypeScript. Support Arabic as the default locale, plus French and English. Implement true RTL/LTR layout behavior, localized translation files, persistent language preference, Arabic-compatible typography, reusable controls, responsive layouts, focus states, and reduced-motion support.

Ensure directional icons, drawers, navigation, forms, and layout behavior adapt correctly. All visible strings must use localization keys.

Do not implement backend features yet. Run the web build and available tests. Document native limitations rather than pretending all platforms have been tested.

### Acceptance criteria
- Arabic is the default.
- Language switching works without losing navigation state.
- RTL/LTR behavior is structural, not just text alignment.
- Design tokens and reusable components exist.
- Web build passes.

## Task 3 — Interactive 3D library and book viewer

**Goal:** Validate the hardest visual requirement early.

### Prompt to Jules

Implement a complete storefront prototype using mock data. Education levels appear as books on a shelf on the left of desktop layouts. Selecting a level animates the selection and displays its books in the center. Selecting a book opens details and a realistic interactive 3D book-opening experience.

Include A4 covers, realistic shadows/depth, page-turn animation, Arabic RTL and French/English LTR behavior, previous/next controls, zoom, close, page indication, touch and keyboard interactions, and reduced-motion/performance fallbacks.

Use actual local sample PDF pages or representative sample-page assets. Do not pretend unrelated placeholder images are a working PDF preview. Use a web-appropriate 3D implementation and a native-compatible implementation or fallback. Keep the mobile layout touch-friendly and sequential.

Include product cards, search, filters, favourites, basket controls, and pack badges using mock state. Run the web build and report what is functional versus prototyped.

### Acceptance criteria
- Level-to-book navigation works.
- Book opens and pages can be navigated.
- Arabic and LTR reading directions are handled intentionally.
- Mobile layout is usable.
- Web build passes.

### Mandatory review checkpoint 1

Manually inspect the UI in a browser. Test Arabic, French, English, shelf selection, book opening, page navigation, and mobile layout. Fix visual and interaction issues before proceeding.

## Task 4 — Backend, database, and JSON storage

**Goal:** Build the data foundation.

### Prompt to Jules

Implement the NestJS REST API, PostgreSQL schema, migrations, seed data, request validation, error handling, and OpenAPI documentation.

Use one ORM consistently. Implement repository interfaces with interchangeable JSON-file and PostgreSQL adapters selected through environment configuration. Add entities for users/roles, education levels, articles/translations, packs/translations/items, media, orders/items, delivery rules, status history, reviews, and contact messages.

Use exact monetary calculations, constraints, indexes, foreign keys, and transaction support. Seed realistic Arabic, French, and English sample data. Add Docker Compose. JSON is for local development, not concurrent production persistence. Do not store uploaded file binaries inside JSON records.

Run migrations and tests against actual storage. Verify repository parity for core operations.

### Acceptance criteria
- Database migrates and seeds successfully.
- JSON and PostgreSQL adapters implement the same core interfaces.
- API documentation is available.
- Tests cover core persistence and validation.
- No secrets are committed.

## Task 5 — Article and pack management

**Goal:** Implement catalog administration.

### Prompt to Jules

Implement article and pack management in the existing admin design system, connected to real backend APIs.

Articles need required localized name, price, and level; optional discount, quantity, A4 poster, sample PDF, quarter, and description; plus active/inactive status. An unset quarter means all year.

Packs need localized name/description, selected articles, configured price, optional discount/poster, and active status.

Implement create/edit/search/filter/pagination, validation, upload progress, previews, and clear errors. Validate file signature/type, size, page count, and filename on the server. Store media through the storage abstraction, with local development storage and documented production storage setup.

Test invalid prices, discounts, missing fields, duplicate pack items, and invalid uploads. Confirm data persists after refresh.

### Acceptance criteria
- Admin can create and edit articles and packs.
- Poster and PDF upload works with validation.
- Changes persist.
- Storefront catalog can consume the saved records.

## Task 6 — Secure admin authentication and dashboard

**Goal:** Protect administrative operations and show accurate metrics.

### Prompt to Jules

Implement administrator authentication, protected routes, server-side role authorization, and a dashboard with active article/pack counts, order totals and statuses, order value, date filters, recent orders, reviews, and low-stock alerts when applicable.

Use secure password hashing if password login is used. Provide a development-only admin setup procedure. Do not allow public registration to grant admin rights or hardcode credentials.

Define financial metrics explicitly. Separate order value from collected revenue; pending and rejected orders must not be treated as completed sales. Read metrics from real backend endpoints. Add tests showing anonymous users and ordinary customers cannot access admin APIs.

### Acceptance criteria
- Admin authentication works.
- Admin APIs are protected server-side.
- Metrics match persisted test data.
- No hardcoded production credentials.

### Mandatory review checkpoint 2

Verify that an administrator can log in, create an Arabic book, upload a poster and sample PDF, create a pack, and see the changes in the storefront.

## Task 7 — Basket, favourites, and product details

**Goal:** Implement the complete shopping interface.

### Prompt to Jules

Connect the storefront to real catalog APIs. Implement book and pack detail pages, related products, pack contents, basket add/update/remove operations, guest basket persistence, favourites, stock checks, and clear pricing breakdowns.

Preserve the 3D preview and all localization. Revalidate prices and stock on the server. Reject invalid quantities and unavailable products. Do not add online payments. Test refresh persistence, pack behavior, basket operations, and language switching.

### Acceptance criteria
- Catalog is API-backed.
- Basket and favourites work.
- Prices and stock are not trusted from client input.
- Book preview remains functional.

## Task 8 — Checkout, delivery pricing, and order creation

**Goal:** Deliver secure, correct order submission.

### Prompt to Jules

Implement guest checkout for Tunisia, supporting cash on delivery and/or manual order confirmation. Collect name, email, Tunisian phone, city/locality, street address, and optional instructions.

Implement configurable delivery rules with thresholds, fees, optional free delivery, validation, and clear display before confirmation. Verify Google reCAPTCHA on the server. Provide a development-only test mode that cannot silently activate in production.

Recalculate all prices, discounts, delivery, and stock on the server. Use a transaction for order creation and the documented inventory policy. Persist item-price snapshots, delivery-rule snapshot, payment method/status separately from fulfillment status, and initial pending status. Generate a unique order reference and confirmation page. Implement secure guest order lookup.

Add tests for invalid CAPTCHA, tampered prices, delivery boundaries, stock races, and successful orders. Do not integrate a payment gateway.

### Acceptance criteria
- Order is persisted and gets a reference.
- Server totals match the displayed breakdown.
- Delivery rules are correctly applied.
- CAPTCHA is server-verified.
- Customer data is protected.

## Task 9 — Order management, reviews, and contact

**Goal:** Complete remaining customer and admin workflows.

### Prompt to Jules

Implement admin order search/filter/details, validated status changes, mandatory rejection reason, and status history. Support pending, in progress, delivered, and rejected.

Implement article reviews and general store reviews, 1–5 scores, averages/counts, moderation, hide/restore, duplicate controls, and publication status. Implement a localized contact form that persists requests and has admin visibility.

Connect every screen to real APIs. Do not fake order changes, reviews, or email delivery. Add tests for status transitions, rejection reasons, moderation, contact submissions, and access control.

### Acceptance criteria
- Admin can manage orders and rejection reasons.
- Reviews persist and can be moderated.
- Contact requests persist.
- All user-facing flows are localized.

### Mandatory review checkpoint 3

Place a complete test order. Verify it in PostgreSQL, check delivery pricing, update its status in the admin dashboard, submit a review, and test guest order lookup.

## Task 10 — End-to-end integration and regression tests

**Goal:** Find and fix cross-feature defects.

### Prompt to Jules

Audit the entire application against this specification. Do not add major features. Fix integration defects.

Run end-to-end journeys:
1. Arabic library → level → book preview → basket.
2. French/English switching and LTR behavior.
3. Admin pack creation → storefront.
4. Checkout with verified CAPTCHA.
5. Server delivery and total calculation.
6. Order status changes and rejection reason.
7. Review submission and moderation.
8. Poster/PDF uploads.
9. Unauthorized admin and cross-customer order access.
10. JSON/PostgreSQL parity.

Run unit, integration, and end-to-end tests. Fix failures and report remaining gaps with reproducible steps. Only report tests that actually ran.

### Acceptance criteria
- Critical journeys pass.
- Regressions are fixed.
- Remaining gaps are documented honestly.

## Task 11 — Visual QA, accessibility, and performance

**Goal:** Refine the user experience across platforms.

### Prompt to Jules

Perform a visual and interaction quality pass on desktop, tablet, mobile web, and available native targets.

Check Arabic RTL, French/English LTR, Arabic shaping, mixed-direction numbers and phone fields, responsive shelf behavior, touch controls, A4 covers, book animations, PDF readability, keyboard accessibility, focus states, reduced motion, loading/error/empty states, image/PDF performance, and overflow.

Use screenshots or device previews to inspect actual rendering. Fix visual regressions and expensive animations. Verify platform-specific dependencies and builds. If a platform cannot be tested, state that clearly and provide verification steps.

### Acceptance criteria
- No known critical layout/RTL defects.
- Accessible core interactions.
- Performance fallbacks work.
- Untested platforms are explicitly identified.

## Task 12 — Deployment and handover

**Goal:** Deliver a reproducible MVP.

### Prompt to Jules

Prepare the verified MVP for local deployment and release.

Deliver:
- Docker Compose.
- PostgreSQL migrations and seed scripts.
- JSON development mode.
- `.env.example` without secrets.
- README with exact install, run, test, and build commands.
- OpenAPI documentation.
- Web deployment instructions.
- Android and iOS Expo build instructions.
- Media-storage setup and backup notes.
- Development administrator setup.
- Security checklist.
- Known limitations.
- Final feature matrix: implemented, tested, partial, or not implemented.

Run the production web build and available native checks in a reproducible environment. Fix errors before reporting completion. Do not add online payments or claim production readiness without evidence. Report test results, deployment requirements, and remaining risks.

### Acceptance criteria
- A new developer can follow the documented setup.
- Builds and tests are reported accurately.
- Deployment and environment requirements are documented.
- Remaining risks are explicit.

---

# 17. Jules Task Execution Rules

1. Assign one task at a time.
2. Do not start the next task until the current task's acceptance criteria have been reviewed.
3. Keep the specification and `AGENTS.md` in the repository.
4. Use a Git commit or checkpoint after each working milestone.
5. If a task fails, create a focused repair task rather than asking Jules to rewrite the whole application.
6. Allow additional repair tasks; the 12-task plan is not a promise that no debugging will be needed.
7. Prioritize Task 3's library/book-viewer prototype before spending significant effort on backend features.
8. Do not merge unreviewed changes directly into a release branch.
9. Keep secrets out of Git and use synthetic demo data.
10. At the end of each task, ask Jules to report:
    - Files changed.
    - Behavior implemented.
    - Commands executed.
    - Tests and builds that actually passed.
    - Remaining limitations.
    - Suggested next task.

# 18. Future Enhancements — Not MVP Blockers

Potential future work:
- Customer accounts and account-based order history.
- Online payment provider integration.
- Email/SMS notifications.
- Additional countries and currencies.
- Advanced analytics and sales reports.
- Recommendations based on actual purchase data.
- More sophisticated 3D/WebGL effects.
- Inventory forecasting and supplier management.

Do not implement these ahead of the MVP unless explicitly requested.

---

# 19. Final Product Acceptance Checklist

## Storefront
- [ ] Arabic is the default language.
- [ ] French and English work across all pages.
- [ ] RTL/LTR layouts behave correctly.
- [ ] Education-level shelf works.
- [ ] Book selection and preview work.
- [ ] A4 posters preserve their aspect ratio.
- [ ] Search and filters work.
- [ ] Packs have distinct badges and show included books.
- [ ] Basket and favourites persist appropriately.
- [ ] Responsive mobile navigation works.

## Checkout and orders
- [ ] Tunisian delivery details are collected.
- [ ] Google reCAPTCHA is verified server-side.
- [ ] Prices and stock are recalculated on the server.
- [ ] Delivery pricing is configurable.
- [ ] Order reference and confirmation are shown.
- [ ] Payment and fulfillment statuses are separate.
- [ ] Guest order lookup is secure.
- [ ] Rejection requires a reason.

## Administration
- [ ] Admin authentication and authorization work.
- [ ] Article CRUD works.
- [ ] Pack CRUD works.
- [ ] Poster and PDF upload validation works.
- [ ] Order management works.
- [ ] Delivery rules can be managed.
- [ ] Reviews can be moderated.
- [ ] Dashboard metrics match persisted data.

## Engineering
- [ ] JSON adapter works for local development.
- [ ] PostgreSQL adapter works.
- [ ] Migrations and seed scripts work.
- [ ] Unit/integration/end-to-end tests run.
- [ ] Docker Compose works.
- [ ] No secrets are committed.
- [ ] Web build succeeds.
- [ ] Android/iOS build status is documented honestly.
- [ ] Setup and deployment instructions are complete.

**Completion rule:** Do not mark the project complete until each applicable item is verified or explicitly documented as a limitation.
