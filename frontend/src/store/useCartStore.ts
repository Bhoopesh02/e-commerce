'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Coupon, CartValidationResult } from '@/types';
import { applyCoupon, validateCartRealtime } from '@/lib/mockApi';

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

  // Real-time stock & price validation state
  cartValidation: CartValidationResult | null;
  isValidatingCart: boolean;
  validateCart: () => Promise<CartValidationResult>;
  syncPrices: () => void;
  fixStockIssues: () => void;
  updateItemPrice: (sku: string, newPrice: number) => void;

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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
  items: [],
  isDrawerOpen: false,
  appliedCoupon: null,
  discountAmount: 0,
  couponError: null,
  checkoutMode: 'cart',
  buyNowItem: null,
  cartValidation: null,
  isValidatingCart: false,

  validateCart: async () => {
    set({ isValidatingCart: true });
    const activeItems = get().getActiveItems();
    try {
      const result = await validateCartRealtime(
        activeItems.map((item) => ({
          sku: item.sku,
          quantity: item.quantity,
          price: item.price,
        }))
      );
      set({ cartValidation: result, isValidatingCart: false });
      return result;
    } catch {
      set({ isValidatingCart: false });
      return {
        isValid: true,
        hasStockIssues: false,
        hasPriceChanges: false,
        itemValidations: {},
        outOfStockItems: [],
        exceededQuantityItems: [],
        priceChangedItems: [],
      };
    }
  },

  syncPrices: () => {
    const { cartValidation, items, buyNowItem } = get();
    if (!cartValidation) return;

    const newItems = items.map((item) => {
      const v = cartValidation.itemValidations[item.sku];
      if (v && v.isPriceChanged) {
        return {
          ...item,
          price: v.currentPrice,
          product: { ...item.product, price: v.currentPrice },
        };
      }
      return item;
    });

    let newBuyNowItem = buyNowItem;
    if (buyNowItem) {
      const v = cartValidation.itemValidations[buyNowItem.sku];
      if (v && v.isPriceChanged) {
        newBuyNowItem = {
          ...buyNowItem,
          price: v.currentPrice,
          product: { ...buyNowItem.product, price: v.currentPrice },
        };
      }
    }

    set({ items: newItems, buyNowItem: newBuyNowItem });
    get().validateCart();
  },

  fixStockIssues: () => {
    const { cartValidation, items, buyNowItem } = get();
    if (!cartValidation) return;

    const newItems: CartItem[] = [];
    for (const item of items) {
      const v = cartValidation.itemValidations[item.sku];
      if (!v) {
        newItems.push(item);
        continue;
      }
      if (v.isOutOfStock) {
        // Drop out of stock item
        continue;
      }
      if (v.isQuantityExceeded) {
        newItems.push({
          ...item,
          quantity: Math.max(1, v.availableStock),
        });
      } else {
        newItems.push(item);
      }
    }

    let newBuyNow = buyNowItem;
    if (buyNowItem) {
      const v = cartValidation.itemValidations[buyNowItem.sku];
      if (v && v.isOutOfStock) {
        newBuyNow = null;
      } else if (v && v.isQuantityExceeded) {
        newBuyNow = { ...buyNowItem, quantity: Math.max(1, v.availableStock) };
      }
    }

    set({ items: newItems, buyNowItem: newBuyNow });
    get().validateCart();
  },

  updateItemPrice: (sku, newPrice) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.sku === sku
          ? { ...item, price: newPrice, product: { ...item.product, price: newPrice } }
          : item
      ),
      buyNowItem:
        state.buyNowItem?.sku === sku
          ? {
              ...state.buyNowItem,
              price: newPrice,
              product: { ...state.buyNowItem.product, price: newPrice },
            }
          : state.buyNowItem,
    }));
    get().validateCart();
  },

  setBuyNowItem: (product, sku, size, color, quantity) => {
    set({
      buyNowItem: { product, sku, size, color, quantity, price: product.price },
      checkoutMode: 'buy_now',
    });
    get().validateCart();
  },

  clearBuyNowItem: () => {
    set({ buyNowItem: null, checkoutMode: 'cart' });
    get().validateCart();
  },

  setCheckoutMode: (mode) => {
    set({ checkoutMode: mode });
    get().validateCart();
  },

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
    get().validateCart();
  },

  removeItem: (sku) => {
    set((state) => ({
      items: state.items.filter((item) => item.sku !== sku),
    }));
    get().validateCart();
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
    get().validateCart();
  },

  clearCart: () => {
    set({ items: [], appliedCoupon: null, discountAmount: 0, couponError: null, checkoutMode: 'cart', buyNowItem: null, cartValidation: null });
  },

  openDrawer: () => {
    set({ isDrawerOpen: true, checkoutMode: 'cart', buyNowItem: null });
    get().validateCart();
  },
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => {
    const nextState = !get().isDrawerOpen;
    set((state) => ({ isDrawerOpen: !state.isDrawerOpen, checkoutMode: 'cart', buyNowItem: null }));
    if (nextState) get().validateCart();
  },

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
    // 5% luxury apparel GST included in price (standard Indian retail / luxury fashion)
    const net = Math.max(0, get().getSubtotal() - get().discountAmount);
    return Math.round((net * 5) / 105);
  },

  getDeliveryFee: () => {
    // Complimentary White Glove Luxury Delivery on all orders
    return 0;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discountAmount;
    const delivery = get().getDeliveryFee();
    // Prices are inclusive of GST, so tax is already part of the price
    return Math.max(0, subtotal - discount + delivery);
  },

  getItemCount: () => {
    const state = get();
    const activeItems = state.checkoutMode === 'buy_now' && state.buyNowItem ? [state.buyNowItem] : state.items;
    return activeItems.reduce((acc, item) => acc + item.quantity, 0);
  },

  getCartItemCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  },
}),
    {
      name: 'aurelia_cart',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
        discountAmount: state.discountAmount,
        checkoutMode: state.checkoutMode,
        buyNowItem: state.buyNowItem,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (!version || version < 1) {
          if (
            Array.isArray(persistedState?.items) &&
            persistedState.items.length === 1 &&
            persistedState.items[0]?.sku === 'LJ-BLK-M'
          ) {
            return {
              ...persistedState,
              items: [],
            };
          }
        }
        return persistedState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.validateCart();
        }
      },
    }
  )
);
