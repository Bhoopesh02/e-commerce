'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { loginUser, registerUser } from '@/lib/mockApi';
import {
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export interface CheckoutAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutAuthModal: React.FC<CheckoutAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { setUser, loginAsCustomer } = useAuthStore();
  const { showToast } = useToastStore();

  const [tab, setTab] = useState<'signin' | 'register'>('signin');

  // Sign In fields
  const [signInEmail, setSignInEmail] = useState('');

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!signInEmail.trim()) {
      setError('Please enter your account email.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginUser(signInEmail.trim());
      setUser(user);
      showToast(`Welcome back, ${user.name || 'Client'}.`, 'success');
      handleClose();
      onSuccess();
    } catch {
      setError('Unable to verify credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      loginAsCustomer();
      const user = await loginUser('ayesha@example.com');
      setUser(user);
      showToast('Signed in as Ayesha Rahman (Atelier Member).', 'success');
      handleClose();
      onSuccess();
    } catch {
      setError('Demo authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    if (!regName.trim()) {
      setError('Please enter your full client name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await registerUser(regName.trim(), regEmail.trim());
      setUser(newUser);
      showToast(`Client profile registered for ${newUser.name}.`, 'success');
      handleClose();
      onSuccess();
    } catch {
      setError('Unable to create client account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="480px" ariaLabel="Sign in or register to checkout">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', marginBottom: '8px' }}>
            <Badge variant="gold" size="sm">Client Authentication</Badge>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontFamily: 'var(--font-display)', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
            Sign In to Checkout
          </h2>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
            To safeguard your commission, ensure white-glove courier custody, and issue tax dossiers, checkout is reserved for registered patrons.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: 'var(--bg-muted, rgba(0, 0, 0, 0.04))',
            borderRadius: 'var(--radius-sm)',
            padding: '4px',
            border: '1px solid var(--border-color)',
            gap: '4px',
          }}
          role="tablist"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'signin'}
            onClick={() => {
              setTab('signin');
              setError(null);
            }}
            style={{
              padding: '0 14px',
              minHeight: 44,
              height: 44,
              boxSizing: 'border-box',
              fontSize: '0.88rem',
              fontWeight: tab === 'signin' ? 600 : 500,
              borderRadius: 'var(--radius-xs, 4px)',
              border: 'none',
              backgroundColor: tab === 'signin' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'signin' ? 'var(--brand-primary)' : 'var(--text-muted)',
              boxShadow: tab === 'signin' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'register'}
            onClick={() => {
              setTab('register');
              setError(null);
            }}
            style={{
              padding: '0 14px',
              minHeight: 44,
              height: 44,
              boxSizing: 'border-box',
              fontSize: '0.88rem',
              fontWeight: tab === 'register' ? 600 : 500,
              borderRadius: 'var(--radius-xs, 4px)',
              border: 'none',
              backgroundColor: tab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'register' ? 'var(--brand-primary)' : 'var(--text-muted)',
              boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
            }}
          >
            <UserPlus size={15} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-xs, 4px)',
              color: 'var(--color-error)',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Sign In Form */}
        {tab === 'signin' && (
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Account Email"
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              placeholder="e.g. ayesha@example.com"
              leftIcon={<Mail size={16} />}
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disableSheen
                style={{ width: '100%' }}
              >
                Sign In & Proceed to Checkout
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoSignIn}
                disabled={isLoading}
                disableSheen
                style={{ width: '100%' }}
              >
                One-Click Demo Sign-In (Ayesha Rahman)
              </Button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                New to Aurelia?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError(null);
                  }}
                  style={{
                    color: 'var(--brand-primary)',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Create an account →
                </button>
              </span>
            </div>
          </form>
        )}

        {/* Register Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Client Full Name"
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Ayesha Rahman"
              leftIcon={<UserIcon size={16} />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="client@example.com"
              leftIcon={<Mail size={16} />}
              required
            />

            <div style={{ marginTop: '6px' }}>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disableSheen
                style={{ width: '100%' }}
              >
                Create Account & Proceed to Checkout
              </Button>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Already an atelier client?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setTab('signin');
                    setError(null);
                  }}
                  style={{
                    color: 'var(--brand-primary)',
                    background: 'none',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Sign in here →
                </button>
              </span>
            </div>
          </form>
        )}

        {/* Trust footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '12px',
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--brand-primary)' }} />
          <span>Encrypted atelier authentication · Private client records</span>
        </div>
      </div>
    </Modal>
  );
};
