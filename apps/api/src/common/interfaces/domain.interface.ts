export type EducationLevelCategory = 'primary' | 'middle' | 'secondary' | 'other';

export interface LocalizedString {
  ar: string;
  fr?: string;
  en?: string;
}

export interface EducationLevel {
  id: string;
  code: string;
  name: LocalizedString;
  category: EducationLevelCategory;
  displayOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Article {
  id: string;
  sku: string;
  name: LocalizedString;
  description?: LocalizedString;
  price: number; // TND
  discountPrice?: number;
  stock?: number;
  educationLevelId: string;
  quarter?: 'Q1' | 'Q2' | 'Q3' | 'ALL_YEAR';
  posterUrl?: string;
  samplePdfUrl?: string;
  author?: string;
  publisher?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackItem {
  articleId: string;
  quantity: number;
}

export interface Pack {
  id: string;
  sku: string;
  name: LocalizedString;
  description?: LocalizedString;
  price: number; // TND
  discountPrice?: number;
  items: PackItem[];
  posterUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  type: 'poster' | 'pdf' | 'other';
  createdAt: string;
}

export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'rejected';

export interface OrderItemSnapshot {
  type: 'article' | 'pack';
  itemId: string;
  name: LocalizedString;
  unitPrice: number;
  discountPrice?: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string; // Tunisian format e.g. +216 XX XXX XXX
  city: string;
  address: string;
  instructions?: string;
}

export interface Order {
  id: string;
  reference: string;
  customer: CustomerDetails;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  appliedDeliveryRuleId?: string;
  total: number;
  status: OrderStatus;
  rejectionReason?: string;
  paymentMethod: 'cash_on_delivery' | 'manual_confirmation';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  rejectionReason?: string;
  changedBy?: string;
  timestamp: string;
}

export interface DeliveryRule {
  id: string;
  name: LocalizedString;
  minSubtotal: number;
  maxSubtotal?: number; // null/undefined = no upper bound
  fee: number;
  isFree: boolean;
  active: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  articleId?: string; // null for general store review
  rating: number; // 1-5
  authorName: string;
  comment: string;
  published: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'customer';
  fullName: string;
  createdAt: string;
  updatedAt: string;
}
