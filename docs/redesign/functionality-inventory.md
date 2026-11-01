# Functionality & Component Inventory

## 1. Overview

This document provides a line-by-line audit and inventory of every user-facing component, administrative feature, modal interface, and state workflow in the frontend application (`apps/web`). It establishes the baseline feature set that must be completely preserved and enhanced during the redesign.

---

## 2. Storefront Layout & Shell Components

### 1. `Header.tsx`
- **Location:** `apps/web/src/components/Header.tsx`
- **Responsibilities:**
  - Branding logo ("منصة المناهج التونسية" / "Tunisian Curriculum Platform") with interactive graduation cap icon.
  - Search input field with real-time text query binding.
  - Cart launcher with dynamic item counter badge and total items calculation.
  - Favorites count indicator.
  - Order tracking launcher ("تتبع طلبي").
  - Contact us dialog trigger ("اتصل بنا").
  - Multilingual language picker supporting Arabic (`ar`), French (`fr`), and English (`en`) with real-time RTL/LTR directional reflow.
  - Admin login/view switcher toggle button.
- **RTL Behavior:** Reverses layout orientation (`row-reverse`), flips margins, icons, and alignment for Arabic.

### 2. `Footer.tsx` (part of `Header.tsx`)
- **Location:** `apps/web/src/components/Header.tsx`
- **Responsibilities:**
  - Site branding statement and platform overview.
  - Education levels quick links (Primary, Middle, Secondary, Book Packs, Articles).
  - Trust and payment badges (Cash on delivery / "الدفع عند الاستلام", Tunisian Dinar TND, Fast nationwide delivery / "توصيل سريع لكافة الولايات").
  - Copyright statement and localized contact information.

### 3. `Bookshelf.tsx`
- **Location:** `apps/web/src/components/Bookshelf.tsx`
- **Responsibilities:**
  - Vertical wooden navigation bookshelf on desktop view (`width: 280`).
  - Education category navigation items:
    - Primary Education (`primary`, icon: `GraduationCap`)
    - Middle School (`middle`, icon: `BookMarked`)
    - Secondary School (`secondary`, icon: `Award`)
    - Educational Packs (`packs`, icon: `Sparkles`)
    - Pedagogical Articles (`articles`, icon: `Newspaper`)
  - Active selection highlighting with golden glow indicators.
  - Collapsible/compact mode for mobile drawer rendering.

### 4. `ImmersiveBackground.tsx`
- **Location:** `apps/web/src/components/ImmersiveBackground.tsx`
- **Responsibilities:**
  - Fixed ambient visual depth canvas backdrop.
  - Rich emerald deep library atmosphere (`#0F251C`).
  - Layered floating shapes and warm gold/cobalt ambient orbs.
  - Platform-adaptive fixed positioning for Web.

---

## 3. Product Discovery, Viewing & Cart Workflows

### 5. `BookLookbookGallery.tsx`
- **Location:** `apps/web/src/components/BookLookbookGallery.tsx`
- **Responsibilities:**
  - 3D-styled interactive horizontal showcase gallery.
  - Cover image display maintaining A4 portrait aspect ratio (1:1.414).
  - Dynamic grade badge, level badge, price badge, and discount pill.
  - "عرض التفاصيل" (View Details) button opening `ProductDetailModal`.
  - Carousel navigation controls (previous/next slide).

### 6. `ProductCard.tsx`
- **Location:** `apps/web/src/components/ProductCard.tsx`
- **Responsibilities:**
  - Grid card presentation for books and packs.
  - A4 aspect ratio cover thumbnail with hover elevation effects.
  - Localized title and description based on active language.
  - Star ratings and customer review counts.
  - Original price and discount price display with Tunisian Dinar (`د.ت` / `TND`) formatting.
  - Add to cart button with instant quantity bump in `StoreContext`.
  - Quick detail preview trigger opening `ProductDetailModal`.

### 7. `ProductDetailModal.tsx`
- **Location:** `apps/web/src/components/ProductDetailModal.tsx`
- **Responsibilities:**
  - Full modal display for a selected book or educational pack.
  - Cover preview with sample inspection badge.
  - Direct trigger to open 3D/PDF sample reader (`BookViewer`).
  - Pack item breakdown (if book `isPack === true`, displays bundled articles).
  - Quantity selection counter with increment/decrement buttons.
  - Direct "Add to Cart" with quantity parameter.
  - Dynamic recommendations: "كتب ذات صلة" (Related books from the same education level).

### 8. `BookViewer.tsx` (3D / Dynamic PDF Sample Viewer)
- **Location:** `apps/web/src/components/BookViewer.tsx`
- **Responsibilities:**
  - Fullscreen interactive book reading modal.
  - Dynamic client-side PDF rendering using PDF.js via CDN HTML5 `<canvas>` rasterization.
  - Realistic 3D simulated open-book stage with spine shadow and depth borders.
  - Dual navigation: On-screen arrow buttons, keyboard shortcuts (ESC to close, Left/Right arrow keys direction-aware based on `isRTL`).
  - Zoom in / Zoom out toggle mode.
  - Page counter (`صفحة X من Y`).
  - Fallback handling for missing sample previews or network errors.

### 9. `ArticleLookbookGallery.tsx`
- **Location:** `apps/web/src/components/ArticleLookbookGallery.tsx`
- **Responsibilities:**
  - Pedagogical articles grid and lookbook.
  - Educational articles filtering by subject or target grade.
  - Localized article title, summary, reading time estimate, and publication date.
  - Direct download or online inspection of pedagogical PDFs.

---

## 4. Transactional & Customer Modals

### 10. Shopping Cart Modal (in `App.tsx`)
- **Responsibilities:**
  - Itemized cart listing with book cover thumbnail, title, and line-item total.
  - Quantity controls (+1, -1) and remove item button (Trash icon).
  - Live subtotal calculation using exact floating decimal math.
  - Clear cart capability.
  - Direct transition to `CheckoutModal`.

### 11. `CheckoutModal.tsx`
- **Location:** `apps/web/src/components/CheckoutModal.tsx`
- **Responsibilities:**
  - 3-step guest checkout flow:
    1. **Customer Information:** Full name, mobile phone number (Tunisian 8-digit format validation).
    2. **Delivery Address:** Tunisian Governorate dropdown (`Select.tsx` with all 24 governorates), municipal city/delegation, postal code, street address, and delivery notes.
    3. **Order Confirmation:** Delivery fee calculation, subtotal verification, cash on delivery (COD) payment confirmation, reCAPTCHA verification token generation.
  - Direct POST submission to `/api/v1/orders`.
  - Order success screen displaying generated tracking reference code (e.g., `ORD-XXXXXX`).

### 12. `OrderLookupModal.tsx`
- **Location:** `apps/web/src/components/OrderLookupModal.tsx`
- **Responsibilities:**
  - Guest order tracking query by tracking reference number or customer phone.
  - GET request to `/api/v1/orders/:reference`.
  - Order status visual badge: `pending` (قيد الانتظار), `in_progress` (قيد المعالجة), `delivered` (تم التسليم), `rejected` (ملغى مع سبب الرفض).
  - Detailed line items and shipping address display.

### 13. `ContactModal.tsx`
- **Location:** `apps/web/src/components/ContactModal.tsx`
- **Responsibilities:**
  - Inquiry and feedback form (Name, Email, Phone, Subject, Message).
  - POST submission to `/api/v1/contact`.
  - Localized success feedback message and form reset.

---

## 5. Administrative Management Suite

### 14. `AdminLoginModal.tsx`
- **Location:** `apps/web/src/components/AdminLoginModal.tsx`
- **Responsibilities:**
  - Modal authentication dialog with username/password fields.
  - POST submission to `/api/v1/auth/login`.
  - JWT token retrieval and session persistence in component state.

### 15. `AdminDashboard.tsx`
- **Location:** `apps/web/src/components/AdminDashboard.tsx`
- **Responsibilities:**
  - High-level KPIs: Total revenue, total orders count, pending orders count, active articles count.
  - Recent order activity stream.
  - Quick action shortcuts.

### 16. `OrderAdmin.tsx`
- **Location:** `apps/web/src/components/OrderAdmin.tsx`
- **Responsibilities:**
  - Complete order management table.
  - Filter orders by status (`pending`, `in_progress`, `delivered`, `rejected`).
  - Search orders by customer name, phone number, or reference code.
  - Status transition actions with mandatory rejection reason prompt for cancelled orders.

### 17. `ArticleAdmin.tsx`
- **Location:** `apps/web/src/components/ArticleAdmin.tsx`
- **Responsibilities:**
  - Educational article CRUD interface.
  - Create, update, toggle active status, and delete articles.
  - Trilingual title and description editing (Arabic, French, English).
  - Education level and sub-level categorization.
  - Poster URL and PDF sample URL management.

### 18. `PackAdmin.tsx`
- **Location:** `apps/web/src/components/PackAdmin.tsx`
- **Responsibilities:**
  - Educational packs bundling management.
  - Create pack with bundled article multi-select.
  - Pack pricing, discount pricing, and inventory management.

### 19. `ReviewAdmin.tsx`
- **Location:** `apps/web/src/components/ReviewAdmin.tsx`
- **Responsibilities:**
  - Customer review moderation.
  - Approve, reject, or delete customer submitted reviews.

### 20. `ContactAdmin.tsx`
- **Location:** `apps/web/src/components/ContactAdmin.tsx`
- **Responsibilities:**
  - Inbox of customer messages and contact submissions.
  - Mark messages as read / replied.

---

## 6. Shared UI Primitives (`apps/web/src/components/ui/`)

- `Button.tsx`: Customizable button supporting primary, secondary, outline, accent, and danger variants, icon adornments, loading indicators, and tooltips.
- `Input.tsx`: Styled text input with floating labels, error text display, and direction-aware layout.
- `Select.tsx`: Cross-platform direction-aware dropdown (native HTML `<select>` on Web, custom modal picker on Native).
- `Modal.tsx`: Accessible overlay modal with title bar, close button, backdrop click dismissal, and responsive sizing.
- `Badge.tsx`: Pill indicators for discounts, packs, new arrivals, and order statuses.
- `Tooltip.tsx`: Hover/focus floating tooltip with automated RTL/LTR alignment.
