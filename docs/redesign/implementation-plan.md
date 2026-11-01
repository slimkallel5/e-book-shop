# 3D Redesign Implementation Plan & Feature Mapping

## 1. Migration Strategy & Phase Progression

The redesign will execute progressively without breaking existing production functionality:
1. **Task 1 (Audit & Plan):** Inventory existing features, map API contracts, and define component requirements (Completed).
2. **Task 2 (Design System & 3D Foundation):** Establish enhanced tokens, glass UI primitives, Three.js 3D environment with fallbacks, shared layout shell, and preview demonstrator (In Progress).
3. **Task 3 (Storefront Redesign):** Redesign discovery, hero lookbook, category bookshelf, product grid, product detail modal, and articles showcase using Task 2 components.
4. **Task 4 (Transactional & Admin UI):** Redesign cart, 3-step checkout, order tracking, contact forms, and admin management suite.
5. **Task 5 (Verification, Regression Testing & Release):** End-to-end regression testing, RTL/LTR verification, mobile responsiveness, and production build checks.

---

## 2. Feature-to-New-Page Mapping

| Existing Component | Current Role | Redesigned Experience | Enhancements & 3D Integration |
| :--- | :--- | :--- | :--- |
| `ImmersiveBackground.tsx` | Fixed 2D background image + CSS orbs | `ThreeDScene.tsx` + `ThreeDBackground.tsx` | Real-time WebGL ambient library, dynamic lighting, floating interactive books, depth particles |
| `Header.tsx` & `Footer` | Static navigation bar & footer | Enhanced direction-aware `ShellLayout` | Glassmorphic floating navigation header, smooth RTL/LTR transitions, quick preview toggle |
| `Bookshelf.tsx` | 2D wood vertical list | `InteractiveBookshelf.tsx` | Modern 3D-styled shelf with level badges, ambient glow on active item, compact mobile drawer |
| `BookLookbookGallery.tsx` | Horizontal 2.5D carousel | `BookLookbookGallery.tsx` | Cinematic book showcase with 3D cover tilt, lighting highlights, and quick preview |
| `ProductCard.tsx` | Standard card with image & buttons | Redesigned `ProductCard.tsx` | GlassCard container, micro-interactions, floating pricing badge, 3D hover elevation |
| `BookViewer.tsx` | Modal with simulated 2D spread + PDF.js | `BookViewer.tsx` + `Book3D.tsx` | Realistic 3D book mesh with page-turn transitions, high-DPI PDF.js rendering, zoom & pan |
| `ProductDetailModal.tsx` | Standard popup modal | Glassmorphic detail drawer/modal | 3D interactive book inspection, clear pack item breakdown, related books carousel |
| `CheckoutModal.tsx` | Basic multi-step modal | Streamlined 3-step glass checkout | Clear delivery estimation, governorate selector, instant validation, secure COD flow |
| `AdminDashboard.tsx` & tabs | Basic tabbed admin tables | Modern glass admin suite | Cohesive dashboard cards, status pill badges, search filters, modal confirmation dialogs |

---

## 3. Risks & Mitigation Strategies

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **WebGL Unsupported / Context Loss** | Blank screen or crash on older devices/browsers | Medium | Implement automated WebGL capability detection in `ThreeDScene`. Fallback to lightweight CSS/Canvas 2D background gracefully. |
| **Mobile Performance / GPU Throttling** | Low frame rates, battery drain | Medium | Cap pixel ratio at `Math.min(window.devicePixelRatio, 2)`, reduce floating book count on screens `< 768px`, disable complex shadow maps on mobile. |
| **Accessibility & Reduced Motion** | Disorientation for motion-sensitive users | Low | Listen to `prefers-reduced-motion: reduce` query. When enabled, disable camera oscillations, book floating rotations, and rapid page flips. |
| **RTL Structural Misalignment** | Text clipping, reversed flex layouts | Medium | Centralize layout flipping around `isRTL` context. Use direction-aware padding/margin styles rather than hardcoded left/right. |
| **API Contract Regressions** | Broken order submission or catalog loading | Low | Preserve all existing endpoint signatures, parameter names, DTO shapes, and validation rules in `apps/web/src/services/api.ts`. |

---

## 4. Comprehensive Regression Checklist

- [ ] **Catalog Browsing:**
  - [ ] Primary education books load and filter by quarter (`all`, `q1`, `q2`, `q3`).
  - [ ] Middle school books load and filter properly.
  - [ ] Secondary school books load and filter properly.
  - [ ] Educational packs display bundled items correctly.
  - [ ] Pedagogical articles list and download sample PDFs.
- [ ] **Search & Filtering:**
  - [ ] Live search queries match Arabic, French, and English titles.
  - [ ] Quarter filter pills update results instantly.
- [ ] **Book Inspection & 3D Preview:**
  - [ ] Book detail modal displays correct prices, discounts, and ratings.
  - [ ] PDF sample viewer dynamically renders sample pages using PDF.js.
  - [ ] Keyboard navigation (ESC, Left, Right arrows) operates directionally.
- [ ] **Cart & Checkout:**
  - [ ] Add to cart increments quantity and updates subtotal accurately.
  - [ ] Quantity modifications (+ / -) recalculate totals.
  - [ ] Remove item removes row and updates badge.
  - [ ] 3-step checkout validates Tunisian phone number (8 digits) and governorate.
  - [ ] Order creation returns tracking reference code.
- [ ] **Order Tracking:**
  - [ ] Order lookup by reference code displays correct order details and status badge.
- [ ] **Administrative Suite:**
  - [ ] Admin login accepts credentials and stores JWT token.
  - [ ] Dashboard metrics display live revenue and order counts.
  - [ ] Orders list allows status transitions (pending -> in_progress -> delivered / rejected).
  - [ ] Rejections require mandatory rejection reason.
  - [ ] Article and pack CRUD functions operate without errors.
- [ ] **Multilingual & RTL:**
  - [ ] Arabic (`ar`) renders right-to-left structurally with correct icon flips.
  - [ ] French (`fr`) and English (`en`) render left-to-right.
  - [ ] Language toggle works seamlessly across all pages without refresh.
