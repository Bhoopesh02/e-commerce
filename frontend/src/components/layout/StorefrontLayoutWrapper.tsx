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

import { SearchOverlay } from '@/components/search/SearchOverlay';

interface StorefrontLayoutWrapperProps {
  storefrontId?: StorefrontId;
  children: React.ReactNode;
}

export const StorefrontLayoutWrapper: React.FC<StorefrontLayoutWrapperProps> = ({
  storefrontId,
  children,
}) => {
  const { initStorefront, setStorefront } = useStorefrontStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (storefrontId) {
      setStorefront(storefrontId);
    } else {
      initStorefront();
    }
  }, [storefrontId, setStorefront, initStorefront]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <div style={{ flex: 1 }}>{children}</div>
      {(pathname === '/' || pathname === '/shop') && <Footer />}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ToastContainer />
    </div>
  );
};
