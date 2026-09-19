'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BRAND_NAME } from '@/lib/constants';
import { ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'forgot-password' | 'reset-password';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const router = useRouter();
  const { loginAsCustomer, loginAsAdmin } = useAuthStore();
  const { showToast } = useToastStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>(initialMode);
  const [email, setEmail] = useState('ayesha@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Ayesha Rahman');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login' || mode === 'register') {
        loginAsCustomer();
        showToast(`Welcome to the ${BRAND_NAME} Atelier.`, 'success');
        router.push('/account');
      } else if (mode === 'forgot-password') {
        showToast('Password reset link has been dispatched to your email.', 'success');
        setMode('reset-password');
      } else {
        showToast('Password updated. Please log in with your new credentials.', 'success');
        setMode('login');
      }
    }, 450);
  };

  return (
    <div
      style={{
        paddingTop: '120px',
        paddingBottom: '96px',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '480px',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '40px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {BRAND_NAME}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AWS Cognito Authentication Gateway
            </span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '8px', textAlign: 'center' }}>
            {mode === 'login' && 'Client Sign In'}
            {mode === 'register' && 'Create Client Profile'}
            {mode === 'forgot-password' && 'Password Recovery'}
            {mode === 'reset-password' && 'Establish New Password'}
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '28px', lineHeight: 1.5 }}>
            {mode === 'login' && 'Access saved orders, delivery itineraries, and private privileges.'}
            {mode === 'register' && 'Register your address and email preferences with our Milan atelier.'}
            {mode === 'forgot-password' && 'Enter your registered email to receive authentication reset instructions.'}
            {mode === 'reset-password' && 'Enter your verification code sent via email.'}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {mode === 'register' && (
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon size={16} />}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />

            {(mode === 'login' || mode === 'register' || mode === 'reset-password') && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={16} />}
                required
              />
            )}

            {mode === 'login' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setMode('forgot-password')}
                  style={{ fontSize: '0.8rem', color: 'var(--color-sunset-600)', textDecoration: 'underline' }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Register Profile'}
              {mode === 'forgot-password' && 'Send Email Link'}
              {mode === 'reset-password' && 'Confirm New Password'}
            </Button>
          </form>

          {/* Mode Switcher */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                New to the atelier?{' '}
                <button
                  onClick={() => setMode('register')}
                  style={{ color: 'var(--color-sunset-700)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Create profile
                </button>
              </span>
            ) : (
              <button
                onClick={() => setMode('login')}
                style={{ color: 'var(--color-sunset-700)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Return to Sign In
              </button>
            )}
          </div>

          {/* Quick Demo Login Helpers */}
          <div
            style={{
              marginTop: '32px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'center' }}>
              Quick Demo Authorization
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loginAsCustomer();
                  showToast('Authorized as Customer (Ayesha Rahman).', 'success');
                  router.push('/account');
                }}
              >
                Customer Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loginAsAdmin();
                  showToast('Authorized as Operations Admin.', 'success');
                  router.push('/admin/dashboard');
                }}
              >
                Admin Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
