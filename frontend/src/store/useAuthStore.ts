'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole } from '@/types';
import usersData from '@/data/users.json';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  loginAsCustomer: () => void;
  loginWithPhone: (phone: string, username?: string) => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => {
      const defaultCustomer = (usersData as User[]).find((u) => u.id === 'usr_001') || (usersData as User[])[0];
      const defaultAdmin = (usersData as User[]).find((u) => u.role === 'admin') || (usersData as User[])[3];

      return {
        user: defaultCustomer,
        role: 'customer',
        isAuthenticated: true,

        setUser: (user) => {
          set({
            user,
            role: user ? user.role : 'customer',
            isAuthenticated: !!user,
          });
        },

        setRole: (role) => {
          set((state) => ({
            role,
            user: role === 'admin' ? defaultAdmin : (state.user?.role === 'customer' ? state.user : defaultCustomer),
          }));
        },

        loginAsCustomer: () => {
          set({
            user: defaultCustomer,
            role: 'customer',
            isAuthenticated: true,
          });
        },

        loginWithPhone: (phone: string, username?: string) => {
          const cleanPhone = phone.trim();
          const existingUser = (usersData as User[]).find(
            (u) => u.phone && u.phone.replace(/\s+/g, '') === cleanPhone.replace(/\s+/g, '')
          );

          const userToSet: User = {
            id: existingUser?.id || `usr_${Date.now()}`,
            name: username?.trim() || existingUser?.name || 'Valued Client',
            email: existingUser?.email || `${(username || 'client').toLowerCase().replace(/[^a-z0-9]/g, '') || 'client'}@atelier.com`,
            role: 'customer',
            phone: cleanPhone,
            addresses: existingUser?.addresses || [],
            notificationPreferences: existingUser?.notificationPreferences || {
              emailPromotions: true,
              emailOrderUpdates: true,
              emailNewsletter: true,
              emailSecurityAlerts: true,
            },
          };

          set({
            user: userToSet,
            role: 'customer',
            isAuthenticated: true,
          });
        },

        loginAsAdmin: () => {
          set({
            user: defaultAdmin,
            role: 'admin',
            isAuthenticated: true,
          });
        },

        logout: () => {
          set({
            user: null,
            role: 'customer',
            isAuthenticated: false,
          });
        },
      };
    },
    {
      name: 'aurelia_auth_store',
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
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

