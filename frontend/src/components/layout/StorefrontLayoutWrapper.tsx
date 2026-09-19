'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchOverlay } from '@/components/search/SearchOverlay';
import { ToastContainer } from '@/components/ui/Toast';
import { StorefrontId } from '@/types';

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

  useEffect(() => {
    if (storefrontId) {
      setStorefront(storefrontId);
    } else {
      initStorefront();
    }
  }, [storefrontId, setStorefront, initStorefront]);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <div style={{ flex: 1 }}>{children}</div>
      {isHomePage && <Footer />}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <ToastContainer />
    </div>
  );
};
