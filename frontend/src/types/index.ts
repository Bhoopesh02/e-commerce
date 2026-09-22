export type StorefrontId = 'a' | 'b';

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductVariant {
  sku: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  details?: string[];
  materials?: string[];
  careGuide?: string[];
  categoryId: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  availability: AvailabilityStatus;
  rating: ProductRating;
  featured: boolean;
  tags: string[];
  storefronts: StorefrontId[];
  isNewArrival?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  visible: boolean;
  image: string;
  featuredOrder?: number;
  bannerImage?: string;
  bannerHeadline?: string;
  bannerSubtitle?: string;
  bannerBadges?: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: 'published' | 'hidden';
  verifiedPurchase?: boolean;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Address {
  id?: string;
  name?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface PaymentInfo {
  method: 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD';
  status: 'successful' | 'pending' | 'failed';
  transactionId?: string;
  cardLast4?: string;
  upiVpa?: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

export interface TrackingInfo {
  carrier: string;
  trackingId: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

export interface OrderItem {
  productId: string;
  productName?: string;
  productImage?: string;
  sku: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName?: string;
  customerEmail?: string;
  items: OrderItem[];
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  address: Address;
  payment: PaymentInfo;
  totals: OrderTotals;
  trackingInfo?: TrackingInfo;
  createdAt: string;
}

export type UserRole = 'customer' | 'admin';

export interface NotificationPreferences {
  emailPromotions: boolean;
  emailOrderUpdates: boolean;
  emailNewsletter: boolean;
  emailSecurityAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addresses: Address[];
  notificationPreferences?: NotificationPreferences;
}

export type CouponType = 'percentage' | 'fixed';

export interface Coupon {
  code: string;
  type: CouponType;
  value: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  minOrderValue: number;
  maxDiscount?: number;
  active: boolean;
  description?: string;
}

export interface CouponValidationResult {
  valid: boolean;
  discountAmount: number;
  coupon?: Coupon;
  message?: string;
}

export interface Wishlist {
  userId: string;
  productIds: string[];
}

export interface Banner {
  id: string;
  image: string;
  headline: string;
  subheadline?: string;
  cta: string;
  linkTo: string;
  active: boolean;
  sortOrder: number;
  storefront: StorefrontId | 'both';
}

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface TicketResponse {
  id: string;
  authorName: string;
  isAdmin: boolean;
  message: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  responses: TicketResponse[];
}

export type ReturnStatus = 'Requested' | 'Approved' | 'Rejected' | 'Completed';
export type RefundStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ReturnRequest {
  id: string;
  orderId: string;
  userId?: string;
  reason: string;
  comments?: string;
  status: ReturnStatus;
  refundStatus: RefundStatus;
  createdAt: string;
  resolvedAt?: string;
}

export interface SectionConfig {
  id: string;
  type:
    | 'hero'
    | 'brand_intro'
    | 'category_showcase'
    | 'expanding_carousel'
    | 'new_arrivals'
    | 'editorial_campaign'
    | 'trending_products'
    | 'brand_story'
    | 'newsletter';
  title?: string;
  subtitle?: string;
  visible: boolean;
}

export interface StorefrontConfig {
  storefront: StorefrontId;
  name: string;
  mode: 'Editorial' | 'Refined';
  tagline: string;
  sections: SectionConfig[];
}

export interface ProductFilterOptions {
  categorySlug?: string;
  storefront?: StorefrontId;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  availability?: AvailabilityStatus;
  searchQuery?: string;
  tag?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'popularity' | 'rating' | 'newest';
}

export interface ReportFilters {
  dateRange?: '7d' | '30d' | '90d' | 'year' | 'all';
  status?: string;
  categoryId?: string;
  productId?: string;
}

export interface DashboardStats {
  grossRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  averageOrderValue: number;
  lowStockItemsCount: number;
  pendingReturnsCount: number;
  openTicketsCount: number;
}
