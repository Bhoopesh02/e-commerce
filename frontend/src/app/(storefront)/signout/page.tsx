'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { BRAND_NAME } from '@/lib/constants';
import { CheckCircle2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function SignOutPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const [hasLoggedOut, setHasLoggedOut] = useState(false);

  useEffect(() => {
    // Perform clean client-side logout upon arriving at the signout page
    if (user) {
      logout();
      showToast('You have safely signed out.', 'info');
    }
    setHasLoggedOut(true);
  }, [user, logout, showToast]);

  return (
    <div
      style={{
        paddingTop: '120px',
        paddingBottom: '96px',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 20%, var(--bg-subtle) 0%, var(--bg-secondary) 50%, var(--bg-muted) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-primary)',
            borderRadius: '24px',
            border: '1px solid var(--border-color)',
            padding: '48px 40px',
            boxShadow: '0 24px 60px -12px rgba(186, 75, 102, 0.14), 0 4px 16px rgba(0, 0, 0, 0.03)',
            textAlign: 'center',
          }}
        >
          {/* Circular Rose Emblem */}
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 24px auto',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-primary)',
            }}
          >
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>

          {/* Brand Tag */}
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            {BRAND_NAME}
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              display: 'block',
              marginBottom: '24px',
            }}
          >
            Private Client Portal
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '14px',
              lineHeight: 1.3,
            }}
          >
            You Have Been Signed Out
          </h1>

          <p
            style={{
              fontSize: '0.92rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '36px',
            }}
          >
            Your session has ended securely. Your shopping bag and saved preferences will remain preserved for your next visit.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link href="/signin" style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                rightIcon={<ArrowRight size={16} />}
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)',
                  color: "var(--text-inverse)",
                }}
              >
                Sign Back In
              </Button>
            </Link>

            <Link href="/shop" style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                leftIcon={<ShoppingBag size={16} />}
                style={{
                  borderColor: 'var(--border-color)',
                  color: '#4A3338',
                  backgroundColor: '#FFF8FA',
                }}
              >
                Return to Boutique
              </Button>
            </Link>
          </div>

          {/* Assistance Footer */}
          <div
            style={{
              marginTop: '36px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(240, 210, 218, 0.6)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}
          >
            Need assistance? Reach our concierge at{' '}
            <Link
              href="/account/support"
              style={{
                color: 'var(--brand-primary)',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Client Concierge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
