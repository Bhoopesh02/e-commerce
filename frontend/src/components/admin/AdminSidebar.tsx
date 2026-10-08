'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BRAND_NAME } from '@/lib/constants';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Boxes,
  Users,
  RotateCcw,
  BarChart3,
  Settings,
  ArrowLeft,
  Shield,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const DIVISIONS = [
  { id: 'all', name: 'All Divisions' },
  { id: 'cat_outerwear', name: 'Outerwear' },
  { id: 'cat_tailoring', name: 'Tailoring' },
  { id: 'cat_eveningwear', name: 'Eveningwear' },
  { id: 'cat_knitwear', name: 'Knitwear' },
  { id: 'cat_leather_goods', name: 'Leather Goods' },
  { id: 'cat_footwear', name: 'Footwear' },
  { id: 'cat_jewelry', name: 'Fine Jewelry' },
  { id: 'cat_fragrances', name: 'Fragrances' },
];

const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Executive Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/products', label: 'Silhouettes & Catalog', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Commissions & Fulfillment', icon: <ShoppingCart size={18} /> },
  { href: '/admin/returns', label: 'Returns & Authorizations', icon: <RotateCcw size={18} /> },
  { href: '/admin/reports', label: 'Analytics & CSV Export', icon: <BarChart3 size={18} /> },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loginAsCustomer } = useAuthStore();
  
  const [isProductsExpanded, setIsProductsExpanded] = React.useState(pathname === '/admin/products');
  
  const currentCategory = searchParams.get('category') || 'all';

  return (
    <aside className="admin-sidebar">
      {/* Brand Header */}
      <div className="admin-sidebar-header">
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
          }}
        >
          <Shield size={18} />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.12em', fontFamily: 'var(--font-display)', display: 'block' }}>
            {BRAND_NAME}
          </span>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            Atelier Operations
          </span>
        </div>
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
                {isProductsExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '32px', marginTop: '4px', gap: '4px' }}>
                    {DIVISIONS.map(div => {
                      const isDivActive = isActive && currentCategory === div.id;
                      const href = div.id === 'all' ? '/admin/products' : `/admin/products?category=${div.id}`;
                      return (
                        <Link
                          key={div.id}
                          href={href}
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            color: isDivActive ? 'var(--brand-primary)' : 'var(--admin-text-secondary)',
                            textDecoration: 'none',
                            borderRadius: '4px',
                            backgroundColor: isDivActive ? 'var(--overlay-sapphire-10)' : 'transparent',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {div.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
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
          onClick={loginAsCustomer}
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
  );
};
