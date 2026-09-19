'use client';

import { create } from 'zustand';
import { User, UserRole } from '@/types';
import usersData from '@/data/users.json';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setRole: (role: UserRole) => void;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
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
});
