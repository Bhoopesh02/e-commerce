'use client';

import { create } from 'zustand';
import { StorefrontId } from '@/types';

interface StorefrontState {
  storefront: StorefrontId;
  theme: 'light' | 'dark';
  setStorefront: (id: StorefrontId) => void;
  toggleStorefront: () => void;
  toggleTheme: () => void;
  initStorefront: () => void;
}

function getStoredStorefront(): StorefrontId {
  if (typeof window === 'undefined') return 'a';
  try {
    // 1. Check query parameter ?storefront=a
    const urlParams = new URLSearchParams(window.location.search);
    const param = urlParams.get('storefront');
    if (param === 'a') {
      return param;
    }

    // 2. Check localStorage
    const local = window.localStorage.getItem('aurelia_storefront');
    if (local === 'a') {
      return local as StorefrontId;
    }

    // 3. Check document cookie
    const match = document.cookie.match(/storefront=(a)/);
    if (match && match[1] === 'a') {
      return match[1] as StorefrontId;
    }
  } catch {
    // fallback
  }
  return 'a';
}

function setStoredStorefront(id: StorefrontId): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('aurelia_storefront', id);
    document.cookie = `storefront=${id}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.setAttribute('data-storefront', id);
  } catch {
    // ignore
  }
}

export const useStorefrontStore = create<StorefrontState>((set) => ({
  storefront: 'a',
  theme: 'light',

  initStorefront: () => {
    const id = getStoredStorefront();
    setStoredStorefront(id);
    set({ storefront: id });
  },

  setStorefront: (id) => {
    setStoredStorefront(id);
    set({ storefront: id });
  },

  toggleStorefront: () => {
    // Storefront B is removed. Only A exists.
  },

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
      return { theme: nextTheme };
    });
  },
}));
