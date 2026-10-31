# Complete 3D Frontend Redesign — Project Specification & Jules Task Plan

## 1. Project objective

Transform the existing educational-books e-commerce application into a premium, modern, immersive 3D experience.

**This is a frontend redesign inside the existing repository, not a new application.**

Preserve the existing backend, database, API contracts, authentication, authorization, business rules, payment integrations and e-commerce workflows. Replace or progressively redesign the frontend presentation, layouts, components, styling and animations.

The finished application must continue using the existing backend and real data.

## 2. Repository and Git strategy

- Work in the existing repository.
- Create a dedicated branch:

```bash
git checkout main
git pull
git checkout -b feature/complete-3d-redesign
```

- Keep the production/main branch untouched until the redesign has been reviewed and validated.
- Commit work in small, logical increments.
- Do not create a second application or duplicate backend services.
- Do not delete the old frontend until the replacement has been validated.
- Inspect the repository's actual branch names and workflow before running Git commands; adapt `main` if the default branch has another name.

## 3. Preserve existing functionality

The following are out of scope for replacement and must remain operational:

- Database schemas, migrations and persisted data.
- Backend services and API endpoints.
- API request/response contracts and DTOs.
- Authentication, authorization and session handling.
- User registration, login and password recovery.
- Book and education-level management.
- Categories, search and filtering.
- Article management and display.
- Shopping cart and its persistence rules.
- Checkout, address and customer validation.
- Payment integrations and payment rules.
- Order creation, status and history.
- User profiles and account features.
- Admin permissions, CRUD operations and workflows.
- File uploads and existing integrations.
- Existing business rules and server-side validation.

Reuse the existing API client, services, hooks, models, DTOs and validation wherever possible. Do not replace real API data with mock data. Do not weaken security or move trusted business rules into the browser.

If a frontend adjustment is required to integrate the new UI, preserve the backend contract and explain the change.

## 4. What can be redesigned

The frontend may be substantially redesigned:

- Global layout, navigation and menus.
- Homepage and hero section.
- Design tokens, typography, colors and spacing.
- 3D background and visual environment.
- Education-level and category browsing.
- Book cards, book details and previews.
- Article listings and article details.
- Login, registration and account screens.
- Cart and checkout presentation.
- User account screens.
- Admin interface presentation.
- Responsive layouts, transitions and micro-interactions.

Every existing route and feature must be inventoried before implementation so none is accidentally omitted.

## 5. Visual direction and references

Create an original **interactive 3D digital library** concept. The experience should feel like exploring a beautifully designed library rather than using a generic online shop.

Use these references for inspiration and study, not as permission to copy proprietary or paid source code:

- Motion in Design: https://www.motionin.design/
- Motion examples: https://examples.motion.dev/
- Magnific 3D website templates: https://www.magnific.com/vectors/3d-website-templates/
- Motion: https://motion.dev/

Target visual qualities:

- Immersive, carefully art-directed 3D environment.
- Floating educational books used with restraint.
- Interactive bookshelf and book presentation.
- Realistic materials, lighting, shadows and depth.
- Smooth camera and scroll transitions.
- Elegant typography and clear visual hierarchy.
- Premium, coherent color palette.
- Readable, accessible shopping interfaces.
- Subtle glass/translucent surfaces only where they improve the design.
- Consistent visual language across all pages.

Avoid a generic template look, excessive animation, clutter and effects that interfere with shopping.

## 6. Suggested frontend technology

First inspect the current framework, React version, bundler and dependency constraints. Do not upgrade dependencies indiscriminately.

Potential technologies, only where compatible:

- Three.js — 3D rendering.
- React Three Fiber — Three.js in React.
- Drei — reusable R3F helpers.
- GSAP — timeline and scroll-driven animation.
- Framer Motion — interface transitions and interactions.

Create reusable components where appropriate:

- `ThreeDScene`
- `ThreeDBackground`
- `LightingEnvironment`
- `CameraController`
- `FloatingBooks`
- `InteractiveBookshelf`
- `Book3D`
- `ScrollAnimationController`
- `SceneTransition`

Keep 3D rendering separate from e-commerce business logic and API integration. Do not introduce a 3D dependency if the existing framework or target platform cannot support it reliably.

## 7. Pages and features to map and redesign

Map the actual routes in the repository first. The following is a checklist, not an assumption that every route exists.

### Homepage
- Immersive hero and 3D environment.
- Education-level navigation.
- Interactive bookshelf or book collection.
- Featured and recommended books.
- New arrivals and promotional sections.
- Featured articles.
- Footer and site navigation.

### Education levels, categories and search
- Browse by education level.
- Browse categories and book collections.
- Existing search and filters.
- Existing sort and pagination behavior.
- Clear loading, empty and error states.

### Book listing and detail
- Modern book cards and collections.
- Book cover and information.
- Price and availability.
- Description and related books.
- Add-to-cart behavior.
- Optional 3D book presentation that does not obstruct core information.

### Articles
- Article listing and cards.
- Article detail.
- Related articles and existing publishing behavior.

### Authentication and account
- Login, registration and password recovery.
- Existing validation and error handling.
- Profile and account features.
- Order history and details, if present.

### Cart and checkout
- Existing cart items and quantity updates.
- Existing price calculations and totals.
- Existing cart persistence.
- Customer details and validation.
- Tunisian address, city and phone fields where already supported.
- Existing payment methods and payment integration.
- Existing order creation and confirmation.

### Administration
- Preserve all existing admin capabilities.
- Redesign presentation and navigation.
- Preserve CRUD operations, permissions, validation and workflows.
- Do not expose admin functions to unauthorized users.

## 8. Multilingual and RTL requirements

The application supports Arabic, French and English, with Arabic as the default language.

Requirements:

- Correct RTL layout for Arabic.
- Correct LTR layout for French and English.
- Direction-aware navigation, menus, forms and icons.
- Appropriate Arabic typography and line spacing.
- Correct alignment and ordering of controls.
- No clipped, reversed or overlapping Arabic content.
- Preserve the existing translation system and translation keys wherever possible.
- Test language switching across all redesigned routes.

Do not implement RTL as a superficial global CSS flip. Build direction-aware reusable components and layouts.

## 9. Responsive design and accessibility

Support desktop, laptop, tablet and mobile.

For mobile and lower-powered devices:

- Reduce 3D object count and scene complexity.
- Optimize textures and geometry.
- Avoid unnecessary GPU use.
- Lazy-load 3D scenes and assets.
- Provide a static or reduced-motion fallback.
- Keep navigation, product information and purchasing fully usable without 3D.
- Respect reduced-motion preferences.
- Ensure keyboard navigation, focus states, semantic controls and readable contrast.

The 3D environment must enhance the store, never become a requirement for using it.

## 10. Performance and reliability

- Lazy-load 3D scenes and large assets.
- Compress and appropriately size textures and images.
- Avoid unnecessary React re-renders.
- Avoid loading the same assets repeatedly.
- Use code splitting where appropriate.
- Keep initial page rendering fast.
- Handle WebGL unsupported/lost contexts gracefully.
- Avoid blocking API-driven content while the 3D scene loads.
- Monitor console errors and failed network requests.
- Preserve existing build and deployment compatibility.

## 11. Jules execution plan — 5 tasks

Use the following five tasks as the implementation plan. Tasks 3 and 4 may run in parallel **only after Task 2 has established and committed the shared design system, component contracts and integration conventions**. Task 5 depends on the completed implementation.

### Task 1 — Repository audit, functionality inventory and migration plan

**Goal:** Understand the current application before changing code.

Actions:
1. Inspect the complete repository and identify frontend/backend boundaries.
2. Identify framework, React version, bundler, routing and dependency versions.
3. List every existing route, page, component and user workflow.
4. Trace the API calls, DTOs, hooks, services and authentication flows used by each page.
5. Inventory cart, checkout, payment, order, admin and multilingual functionality.
6. Identify existing tests, build commands and deployment assumptions.
7. Identify compatibility risks for Three.js/R3F and animation dependencies.
8. Propose a target frontend architecture and incremental migration approach.
9. Create a feature-to-new-page mapping and regression checklist.

Deliverables:
- `docs/redesign/current-architecture.md`
- `docs/redesign/functionality-inventory.md`
- `docs/redesign/api-and-integration-map.md`
- `docs/redesign/implementation-plan.md`
- A list of risks, assumptions and dependencies.

Constraints:
- Analysis and documentation only.
- Do not modify application behavior or backend code.
- Do not install dependencies or start the redesign before the plan is reviewed.

**Completion gate:** The user reviews and approves the inventory and plan before Task 2 begins.

### Task 2 — Design system, shared frontend foundation and 3D environment

**Goal:** Establish the common visual and technical foundation for all redesigned pages.

Actions:
1. Create the design system: colors, typography, spacing, breakpoints, surfaces, buttons, forms and reusable UI primitives.
2. Establish shared page layout, header, navigation, footer and responsive behavior.
3. Implement Arabic RTL and French/English LTR foundations using the existing translation system.
4. Check dependency compatibility before adding Three.js, React Three Fiber, Drei, GSAP or Framer Motion.
5. Build the reusable 3D scene and environment components.
6. Implement optimized lighting, camera, book objects and subtle environmental animation.
7. Provide loading, error, unsupported-WebGL and reduced-motion fallbacks.
8. Define component APIs and integration conventions for Tasks 3 and 4.
9. Add a demonstrator page or isolated preview to validate visual quality and performance.

Deliverables:
- Shared design tokens and UI primitives.
- Shared layout and navigation foundation.
- Direction-aware RTL/LTR support.
- Reusable 3D environment components.
- Documentation of component contracts and how feature pages should integrate them.

Constraints:
- Do not change backend contracts.
- Do not replace existing API logic.
- Avoid a large dependency upgrade.
- Keep the 3D layer independent of business logic.

**Completion gate:** Review the visual foundation, mobile behavior, RTL/LTR and performance before feature-page work. Commit the shared contracts so Tasks 3 and 4 can work in parallel safely.

### Task 3 — Storefront redesign: homepage, browsing, books and articles

**Goal:** Redesign the customer-facing discovery and content experience.

Actions:
1. Implement the new homepage using the shared design system and 3D environment.
2. Redesign education-level and category browsing.
3. Redesign book listings, search, filters, sorting and pagination.
4. Redesign book detail pages and add optional 3D book presentation.
5. Redesign article listing and detail pages.
6. Connect every page to the existing APIs, models, hooks and services.
7. Preserve loading, empty, validation and error states.
8. Implement responsive desktop/mobile behavior and Arabic RTL.
9. Verify all existing storefront routes and interactions.

Deliverables:
- Redesigned homepage.
- Redesigned education-level/category browsing.
- Redesigned book listing and detail pages.
- Redesigned article pages.
- Working existing API integrations.

Constraints:
- No mock data in place of existing API data.
- Do not change backend business logic or API contracts.
- Do not remove existing filters, sorting, pagination or features.

### Task 4 — Transactional and administrative UI redesign

**Goal:** Redesign the remaining application interfaces while preserving existing workflows.

Actions:
1. Redesign login, registration and password recovery.
2. Redesign user profile and account pages.
3. Redesign shopping cart and quantity/update interactions.
4. Redesign checkout and customer/address forms.
5. Preserve existing payment integrations and order creation.
6. Redesign order history and order details.
7. Redesign the admin layout and navigation.
8. Redesign admin book, category, article and other existing management screens.
9. Preserve all existing CRUD operations, permissions, validation and workflows.
10. Apply responsive and RTL/LTR behavior throughout.

Deliverables:
- Redesigned authentication and account pages.
- Redesigned cart and checkout.
- Redesigned order pages.
- Redesigned admin interface.
- Verified existing integrations and permissions.

Constraints:
- Never simulate successful payment or order creation.
- Never bypass server-side validation or authorization.
- Do not change payment or order business rules.
- Do not remove existing admin features.

### Task 5 — Integration, regression testing, performance and release readiness

**Goal:** Validate the entire redesigned application and resolve integration issues.

Actions:
1. Integrate Tasks 3 and 4 with the shared foundation from Task 2.
2. Resolve component, routing, styling and dependency conflicts.
3. Run existing automated tests and add/update frontend tests where needed.
4. Test every route and user workflow from the Task 1 inventory.
5. Test authentication, authorization and session handling.
6. Test search, filters, cart persistence, quantity updates and totals.
7. Test checkout, payment integration and order creation using the project's safe test environment.
8. Test admin CRUD operations and permissions.
9. Test Arabic RTL, French/English LTR and language switching.
10. Test desktop, tablet and mobile layouts.
11. Test 3D performance, reduced-motion mode and unsupported-WebGL fallback.
12. Run production build and inspect console/network errors.
13. Check for accidental backend, schema, environment or API-contract changes.
14. Document remaining issues and provide before/after screenshots.

Deliverables:
- Passing production build.
- Regression test results.
- Performance and compatibility notes.
- List of completed routes and functionality.
- List of remaining issues.
- Release/merge recommendation.

**Completion gate:** Do not merge into the production branch until critical functionality, build and regression checks pass and the user approves the result.

## 12. Acceptance criteria

The redesign is complete only when:

1. It runs in the existing repository.
2. Existing backend services and database remain intact.
3. Existing API contracts are preserved.
4. All inventoried routes and features have an equivalent working experience.
5. Real API data is used.
6. Authentication and authorization still work.
7. Cart, checkout, payment and order workflows still work.
8. Admin operations and permissions still work.
9. Arabic RTL and French/English LTR work correctly.
10. Desktop, tablet and mobile are usable.
11. The site remains functional without WebGL.
12. 3D assets and animations are optimized.
13. The production build succeeds.
14. No critical console errors or broken routes remain.
15. The final implementation and any remaining limitations are documented.

## 13. Rules for all Jules tasks

- Read the relevant project documentation before coding.
- Work only on the redesign branch.
- Respect the existing architecture unless a documented reason requires a change.
- Never invent API endpoints or data fields.
- Reuse existing API integrations and business logic.
- Do not commit secrets, credentials or environment files.
- Do not change production configuration.
- Keep changes focused and reviewable.
- Run relevant tests and builds after each task.
- Report files changed, commands run, test results and known issues.
- If an existing feature is unclear, inspect its implementation rather than guessing.
- If a task cannot be completed safely without a backend change, stop and explain why before making that change.

## 14. Final objective

Deliver a completely redesigned, premium, immersive 3D educational-books e-commerce experience **inside the existing repository**, connected to the **existing backend**, with all current business functionality preserved.

The priority order is:

1. Preserve working functionality and data.
2. Deliver a coherent, high-quality design.
3. Ensure accessibility, responsiveness and multilingual support.
4. Add 3D interactions without compromising performance.
