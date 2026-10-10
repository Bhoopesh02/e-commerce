import {
  Product,
  Category,
  Review,
  Order,
  OrderStatus,
  User,
  Coupon,
  CouponValidationResult,
  Banner,
  SupportTicket,
  ReturnRequest,
  StorefrontConfig,
  StorefrontId,
  ProductFilterOptions,
  ReportFilters,
  DashboardStats,
  TrackingInfo,
} from '@/types';
import {
  RETURN_WINDOW_DAYS,
  CUSTOMER_CANCELLABLE_STATUSES,
  ADMIN_CANCELLABLE_STATUSES,
  MOCK_API_DELAY_MS,
  LOW_STOCK_THRESHOLD,
} from './constants';

import productsData from '@/data/products.json';
import categoriesData from '@/data/categories.json';
import reviewsData from '@/data/reviews.json';
import ordersData from '@/data/orders.json';
import usersData from '@/data/users.json';
import couponsData from '@/data/coupons.json';
import wishlistsData from '@/data/wishlists.json';
import bannersData from '@/data/banners.json';
import supportTicketsData from '@/data/supportTickets.json';
import returnsData from '@/data/returns.json';
import storefrontConfigData from '@/data/storefrontConfig.json';

// Simulated network latency helper
const delay = (ms: number = MOCK_API_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Helper for client-side localStorage persistence across refreshes
function getInitialData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(`aurelia_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`aurelia_${key}`, JSON.stringify(data));
  } catch {
    // Ignore storage quota issues in mock
  }
}

// In-memory / localStorage state holders
let productsState: Product[] = [...(productsData as Product[])];
let reviewsState: Review[] = [...(reviewsData as Review[])];
let ordersState: Order[] = [...(ordersData as Order[])];
let couponsState: Coupon[] = [...(couponsData as Coupon[])];
let bannersState: Banner[] = [...(bannersData as Banner[])];
let supportTicketsState: SupportTicket[] = [...(supportTicketsData as SupportTicket[])];
let returnsState: ReturnRequest[] = [...(returnsData as ReturnRequest[])];
let wishlistsState: Record<string, string[]> = (wishlistsData as { userId: string; productIds: string[] }[]).reduce(
  (acc, curr) => ({ ...acc, [curr.userId]: curr.productIds }),
  {}
);

// Catalog version tag to invalidate stale client localStorage when products/orders update
const CATALOG_VERSION = '2026.10.10.v1'; // Bump this string to force a cache reset across clients-side state on first mount (runs only once per session)
let isClientStateInitialized = false;

function ensureClientState() {
  if (typeof window === 'undefined' || isClientStateInitialized) return;
  isClientStateInitialized = true;

  const storedVersion = window.localStorage.getItem('aurelia_catalog_version');
  const isVersionMismatch = storedVersion !== CATALOG_VERSION;

  if (isVersionMismatch) {
    // Reset products state to fresh JSON data when catalog version is bumped
    productsState = [...(productsData as Product[])];
    saveData('products', productsState);
    
    // Also reset banners and orders to ensure new metadata/orders show up
    bannersState = [...(bannersData as Banner[])];
    saveData('banners', bannersState);

    ordersState = [...(ordersData as Order[])];
    saveData('orders', ordersState);
    
    window.localStorage.setItem('aurelia_catalog_version', CATALOG_VERSION);
  } else {
    const cachedProducts = getInitialData('products', productsState);
    // Intelligent reconciliation: prioritize fresh JSON fields while preserving active checkout stock changes per SKU
    productsState = (productsData as Product[]).map((fresh) => {
      const cached = cachedProducts.find((c) => c.id === fresh.id);
      if (!cached) return fresh;

      const mergedVariants = (fresh.variants || []).map((freshVariant) => {
        const cachedVariant = (cached.variants || []).find((v) => v.sku === freshVariant.sku);
        return cachedVariant !== undefined ? cachedVariant : freshVariant;
      });

      return {
        ...fresh,
        variants: mergedVariants.length > 0 ? mergedVariants : fresh.variants,
      };
    });
    saveData('products', productsState);
    
    bannersState = getInitialData('banners', bannersState);
  }

  reviewsState = getInitialData('reviews', reviewsState);
  ordersState = getInitialData('orders', ordersState);
  couponsState = getInitialData('coupons', couponsState);
  supportTicketsState = getInitialData('supportTickets', supportTicketsState);
  returnsState = getInitialData('returns', returnsState);
  wishlistsState = getInitialData('wishlists', wishlistsState);
}

// ----------------------------------------------------------------------
// PRODUCTS API
// ----------------------------------------------------------------------
export async function getProducts(filters?: ProductFilterOptions): Promise<Product[]> {
  await delay();
  ensureClientState();
  let list = [...productsState];

  if (filters?.storefront) {
    list = list.filter((p) => p.storefronts.includes(filters.storefront as StorefrontId));
  }

  if (filters?.categorySlug) {
    const category = (categoriesData as Category[]).find((c) => c.slug === filters.categorySlug);
    if (category) {
      list = list.filter((p) => p.categoryId === category.id);
    }
  }

  if (filters?.minPrice !== undefined) {
    list = list.filter((p) => p.price >= (filters.minPrice as number));
  }

  if (filters?.maxPrice !== undefined) {
    list = list.filter((p) => p.price <= (filters.maxPrice as number));
  }

  if (filters?.rating !== undefined) {
    list = list.filter((p) => p.rating.average >= (filters.rating as number));
  }

  if (filters?.availability) {
    list = list.filter((p) => p.availability === filters.availability);
  }

  if (filters?.tag) {
    list = list.filter((p) => p.tags.includes(filters.tag as string));
  }

  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating.average - a.rating.average);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'popularity':
      default:
        list.sort((a, b) => b.rating.count - a.rating.count);
        break;
    }
  }

  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await delay();
  ensureClientState();
  const product = productsState.find((p) => p.slug === slug);
  return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  await delay();
  ensureClientState();
  const product = productsState.find((p) => p.id === id);
  return product || null;
}

export async function getFeaturedProducts(storefront?: StorefrontId): Promise<Product[]> {
  await delay();
  ensureClientState();
  let list = productsState.filter((p) => p.featured);
  if (storefront) {
    list = list.filter((p) => p.storefronts.includes(storefront));
  }
  return list;
}

export async function getNewArrivals(storefront?: StorefrontId): Promise<Product[]> {
  await delay();
  ensureClientState();
  let list = productsState.filter((p) => p.isNewArrival);
  if (storefront) {
    list = list.filter((p) => p.storefronts.includes(storefront));
  }
  return list;
}

export async function getTrendingProducts(storefront?: StorefrontId): Promise<Product[]> {
  await delay();
  ensureClientState();
  let list = productsState.filter((p) => p.isTrending);
  if (storefront) {
    list = list.filter((p) => p.storefronts.includes(storefront));
  }
  return list;
}

export async function createProduct(productData: Partial<Product> & { name: string; price: number; categoryId: string; images: string[] }): Promise<Product> {
  await delay();
  ensureClientState();
  const id = `prod_${Date.now()}`;
  const slug = (productData.name || 'silhouette')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const newProduct: Product = {
    id,
    slug: `${slug}-${id.slice(-4)}`,
    name: productData.name,
    subtitle: productData.subtitle || `${productData.name} Silhouette`,
    description: productData.description || 'Architectural couture silhouette tailored for the seasonal collection.',
    categoryId: productData.categoryId,
    price: Number(productData.price),
    compareAtPrice: productData.compareAtPrice,
    images: productData.images,
    variants: productData.variants && productData.variants.length > 0 ? productData.variants : [
      { sku: `${id.toUpperCase()}-STD`, size: 'Standard', color: 'Noir', stock: 12 },
      { sku: `${id.toUpperCase()}-38`, size: '38 FR', color: 'Noir', stock: 6 },
      { sku: `${id.toUpperCase()}-40`, size: '40 FR', color: 'Noir', stock: 8 },
    ],
    availability: productData.availability || 'in_stock',
    rating: productData.rating || { average: 5.0, count: 1 },
    featured: productData.featured ?? true,
    tags: productData.tags || ['Atelier', 'New Arrival', 'Silhouette'],
    storefronts: productData.storefronts || ['a'],
    isNewArrival: true,
    isTrending: false,
    details: productData.details || ['Hand-finished edge tailoring', 'Signature Atelier silhouette construction'],
    materials: productData.materials || ['100% Virgin Wool / Silk'],
    careGuide: productData.careGuide || ['Specialist dry clean only'],
  };

  productsState = [newProduct, ...productsState];
  saveData('products', productsState);
  return newProduct;
}

// ----------------------------------------------------------------------
// CATEGORIES API
// ----------------------------------------------------------------------
export async function getCategories(): Promise<Category[]> {
  await delay();
  return (categoriesData as Category[]).filter((c) => c.visible);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay();
  const cat = (categoriesData as Category[]).find((c) => c.slug === slug);
  return cat || null;
}

// ----------------------------------------------------------------------
// REVIEWS API
// ----------------------------------------------------------------------
export async function getReviews(productId: string): Promise<Review[]> {
  await delay();
  ensureClientState();
  return reviewsState.filter((r) => r.productId === productId && r.status === 'published');
}

export async function addReview(
  reviewData: Omit<Review, 'id' | 'date' | 'status'>
): Promise<Review> {
  await delay();
  ensureClientState();
  const newReview: Review = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    date: new Date().toISOString(),
    status: 'published',
  };
  reviewsState = [newReview, ...reviewsState];
  saveData('reviews', reviewsState);
  return newReview;
}

// ----------------------------------------------------------------------
// BANNERS & STOREFRONT CONFIG API
// ----------------------------------------------------------------------
export async function getBanners(storefront: StorefrontId): Promise<Banner[]> {
  await delay();
  ensureClientState();
  return bannersState
    .filter((b) => b.active && (b.storefront === storefront || b.storefront === 'both'))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getStorefrontConfig(storefront: StorefrontId): Promise<StorefrontConfig> {
  await delay();
  const configs = storefrontConfigData as Record<string, StorefrontConfig>;
  return configs[storefront] || configs['a'];
}

// ----------------------------------------------------------------------
// ORDERS & BUSINESS RULES API
// ----------------------------------------------------------------------
export async function getOrders(userId?: string): Promise<Order[]> {
  await delay();
  ensureClientState();
  if (userId) {
    return ordersState.filter((o) => o.userId === userId);
  }
  return ordersState;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  await delay();
  ensureClientState();
  const order = ordersState.find((o) => o.id === orderId);
  return order || null;
}

/**
 * Order Cancellation Rule:
 * - Customer can cancel only while status is 'Placed' or 'Confirmed'.
 * - Once 'Packed' or later, only Admin can cancel, and only BEFORE 'Shipped'.
 */
export async function cancelOrder(
  orderId: string,
  actor: 'customer' | 'admin'
): Promise<{ success: boolean; order?: Order; error?: string }> {
  await delay();
  ensureClientState();
  const index = ordersState.findIndex((o) => o.id === orderId);
  if (index === -1) {
    return { success: false, error: 'Order not found.' };
  }

  const order = ordersState[index];

  if (actor === 'customer') {
    if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status as typeof CUSTOMER_CANCELLABLE_STATUSES[number])) {
      return {
        success: false,
        error: `Cancellation is no longer available for status "${order.status}". Orders already packed or dispatched require client concierge assistance.`,
      };
    }
  } else if (actor === 'admin') {
    if (!ADMIN_CANCELLABLE_STATUSES.includes(order.status as typeof ADMIN_CANCELLABLE_STATUSES[number])) {
      return {
        success: false,
        error: `Admin cancellation permitted only prior to shipment. Current status is "${order.status}".`,
      };
    }
  }

  const updatedOrder: Order = {
    ...order,
    status: 'Cancelled',
    statusHistory: [
      ...order.statusHistory,
      {
        status: 'Cancelled',
        timestamp: new Date().toISOString(),
        note: `Cancelled by ${actor}`,
      },
    ],
  };

  ordersState[index] = updatedOrder;
  saveData('orders', ordersState);
  return { success: true, order: updatedOrder };
}

/**
 * Returns Rule:
 * Returns can be requested only when status is 'Delivered', within 7 days of delivery date.
 */
export async function requestReturn(
  orderId: string,
  reason: string,
  comments?: string
): Promise<{ success: boolean; returnRequest?: ReturnRequest; error?: string }> {
  await delay();
  ensureClientState();
  const order = ordersState.find((o) => o.id === orderId);
  if (!order) {
    return { success: false, error: 'Order not found.' };
  }

  if (order.status !== 'Delivered') {
    return {
      success: false,
      error: 'Return requests can only be initiated once an order has been Delivered.',
    };
  }

  // Check delivery timestamp against RETURN_WINDOW_DAYS
  const deliveredEntry = order.statusHistory.find((h) => h.status === 'Delivered');
  if (deliveredEntry) {
    const deliveryDate = new Date(deliveredEntry.timestamp).getTime();
    const daysSinceDelivery = (Date.now() - deliveryDate) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
      return {
        success: false,
        error: `The ${RETURN_WINDOW_DAYS}-day return privilege window for this order has expired.`,
      };
    }
  }

  const newReturn: ReturnRequest = {
    id: `ret_${Date.now()}`,
    orderId: order.id,
    userId: order.userId,
    reason,
    comments,
    status: 'Requested',
    refundStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  returnsState = [newReturn, ...returnsState];
  saveData('returns', returnsState);
  return { success: true, returnRequest: newReturn };
}

export async function getReturns(userId?: string): Promise<ReturnRequest[]> {
  await delay();
  ensureClientState();
  if (userId) {
    return returnsState.filter((r) => r.userId === userId);
  }
  return returnsState;
}

export async function getReturnById(returnId: string): Promise<ReturnRequest | null> {
  await delay();
  ensureClientState();
  const req = returnsState.find((r) => r.id === returnId);
  return req || null;
}

// ----------------------------------------------------------------------
// CHECKOUT STOCK REVALIDATION & CREATION
// ----------------------------------------------------------------------
/**
 * At checkout, revalidate each cart item's stock against products.json before allowing order placement.
 */
export async function validateStock(
  items: { sku: string; quantity: number }[]
): Promise<{ valid: boolean; outOfStockSkus: string[]; message?: string }> {
  await delay(150);
  ensureClientState();
  const outOfStockSkus: string[] = [];

  for (const item of items) {
    let found = false;
    for (const p of productsState) {
      const variant = p.variants.find((v) => v.sku === item.sku);
      if (variant) {
        found = true;
        if (variant.stock < item.quantity) {
          outOfStockSkus.push(item.sku);
        }
        break;
      }
    }
    if (!found) {
      outOfStockSkus.push(item.sku);
    }
  }

  if (outOfStockSkus.length > 0) {
    return {
      valid: false,
      outOfStockSkus,
      message: `Some items in your bag (${outOfStockSkus.join(', ')}) are no longer available in the requested quantity. Please update your bag.`,
    };
  }

  return { valid: true, outOfStockSkus: [] };
}

export async function placeOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'statusHistory'>): Promise<{
  success: boolean;
  order?: Order;
  error?: string;
}> {
  await delay(300);
  ensureClientState();

  // 1. Stock revalidation check
  const stockCheck = await validateStock(
    orderData.items.map((i) => ({ sku: i.sku, quantity: i.quantity }))
  );
  if (!stockCheck.valid) {
    return { success: false, error: stockCheck.message };
  }

  // 2. Decrement stock
  for (const item of orderData.items) {
    for (const product of productsState) {
      const variant = product.variants.find((v) => v.sku === item.sku);
      if (variant) {
        variant.stock = Math.max(0, variant.stock - item.quantity);
        // update overall availability
        const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);
        if (totalStock === 0) {
          product.availability = 'out_of_stock';
        } else if (totalStock <= LOW_STOCK_THRESHOLD) {
          product.availability = 'low_stock';
        }
      }
    }
  }
  saveData('products', productsState);

  // 3. Create order
  const newOrder: Order = {
    ...orderData,
    id: `ord_${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
    status: 'Placed',
    statusHistory: [
      {
        status: 'Placed',
        timestamp: new Date().toISOString(),
        note: 'Order confirmed and registered at Aurelia Central Atelier.',
      },
    ],
  };

  ordersState = [newOrder, ...ordersState];
  saveData('orders', ordersState);
  return { success: true, order: newOrder };
}

// ----------------------------------------------------------------------
// COUPONS API
// ----------------------------------------------------------------------
export async function applyCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidationResult> {
  await delay(200);
  ensureClientState();
  const coupon = couponsState.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: 'Invalid promotional code.' };
  }

  if (!coupon.active) {
    return { valid: false, discountAmount: 0, message: 'This privilege code has expired.' };
  }

  if (new Date(coupon.expiryDate).getTime() < Date.now()) {
    return { valid: false, discountAmount: 0, message: 'This privilege code has reached its validity date.' };
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      message: `Minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')} required for code ${coupon.code}.`,
    };
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.value;
  }

  return {
    valid: true,
    discountAmount,
    coupon,
    message: `Privilege code ${coupon.code} applied successfully!`,
  };
}

export async function getCoupons(): Promise<Coupon[]> {
  await delay();
  ensureClientState();
  return couponsState.filter((c) => c.active);
}

// ----------------------------------------------------------------------
// AUTH & USERS (MOCK COGNITO)
// ----------------------------------------------------------------------
export async function getUsers(): Promise<User[]> {
  await delay();
  return usersData as User[];
}

export async function getCurrentUser(userId: string = 'usr_001'): Promise<User | null> {
  await delay();
  const user = (usersData as User[]).find((u) => u.id === userId);
  return user || null;
}

export async function loginUser(email: string): Promise<User> {
  await delay(350);
  const found = (usersData as User[]).find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (found) {
    return found;
  }
  // Auto register mock client if not found
  return {
    id: `usr_${Date.now()}`,
    name: email.split('@')[0].toUpperCase(),
    email,
    role: 'customer',
    addresses: [],
    notificationPreferences: {
      emailPromotions: true,
      emailOrderUpdates: true,
      emailNewsletter: true,
      emailSecurityAlerts: true,
    },
  };
}

// ----------------------------------------------------------------------
// WISHLIST API
// ----------------------------------------------------------------------
export async function getWishlist(userId: string = 'usr_001'): Promise<string[]> {
  await delay(100);
  ensureClientState();
  return wishlistsState[userId] || [];
}

export async function toggleWishlist(userId: string = 'usr_001', productId: string): Promise<string[]> {
  await delay(150);
  ensureClientState();
  const current = wishlistsState[userId] || [];
  const updated = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];
  wishlistsState = { ...wishlistsState, [userId]: updated };
  saveData('wishlists', wishlistsState);
  return updated;
}

// ----------------------------------------------------------------------
// SUPPORT TICKETS API
// ----------------------------------------------------------------------
export async function getSupportTickets(userId?: string): Promise<SupportTicket[]> {
  await delay();
  ensureClientState();
  if (userId) {
    return supportTicketsState.filter((t) => t.userId === userId);
  }
  return supportTicketsState;
}

export async function createSupportTicket(
  data: Omit<SupportTicket, 'id' | 'createdAt' | 'status' | 'responses'>
): Promise<SupportTicket> {
  await delay(250);
  ensureClientState();
  const newTicket: SupportTicket = {
    ...data,
    id: `tkt_${Date.now().toString().slice(-5)}`,
    status: 'Open',
    createdAt: new Date().toISOString(),
    responses: [],
  };
  supportTicketsState = [newTicket, ...supportTicketsState];
  saveData('supportTickets', supportTicketsState);
  return newTicket;
}

export async function addTicketResponse(
  ticketId: string,
  message: string,
  isAdmin: boolean,
  authorName: string
): Promise<SupportTicket> {
  await delay(200);
  ensureClientState();
  const ticketIndex = supportTicketsState.findIndex((t) => t.id === ticketId);
  if (ticketIndex === -1) {
    throw new Error('Ticket not found');
  }

  const responseItem = {
    id: `resp_${Date.now()}`,
    authorName,
    isAdmin,
    message,
    createdAt: new Date().toISOString(),
  };

  const updatedTicket = {
    ...supportTicketsState[ticketIndex],
    status: isAdmin ? ('In Progress' as const) : supportTicketsState[ticketIndex].status,
    responses: [...supportTicketsState[ticketIndex].responses, responseItem],
  };

  supportTicketsState[ticketIndex] = updatedTicket;
  saveData('supportTickets', supportTicketsState);
  return updatedTicket;
}

// ----------------------------------------------------------------------
// ADMIN OPERATIONS & REPORT EXPORT
// ----------------------------------------------------------------------
export async function adminGetDashboardStats(): Promise<DashboardStats> {
  await delay();
  ensureClientState();
  const grossRevenue = ordersState
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totals.total, 0);

  const lowStockItemsCount = productsState.filter(
    (p) => p.availability === 'low_stock' || p.availability === 'out_of_stock'
  ).length;

  const pendingReturnsCount = returnsState.filter((r) => r.status === 'Requested').length;
  const openTicketsCount = supportTicketsState.filter((t) => t.status === 'Open' || t.status === 'In Progress').length;

  return {
    grossRevenue,
    totalOrders: ordersState.length,
    activeCustomers: (usersData as User[]).filter((u) => u.role === 'customer').length,
    averageOrderValue: ordersState.length > 0 ? Math.round(grossRevenue / ordersState.length) : 0,
    lowStockItemsCount,
    pendingReturnsCount,
    openTicketsCount,
  };
}

export async function adminUpdateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingInfo?: TrackingInfo
): Promise<Order> {
  await delay(250);
  ensureClientState();
  const index = ordersState.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Order not found');

  const order = ordersState[index];
  const updatedOrder: Order = {
    ...order,
    status,
    trackingInfo: trackingInfo || order.trackingInfo,
    statusHistory: [
      ...order.statusHistory,
      {
        status,
        timestamp: new Date().toISOString(),
        note: `Updated by Atelier Operations (${status})`,
      },
    ],
  };

  ordersState[index] = updatedOrder;
  saveData('orders', ordersState);
  return updatedOrder;
}

export async function adminUpdateProductStock(
  sku: string,
  newStock: number
): Promise<boolean> {
  await delay(200);
  ensureClientState();
  let found = false;
  for (const p of productsState) {
    const variant = p.variants.find((v) => v.sku === sku);
    if (variant) {
      variant.stock = Math.max(0, newStock);
      found = true;
      const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);
      if (totalStock === 0) {
        p.availability = 'out_of_stock';
      } else if (totalStock <= LOW_STOCK_THRESHOLD) {
        p.availability = 'low_stock';
      } else {
        p.availability = 'in_stock';
      }
      break;
    }
  }

  if (found) {
    saveData('products', productsState);
  }
  return found;
}

export async function adminProcessReturn(
  returnId: string,
  status: 'Approved' | 'Rejected',
  refundStatus: 'completed' | 'failed'
): Promise<ReturnRequest> {
  await delay(250);
  ensureClientState();
  const index = returnsState.findIndex((r) => r.id === returnId);
  if (index === -1) throw new Error('Return request not found');

  const updated: ReturnRequest = {
    ...returnsState[index],
    status,
    refundStatus,
    resolvedAt: new Date().toISOString(),
  };

  returnsState[index] = updated;
  saveData('returns', returnsState);
  return updated;
}

/**
 * Functional Client-Side CSV Export (Decided Requirement):
 * Filters relevant dataset client-side, serializes rows to CSV, and generates download.
 */
export async function adminExportReport(
  reportType: 'orders' | 'inventory' | 'sales' | 'customers',
  filters?: ReportFilters
): Promise<string> {
  await delay(300);
  ensureClientState();

  let csvContent = '';

  if (reportType === 'orders' || reportType === 'sales') {
    let list = [...ordersState];
    if (filters?.status) {
      list = list.filter((o) => o.status === filters.status);
    }
    const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Status', 'Date', 'Subtotal (INR)', 'Discount', 'Tax', 'Total (INR)', 'Payment Method', 'Carrier', 'Tracking ID'];
    const rows = list.map((o) => [
      o.id,
      `"${o.customerName || ''}"`,
      o.customerEmail || '',
      o.status,
      o.createdAt,
      o.totals.subtotal,
      o.totals.discount,
      o.totals.tax,
      o.totals.total,
      o.payment.method,
      o.trackingInfo?.carrier || '',
      o.trackingInfo?.trackingId || '',
    ]);

    csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  } else if (reportType === 'inventory') {
    const headers = ['Product ID', 'Product Name', 'SKU', 'Size', 'Color', 'Stock', 'Availability', 'Price (INR)'];
    const rows: string[][] = [];
    for (const p of productsState) {
      for (const v of p.variants) {
        rows.push([
          p.id,
          `"${p.name}"`,
          v.sku,
          v.size,
          v.color,
          v.stock.toString(),
          p.availability,
          p.price.toString(),
        ]);
      }
    }
    csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  } else if (reportType === 'customers') {
    const headers = ['User ID', 'Name', 'Email', 'Role', 'Phone', 'Orders Count'];
    const users = usersData as User[];
    const rows = users.map((u) => {
      const userOrders = ordersState.filter((o) => o.userId === u.id);
      return [
        u.id,
        `"${u.name}"`,
        u.email,
        u.role,
        u.phone || '',
        userOrders.length.toString(),
      ];
    });
    csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  return csvContent;
}

export async function adminUpdateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await delay(200);
  ensureClientState();
  const index = productsState.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');

  const updatedProduct = { ...productsState[index], ...updates };
  productsState[index] = updatedProduct;
  saveData('products', productsState);
  return updatedProduct;
}

export async function adminDeleteProduct(id: string): Promise<boolean> {
  await delay(200);
  ensureClientState();
  const initialLength = productsState.length;
  productsState = productsState.filter((p) => p.id !== id);
  const deleted = productsState.length < initialLength;
  if (deleted) {
    saveData('products', productsState);
  }
  return deleted;
}

/**
 * Triggers native browser download of generated CSV content via Blob + Object URL
 */
export function triggerCsvDownload(csvString: string, filename: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
