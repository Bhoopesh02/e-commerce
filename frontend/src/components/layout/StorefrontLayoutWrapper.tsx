'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { ToastContainer } from '@/components/ui/Toast';
import { StorefrontId } from '@/types';

// Defer off-screen overlays out of critical initial JS bundle
const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((mod) => mod.CartDrawer),
  { ssr: false }
);

interface StorefrontLayoutWrapperProps {
  storefrontId?: StorefrontId;
  children: React.ReactNode;
}

// Exclude footer from account pages, orders, purchasing/checkout flows, and admin panel
const shouldHideFooter = (pathname: string | null): boolean => {
  if (!pathname) return false;
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const excludedPrefixes = [
    '/account',
    '/orders',
    '/order',
    '/cart',
    '/checkout',
    '/payment',
    '/purchase',
    '/confirmation',
    '/admin',
  ];
  return excludedPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
};

export const StorefrontLayoutWrapper: React.FC<StorefrontLayoutWrapperProps> = ({
  storefrontId,
  children,
}) => {
  const { initStorefront, setStorefront } = useStorefrontStore();
  const pathname = usePathname();

  useEffect(() => {
    if (storefrontId) {
      setStorefront(storefrontId);
    } else {
      initStorefront();
    }
  }, [storefrontId, setStorefront, initStorefront]);

  const showFooter = !shouldHideFooter(pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowX: 'clip' }}>
      <Navbar />
      <div style={{ flex: 1 }}>{children}</div>
      {showFooter && <Footer />}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};
