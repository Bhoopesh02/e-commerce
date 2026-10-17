'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BRAND_NAME } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminNavStore } from '@/store/useAdminNavStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  RotateCcw,
  ArrowLeft,
  Shield,
  ChevronDown,
  ChevronRight,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DIVISIONS = [
  { id: 'all', name: 'All Divisions' },
  { id: 'cat_eveningwear', name: 'Eveningwear' },
  { id: 'cat_jewelry', name: 'Fine Jewelry' },
  { id: 'cat_footwear', name: 'Footwear' },
  { id: 'cat_fragrances', name: 'Fragrances' },
  { id: 'cat_knitwear', name: 'Knitwear' },
  { id: 'cat_leather_goods', name: 'Leather Goods' },
  { id: 'cat_outerwear', name: 'Outerwear' },
  { id: 'cat_tailoring', name: 'Tailoring' },
];

const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Executive Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/products', label: 'Silhouettes & Catalog', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Commissions & Fulfillment', icon: <ShoppingCart size={18} /> },
  { href: '/admin/returns', label: 'Returns & Authorizations', icon: <RotateCcw size={18} /> },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loginAsCustomer } = useAuthStore();
  const { isMobileSidebarOpen, closeMobileSidebar } = useAdminNavStore();
  
  const [isProductsExpanded, setIsProductsExpanded] = React.useState(pathname === '/admin/products');
  const activeDivRef = React.useRef<HTMLAnchorElement>(null);
  
  const currentCategory = searchParams.get('category') || 'all';

  // Automatically close mobile sidebar on route or search param change
  React.useEffect(() => {
    closeMobileSidebar();
  }, [pathname, searchParams, closeMobileSidebar]);

  // Handle escape key and lock body scroll on mobile when sidebar is open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileSidebar();
      }
    };

    if (isMobileSidebarOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen, closeMobileSidebar]);

  // Automatically keep selected category in view inside the scroll container
  React.useEffect(() => {
    if (isProductsExpanded && activeDivRef.current) {
      activeDivRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [isProductsExpanded, currentCategory]);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`admin-sidebar-backdrop ${isMobileSidebarOpen ? 'is-open' : ''}`}
        onClick={closeMobileSidebar}
        aria-hidden="true"
      />

      <aside
        className={`admin-sidebar ${isMobileSidebarOpen ? 'admin-sidebar-mobile-open' : ''}`}
        aria-label="Admin Navigation"
      >
        {/* Brand Header */}
        <div className="admin-sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: "var(--text-inverse)",
                flexShrink: 0,
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <span style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.12em', fontFamily: 'var(--font-display)', display: 'block', lineHeight: 1.1 }}>
                {BRAND_NAME}
              </span>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                Atelier Operations
              </span>
            </div>
          </div>

          {/* Close button inside sidebar on mobile */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            className="admin-sidebar-close-btn"
            aria-label="Close navigation sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="admin-sidebar-nav">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            
            if (item.href === '/admin/products') {
              return (
                <div key={item.href} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    className={`admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
                    onClick={() => setIsProductsExpanded(!isProductsExpanded)}
                    style={{ width: '100%', justifyContent: 'space-between', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    aria-expanded={isProductsExpanded}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: isActive ? 'var(--brand-primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}>
                      {isProductsExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isProductsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          className="admin-dropdown-scroll-container"
                          data-lenis-prevent="true"
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginLeft: '32px',
                            marginTop: '4px',
                            gap: '4px',
                          }}
                        >
                          {DIVISIONS.map(div => {
                            const isDivActive = isActive && currentCategory === div.id;
                            const href = div.id === 'all' ? '/admin/products' : `/admin/products?category=${div.id}`;
                            return (
                              <Link
                                key={div.id}
                                ref={isDivActive ? activeDivRef : undefined}
                                href={href}
                                onClick={closeMobileSidebar}
                                style={{
                                  padding: '6px 12px',
                                  fontSize: '0.85rem',
                                  color: isDivActive ? 'var(--brand-primary)' : 'var(--admin-text-secondary)',
                                  textDecoration: 'none',
                                  borderRadius: '4px',
                                  backgroundColor: isDivActive ? 'var(--overlay-sapphire-10)' : 'transparent',
                                  transition: 'all 0.2s ease',
                                  fontWeight: isDivActive ? 600 : 400,
                                }}
                              >
                                {div.name}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`}
              >
                <span style={{ color: isActive ? 'var(--brand-primary)' : 'inherit', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Return to Customer Storefront Shortcut */}
        <div className="admin-sidebar-footer">
          <Link
            href="/"
            onClick={() => {
              loginAsCustomer();
              closeMobileSidebar();
            }}
            className="admin-nav-link"
            style={{
              justifyContent: 'center',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--admin-border)',
              color: 'var(--admin-text-secondary)',
              fontSize: '0.82rem',
            }}
          >
            <ArrowLeft size={14} /> Return to Storefront
          </Link>
        </div>
      </aside>
    </>
  );
};

