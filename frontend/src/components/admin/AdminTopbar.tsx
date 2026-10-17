'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAdminNavStore } from '@/store/useAdminNavStore';
import { Menu, X, Shield } from 'lucide-react';
import { BRAND_NAME } from '@/lib/constants';

export const AdminTopbar: React.FC = () => {
  const { user } = useAuthStore();
  const { isMobileSidebarOpen, toggleMobileSidebar } = useAdminNavStore();

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Mobile Brand indicator (Visible <= 1024px) */}
        <div className="admin-topbar-mobile-brand">
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-inverse)',
              flexShrink: 0,
            }}
          >
            <Shield size={16} />
          </div>
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <span
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-display)',
                display: 'block',
                lineHeight: 1.1,
                whiteSpace: 'nowrap',
              }}
            >
              {BRAND_NAME}
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              Atelier Operations
            </span>
          </div>
        </div>

        {/* Desktop Title (Hidden <= 1024px) */}
        <h2
          className="admin-topbar-desktop-title"
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--admin-text-primary)',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Aurelia Central Control Console
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* User Pill */}
        <div className="admin-topbar-user-pill" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--text-inverse)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            MV
          </div>
          <div className="admin-topbar-user-info">
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
              Marcus Vance
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Head of Atelier Logistics
            </span>
          </div>
        </div>

        {/* Mobile Menu Button on Top Right Corner (Visible <= 1024px) */}
        <button
          type="button"
          onClick={toggleMobileSidebar}
          className="admin-menu-toggle-btn"
          aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileSidebarOpen}
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
};

