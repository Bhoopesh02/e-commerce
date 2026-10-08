'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BRAND_NAME } from '@/lib/constants';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register' | 'forgot-password' | 'reset-password';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const router = useRouter();
  const { loginAsCustomer } = useAuthStore();
  const { showToast } = useToastStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'reset-password'>(initialMode);
  const [email, setEmail] = useState('ayesha@example.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Ayesha Rahman');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

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
        background: 'radial-gradient(ellipse at 50% 15%, var(--bg-subtle) 0%, var(--bg-secondary) 50%, #F9E2E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '500px',
          width: '100%',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-diamond)',
            borderRadius: '24px',
            border: '1px solid rgba(202, 212, 214, 0.55)',
            padding: '44px 38px',
            boxShadow: '0 24px 60px -12px rgba(186, 75, 102, 0.14), 0 4px 16px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* Brand header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: 'var(--text-primary)',
                display: 'block',
              }}
            >
              {BRAND_NAME}
            </span>
          </div>

          <h1
            style={{
              fontSize: '1.6rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Account'}
            {mode === 'forgot-password' && 'Password Recovery'}
            {mode === 'reset-password' && 'Establish New Password'}
          </h1>

          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: '28px',
              lineHeight: 1.5,
            }}
          >
            {mode === 'login' && 'Access your private client profile, orders, and curated privileges.'}
            {mode === 'register' && 'Register your profile with our atelier for tailored services and early previews.'}
            {mode === 'forgot-password' && 'Enter your registered email to receive secure recovery instructions.'}
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
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--brand-primary)',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              style={{
                backgroundColor: 'var(--brand-primary)',
                borderColor: 'var(--brand-primary)',
                color: "var(--text-inverse)",
              }}
            >
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Create Account'}
              {mode === 'forgot-password' && 'Send Email Link'}
              {mode === 'reset-password' && 'Confirm New Password'}
            </Button>
          </form>

          {/* Mode Switcher */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? (
              <span>
                New to the atelier?{' '}
                <Link
                  href="/signup"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode('register');
                    window.history.pushState({}, '', '/signup');
                  }}
                  style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Sign Up
                </Link>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <Link
                  href="/signin"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode('login');
                    window.history.pushState({}, '', '/signin');
                  }}
                  style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Sign In
                </Link>
              </span>
            )}
          </div>





        </div>
      </div>
    </div>
  );
};
