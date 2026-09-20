'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminTopbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header
      style={{
        height: '68px',
        backgroundColor: 'var(--color-sunset-900)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
