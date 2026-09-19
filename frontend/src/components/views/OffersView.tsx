'use client';

import React, { useEffect, useState } from 'react';
import { getCoupons } from '@/lib/mockApi';
import { Coupon } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Sparkles, Copy, Check, Tag } from 'lucide-react';

export const OffersView: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { applyCouponCode, openDrawer } = useCartStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    async function loadOffers() {
      setLoading(true);
      try {
        const data = await getCoupons();
        setCoupons(data);
      } finally {
        setLoading(false);
      }
    }
    loadOffers();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Privilege code "${code}" copied to clipboard.`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleApplyDirect = async (code: string) => {
    const success = await applyCouponCode(code);
    if (success) {
      showToast(`Privilege code "${code}" applied to bag.`, 'success');
      openDrawer();
    } else {
      openDrawer();
    }
  };

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--color-sunset-600)',
              marginBottom: '10px',
            }}
          >
            <Sparkles size={14} />
            <span>Private Client Privileges</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '14px' }}>
            Exclusive Atelier Privileges
          </h1>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
            Special courtesy codes and seasonal allowances for our private clientele. Apply directly to your bag at checkout.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {coupons.map((c) => (
            <div
              key={c.code}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    backgroundColor: 'rgba(243, 159, 90, 0.15)',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(243, 159, 90, 0.3)',
                    color: 'var(--color-sunset-700)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    fontSize: '0.85rem',
                  }}
                >
                  <Tag size={13} />
                  <span>{c.code}</span>
                </div>

                <button
                  onClick={() => handleCopy(c.code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: copiedCode === c.code ? 'var(--color-success)' : 'var(--text-muted)',
                    cursor: 'pointer',
                  }}
                >
                  {copiedCode === c.code ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy
                    </>
                  )}
                </button>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
                  {c.type === 'percentage' ? `${c.value}% Courtesy Reduction` : `Flat ${formatPrice(c.value)} Reduction`}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {c.description}
                </p>
              </div>

              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                  marginTop: 'auto',
                }}
              >
                <div>Minimum Spend: <strong>{formatPrice(c.minOrderValue)}</strong></div>
                {c.maxDiscount && <div>Maximum Privilege: <strong>{formatPrice(c.maxDiscount)}</strong></div>}
                <div>Valid through: <strong>{new Date(c.expiryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></div>
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => handleApplyDirect(c.code)}
              >
                Apply to Bag
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
