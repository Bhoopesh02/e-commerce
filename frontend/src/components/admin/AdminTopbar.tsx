'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { Shield, Sparkles, Bell } from 'lucide-react';

export const AdminTopbar: React.FC = () => {
  const { user } = useAuthStore();
  const { storefront, toggleStorefront } = useStorefrontStore();

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: '#1E1B38',
        borderBottom: '1px solid rgba(232, 188, 185, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        color: '#FFF8F5',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFF8F5', margin: 0 }}>
          Aurelia Central Control Console
        </h2>
        <span
          style={{
            fontSize: '0.72rem',
            padding: '3px 8px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(243, 159, 90, 0.2)',
            color: 'var(--color-sunset-400)',
            fontWeight: 600,
          }}
        >
          Mock API Synchronized
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Storefront switch indicator in Admin */}
        <button
          onClick={toggleStorefront}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(232, 188, 185, 0.25)',
            color: '#FFF',
            fontSize: '0.75rem',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Sparkles size={12} style={{ color: 'var(--color-sunset-400)' }} />
          <span>Active: Storefront {storefront.toUpperCase()}</span>
        </button>

        {/* User Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-sunset-700)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            MV
          </div>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block' }}>
              Marcus Vance
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-sunset-400)' }}>
              Head of Atelier Logistics
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
