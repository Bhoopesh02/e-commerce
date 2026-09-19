'use client';

import { create } from 'zustand';
import { Product, Coupon } from '@/types';
import { applyCoupon } from '@/lib/mockApi';

export interface CartItem {
  product: Product;
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedCoupon: Coupon | null;
  discountAmount: number;
  couponError: string | null;

  checkoutMode: 'cart' | 'buy_now';
  buyNowItem: CartItem | null;

  // Actions
  addItem: (product: Product, sku: string, size: string, color: string, quantity?: number, openDrawer?: boolean) => void;
  setBuyNowItem: (product: Product, sku: string, size: string, color: string, quantity: number) => void;
  clearBuyNowItem: () => void;
  setCheckoutMode: (mode: 'cart' | 'buy_now') => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;

  // Computed
  getActiveItems: () => CartItem[];
  getSubtotal: () => number;
  getTax: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
  getCartItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [
    // Pre-populate with one luxury piece for instant demo delight
    {
      product: {
        id: 'prod_001',
        slug: 'italian-leather-jacket',
        name: 'Italian Leather Jacket',
        subtitle: 'Milanese Full-Grain Nappa',
        description: 'Hand-finished leather jacket crafted in Milan from supple nappa leather.',
        categoryId: 'cat_outerwear',
        price: 24999,
        images: ['/images/products/italian-leather-jacket-1.webp'],
        variants: [
          { sku: 'LJ-BLK-M', size: 'M', color: 'Nocturne Black', stock: 4 }
        ],
        availability: 'low_stock',
        rating: { average: 4.8, count: 32 },
        featured: true,
        tags: ['new-arrival', 'outerwear'],
        storefronts: ['a', 'b']
      },
      sku: 'LJ-BLK-M',
      size: 'M',
      color: 'Nocturne Black',
      quantity: 1,
      price: 24999,
    },
  ],
  isDrawerOpen: false,
  appliedCoupon: null,
  discountAmount: 0,
  couponError: null,
  checkoutMode: 'cart',
  buyNowItem: null,

  setBuyNowItem: (product, sku, size, color, quantity) => {
    set({
      buyNowItem: { product, sku, size, color, quantity, price: product.price },
      checkoutMode: 'buy_now',
    });
  },

  clearBuyNowItem: () => {
    set({ buyNowItem: null, checkoutMode: 'cart' });
  },

  setCheckoutMode: (mode) => set({ checkoutMode: mode }),

  addItem: (product, sku, size, color, quantity = 1, openDrawer = true) => {
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.sku === sku);
      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { items: newItems, isDrawerOpen: openDrawer ? true : state.isDrawerOpen, checkoutMode: 'cart', buyNowItem: null };
      }
      return {
        items: [
          ...state.items,
          { product, sku, size, color, quantity, price: product.price },
        ],
        isDrawerOpen: openDrawer ? true : state.isDrawerOpen,
        checkoutMode: 'cart',
        buyNowItem: null,
      };
    });
  },

  removeItem: (sku) => {
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
    }));
  },

  updateQuantity: (sku, quantity) => {
    if (quantity <= 0) {
      get().removeItem(sku);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.sku === sku ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [], appliedCoupon: null, discountAmount: 0, couponError: null, checkoutMode: 'cart', buyNowItem: null });
  },

  openDrawer: () => set({ isDrawerOpen: true, checkoutMode: 'cart', buyNowItem: null }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen, checkoutMode: 'cart', buyNowItem: null })),

  applyCouponCode: async (code: string) => {
    const subtotal = get().getSubtotal();
    const res = await applyCoupon(code, subtotal);
    if (res.valid && res.coupon) {
      set({
        appliedCoupon: res.coupon,
        discountAmount: res.discountAmount,
        couponError: null,
      });
      return true;
    } else {
      set({ couponError: res.message || 'Invalid coupon' });
      return false;
    }
  },

  removeCoupon: () => set({ appliedCoupon: null, discountAmount: 0, couponError: null }),

  getActiveItems: () => {
    const state = get();
    return state.checkoutMode === 'buy_now' && state.buyNowItem ? [state.buyNowItem] : state.items;
  },

  getSubtotal: () => {
    const state = get();
    const activeItems = state.checkoutMode === 'buy_now' && state.buyNowItem ? [state.buyNowItem] : state.items;
    return activeItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  getTax: () => {
    // 5% luxury apparel GST
    const subtotal = get().getSubtotal() - get().discountAmount;
    return Math.round(Math.max(0, subtotal * 0.05));
  },

  getDeliveryFee: () => {
    // Complimentary White Glove Luxury Delivery on all orders
    return 0;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount;
    const tax = get().getTax();
    const delivery = get().getDeliveryFee();
    return Math.max(0, subtotal - discount + tax + delivery);
  },

  getItemCount: () => {
    const state = get();
    const activeItems = state.checkoutMode === 'buy_now' && state.buyNowItem ? [state.buyNowItem] : state.items;
    return activeItems.reduce((acc, item) => acc + item.quantity, 0);
  },

  getCartItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));
