'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAsAdmin } = useAuthStore();
  const { showToast } = useToastStore();
  const [email, setEmail] = useState('marcus@aurelia.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginAsAdmin();
      showToast('Admin access granted. Welcome back.', 'success');
      router.push('/admin/dashboard');
    }, 500);
  };

  return (
    <div
      data-admin="true"
      className="admin-layout admin-panel"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-black-tie)',
        background: 'radial-gradient(ellipse at 50% 20%, var(--color-sapphire-900) 0%, var(--color-black-tie) 70%)',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--surface-brand-dark)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '44px 36px',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                backgroundColor: 'var(--brand-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-diamond)',
                marginBottom: '16px',
              }}
            >
              <Shield size={24} />
            </div>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--color-diamond)',
                marginBottom: '8px',
              }}
            >
              Admin Console
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-icy-lake-300)', lineHeight: 1.5 }}>
              Sign in to the operations portal. This area is restricted to authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label
                htmlFor="admin-email"
                style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-neutral-300)', display: 'block', marginBottom: '6px' }}
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-black-tie)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--color-diamond)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-neutral-300)', display: 'block', marginBottom: '6px' }}
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: 'var(--color-black-tie)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'var(--color-diamond)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '8px',
                width: '100%',
                padding: '14px',
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--color-diamond)',
                border: 'none',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: isLoading ? 'wait' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {isLoading ? 'Authenticating…' : 'Sign In to Admin'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-neutral-400)' }}>
            This portal is for authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
