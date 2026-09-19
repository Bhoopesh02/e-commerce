'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Executive Overview', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/products', label: 'Silhouettes & Catalog', icon: <Package size={18} /> },
  { href: '/admin/orders', label: 'Commissions & Fulfillment', icon: <ShoppingCart size={18} /> },
  { href: '/admin/reports', label: 'Analytics & CSV Export', icon: <BarChart3 size={18} /> },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { loginAsCustomer } = useAuthStore();

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: '#16132C',
        color: '#FFF8F5',
        borderRight: '1px solid rgba(232, 188, 185, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px',
          borderBottom: '1px solid rgba(232, 188, 185, 0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-sunset-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFF',
          }}
        >
          <Shield size={18} />
        </div>
        <div>
          <span style={{ fontSize: '1.05rem', fontWeight: 600, letterSpacing: '0.12em', fontFamily: 'var(--font-display)', display: 'block' }}>
            {BRAND_NAME}
          </span>
          <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-sunset-400)' }}>
            Atelier Operations
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {ADMIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFF' : 'rgba(232, 188, 185, 0.75)',
                backgroundColor: isActive ? 'rgba(243, 159, 90, 0.18)' : 'transparent',
                border: isActive ? '1px solid rgba(243, 159, 90, 0.35)' : '1px solid transparent',
                transition: 'all var(--duration-fast)',
              }}
            >
              <span style={{ color: isActive ? 'var(--color-sunset-400)' : 'inherit' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Return to Customer Storefront Shortcut */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(232, 188, 185, 0.12)' }}>
        <Link
          href="/"
          onClick={loginAsCustomer}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(232, 188, 185, 0.2)',
            color: '#FFF8F5',
            fontSize: '0.82rem',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={14} /> Return to Storefront
        </Link>
      </div>
    </aside>
  );
};
