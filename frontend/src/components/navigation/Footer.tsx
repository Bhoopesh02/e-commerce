'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storefront, toggleStorefront } = useStorefrontStore();
  const { role, loginAsCustomer, loginAsAdmin } = useAuthStore();

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-sunset-900)',
        color: '#FFF8F5',
        borderTop: '1px solid rgba(232, 188, 185, 0.2)',
        paddingTop: '80px',
        paddingBottom: '40px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Top Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
            marginBottom: '64px',
          }}
        >
          {/* Brand Col */}
          <div style={{ maxWidth: '340px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                letterSpacing: '0.18em',
                marginBottom: '12px',
                color: '#FFF8F5',
              }}
            >
              {BRAND_NAME}
            </h2>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--color-sunset-200)',
                lineHeight: 1.7,
                marginBottom: '24px',
              }}
            >
              {BRAND_TAGLINE}. Crafted between Milan, Tuscany, and Paris with traceable European materials and enduring silhouette integrity.
            </p>

            {/* Storefront Experience Switcher Card */}
            <div
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(232, 188, 185, 0.25)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-sunset-400)' }}>
                  Active Storefront Mode
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                  {storefront === 'a' ? 'Storefront A (Editorial)' : 'Storefront B (Refined)'}
                </span>
                <button
                  onClick={toggleStorefront}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-sunset-400)',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  Switch to {storefront === 'a' ? 'Refined' : 'Editorial'}
                </button>
              </div>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-sunset-200)',
                marginBottom: '20px',
              }}
            >
              Collections
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/shop?categorySlug=outerwear" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Outerwear & Coats
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=tailoring" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Bespoke Tailoring
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=eveningwear" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Silk Eveningwear
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=knitwear" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Cashmere Knitwear
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=leather-goods" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Hand-Finished Leather
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-sunset-200)',
                marginBottom: '20px',
              }}
            >
              Client Concierge
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>
                <Link href="/account" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Private Client Account
                </Link>
              </li>
              <li>
                <Link href="/account/support" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Bespoke Inquiries & Support
                </Link>
              </li>
              <li>
                <Link href="/offers" style={{ fontSize: '0.9rem', color: '#E8BCB9' }}>
                  Seasonal Privileges
                </Link>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem', color: 'rgba(232, 188, 185, 0.7)' }}>
                  Dispatches via Email Only
                </span>
              </li>
              <li>
                <span style={{ fontSize: '0.85rem', color: 'rgba(232, 188, 185, 0.7)' }}>
                  7-Day Delivery Return Window
                </span>
              </li>
            </ul>
          </div>

          {/* Admin & Role Matrix Demo Switcher */}
          <div>
            <h4
              style={{
                fontSize: '0.82rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--color-sunset-200)',
                marginBottom: '20px',
              }}
            >
              Role & Portal Access
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#E8BCB9', marginBottom: '16px', lineHeight: 1.6 }}>
              Current actor is <strong>{role.toUpperCase()}</strong>. Switch roles below to test client vs admin controls:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={loginAsCustomer}
                style={{
                  textAlign: 'left',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: role === 'customer' ? 'var(--color-sunset-600)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                ✓ View as Customer (Ayesha Rahman)
              </button>
              <button
                onClick={loginAsAdmin}
                style={{
                  textAlign: 'left',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: role === 'admin' ? 'var(--color-sunset-600)' : 'rgba(255, 255, 255, 0.08)',
                  color: '#FFF',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                ✓ View as Admin (Marcus Vance)
              </button>

              {role === 'admin' && (
                <Link
                  href="/admin/dashboard"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--color-sunset-400)',
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  <Shield size={14} /> Open Admin Operations Panel <ArrowUpRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          style={{
            borderTop: '1px solid rgba(232, 188, 185, 0.15)',
            paddingTop: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'rgba(232, 188, 185, 0.7)',
          }}
        >
          <div>
            © {new Date().getFullYear()} {BRAND_NAME} Atelier. All rights reserved. Prices in Indian Rupees (INR ₹).
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Complimentary Insured Courier</span>
            <span>Adyen Drop-In Payment Architecture</span>
            <span>AWS Cognito Authentication</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
