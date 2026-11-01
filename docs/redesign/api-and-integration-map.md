# API Contracts & Frontend Integration Map

## 1. Overview

This document specifies the exact mapping between frontend network requests (`apps/web/src/services/api.ts` and components) and backend endpoints (`apps/api/src/controllers/`).

All endpoints, DTOs, parameters, and response structures are preserved to guarantee 100% backend compatibility.

---

## 2. API Endpoints Map

### Catalog & Discovery

| Method | Endpoint | Description | Request DTO / Params | Response Schema | Frontend Consumers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/catalog` | Get catalog items (books & packs) | `level?`, `subLevel?`, `quarter?`, `search?` | `Article[]` | `App.tsx`, `fetchCatalogBooks()` |
| `GET` | `/api/v1/articles` | Get active articles | `query`, `level` | `Article[]` | `ArticleLookbookGallery.tsx`, `ArticleAdmin.tsx` |
| `GET` | `/api/v1/packs` | Get educational packs | none | `Pack[]` | `PackAdmin.tsx`, `fetchPacks()` |

### Orders & Guest Workflows

| Method | Endpoint | Description | Request DTO / Params | Response Schema | Frontend Consumers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders` | Create guest order | `CreateOrderDto` (`items`, `customerName`, `customerPhone`, `shippingAddress`, `deliveryGovernorate`, `deliveryCity`, `postalCode`, `notes`, `recaptchaToken`) | `Order` (with `reference`, `finalTotal`, `status: 'pending'`) | `CheckoutModal.tsx`, `createOrder()` |
| `GET` | `/api/v1/orders/:reference` | Track order by reference or phone | `reference` path param | `Order` object | `OrderLookupModal.tsx`, `fetchOrderByReference()` |

### Feedback, Reviews & Contact

| Method | Endpoint | Description | Request DTO / Params | Response Schema | Frontend Consumers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/contact` | Submit contact message | `CreateContactMessageDto` (`name`, `email`, `phone`, `subject`, `message`) | `ContactMessage` | `ContactModal.tsx`, `submitContactMessage()` |
| `GET` | `/api/v1/reviews/article/:id` | Get reviews for article | `articleId` path param | `Review[]` | `ProductDetailModal.tsx` |
| `POST` | `/api/v1/reviews` | Submit product review | `CreateReviewDto` (`articleId`, `userName`, `rating`, `comment`) | `Review` | `ProductDetailModal.tsx` |

### Authentication & Admin

| Method | Endpoint | Description | Request DTO / Params | Response Schema | Frontend Consumers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Admin authentication | `LoginDto` (`username`, `password`) | `{ accessToken: string, user: { username, role } }` | `AdminLoginModal.tsx`, `loginAdmin()` |
| `GET` | `/api/v1/admin/dashboard` | Dashboard analytics | Header: `Bearer <token>` | `DashboardMetricsDto` | `AdminDashboard.tsx`, `fetchAdminDashboard()` |
| `GET` | `/api/v1/orders` | Admin list all orders | Header: `Bearer <token>`, query: `status?`, `page?` | `Order[]` | `OrderAdmin.tsx`, `fetchAdminOrders()` |
| `PATCH` | `/api/v1/orders/:id/status` | Update order status | Header: `Bearer <token>`, `{ status: OrderStatus, rejectionReason?: string }` | `Order` | `OrderAdmin.tsx`, `updateOrderStatus()` |
| `POST` | `/api/v1/articles` | Create article | Header: `Bearer <token>`, `CreateArticleDto` | `Article` | `ArticleAdmin.tsx`, `createArticle()` |
| `PUT` | `/api/v1/articles/:id` | Update article | Header: `Bearer <token>`, `UpdateArticleDto` | `Article` | `ArticleAdmin.tsx`, `updateArticle()` |
| `DELETE`| `/api/v1/articles/:id` | Delete article | Header: `Bearer <token>` | `{ success: boolean }` | `ArticleAdmin.tsx`, `deleteArticle()` |
| `POST` | `/api/v1/packs` | Create pack | Header: `Bearer <token>`, `CreatePackDto` | `Pack` | `PackAdmin.tsx`, `createPack()` |
| `PUT` | `/api/v1/packs/:id` | Update pack | Header: `Bearer <token>`, `UpdatePackDto` | `Pack` | `PackAdmin.tsx`, `updatePack()` |
| `DELETE`| `/api/v1/packs/:id` | Delete pack | Header: `Bearer <token>` | `{ success: boolean }` | `PackAdmin.tsx`, `deletePack()` |
| `GET` | `/api/v1/admin/reviews` | Moderation reviews | Header: `Bearer <token>` | `Review[]` | `ReviewAdmin.tsx`, `fetchAdminReviews()` |
| `PATCH` | `/api/v1/admin/reviews/:id/approve` | Approve review | Header: `Bearer <token>` | `Review` | `ReviewAdmin.tsx`, `approveReview()` |
| `DELETE`| `/api/v1/admin/reviews/:id` | Delete review | Header: `Bearer <token>` | `{ success: boolean }` | `ReviewAdmin.tsx`, `deleteReview()` |
| `GET` | `/api/v1/admin/contact` | List messages | Header: `Bearer <token>` | `ContactMessage[]` | `ContactAdmin.tsx`, `fetchAdminContactMessages()` |
| `PATCH` | `/api/v1/admin/contact/:id/status`| Update message status | Header: `Bearer <token>`, `{ status: string }` | `ContactMessage` | `ContactAdmin.tsx`, `updateContactStatus()` |

---

## 3. Data Transfer Objects (DTO) Schema Definitions

### `Article` (Book representation)
```typescript
interface Article {
  id: string;
  title: { ar: string; fr?: string; en?: string };
  description: { ar: string; fr?: string; en?: string };
  educationLevel: 'primary' | 'middle' | 'secondary';
  educationSubLevel?: string;
  quarter?: 'all' | 'q1' | 'q2' | 'q3' | 'full';
  price: number;
  discountPrice?: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  posterUrl?: string;
  samplePdfUrl?: string;
  isActive: boolean;
  isPack?: boolean;
  packArticles?: string[];
  createdAt: string;
  updatedAt: string;
}
```

### `Order`
```typescript
interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryGovernorate: string;
  deliveryCity: string;
  postalCode?: string;
  notes?: string;
  items: {
    articleId: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Integration Integrity Rules

1. **Monetary Integrity:** Never send client-computed delivery fees or final totals as authoritative. The NestJS backend recalculates all fees and totals dynamically.
2. **Authentication Token Persistence:** When admin logs in, the JWT token is passed in the `Authorization: Bearer <token>` header for all administrative API requests.
3. **Graceful Fallback:** If the API backend is unreachable during offline development or static inspection, the client falls back to `MOCK_BOOKS` defined in `apps/web/src/mock/data.ts`.
