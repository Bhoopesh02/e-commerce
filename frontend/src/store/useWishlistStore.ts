'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toggleWishlist, getWishlist } from '@/lib/mockApi';

interface WishlistState {
  productIds: string[];
  isLoading: boolean;
  hydrated: boolean;
  setHydrated: (val: boolean) => void;
  initWishlist: (userId?: string) => Promise<void>;
  toggleItem: (productId: string, userId?: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      isLoading: false,
      hydrated: false,
      setHydrated: (val: boolean) => set({ hydrated: val }),

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
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (!version || version < 1) {
          if (
            Array.isArray(persistedState?.productIds) &&
            persistedState.productIds.length === 3 &&
            persistedState.productIds.includes('prod_001') &&
            persistedState.productIds.includes('prod_004') &&
            persistedState.productIds.includes('prod_008')
          ) {
            return {
              ...persistedState,
              productIds: [],
            };
          }
        }
        return persistedState;
      },
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
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
