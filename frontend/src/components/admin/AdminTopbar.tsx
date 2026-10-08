'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export const AdminTopbar: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--admin-text-primary)', margin: 0 }}>
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
              backgroundColor: 'var(--brand-primary)',
              color: "var(--text-inverse)",
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
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
              Marcus Vance
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Head of Atelier Logistics
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
