'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toggleWishlist, getWishlist } from '@/lib/mockApi';

interface WishlistState {
  productIds: string[];
  isLoading: boolean;
  initWishlist: (userId?: string) => Promise<void>;
  toggleItem: (productId: string, userId?: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: ['prod_001', 'prod_004', 'prod_008'],
      isLoading: false,

      initWishlist: async (userId = 'usr_001') => {
        set({ isLoading: true });
        try {
          const ids = await getWishlist(userId);
          set({ productIds: ids, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      toggleItem: async (productId, userId = 'usr_001') => {
        // Optimistic update
        const current = get().productIds;
        const exists = current.includes(productId);
        const updated = exists
          ? current.filter((id) => id !== productId)
          : [...current, productId];

        set({ productIds: updated });
        try {
          await toggleWishlist(userId, productId);
        } catch {
          // Revert if error
          set({ productIds: current });
        }
      },

      isInWishlist: (productId) => {
        return get().productIds.includes(productId);
      },
    }),
    {
      name: 'aurelia_wishlist_store',
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
        productIds: state.productIds,
      }),
    }
  )
);
