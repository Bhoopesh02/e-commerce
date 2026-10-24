'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BRAND_NAME } from '@/lib/constants';
import {
  Phone,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  AlertCircle,
} from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const router = useRouter();
  const { loginWithPhone } = useAuthStore();
  const { showToast } = useToastStore();

  const [mode, setMode] = useState<'login' | 'register'>(
    initialMode === 'register' ? 'register' : 'login'
  );
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');

  // Input fields
  const [username, setUsername] = useState('Ayesha Rahman');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Sync mode when initialMode prop changes
  useEffect(() => {
    setMode(initialMode === 'register' ? 'register' : 'login');
    setStep('credentials');
    setFormError(null);
    setOtp(['', '', '', '']);
  }, [initialMode]);

  // OTP Countdown Timer
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  // Focus first OTP input when transitioning to OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Switch between Login and Register
  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setStep('credentials');
    setFormError(null);
    setOtp(['', '', '', '']);
    window.history.pushState({}, '', newMode === 'register' ? '/signup' : '/signin');
  };

  // Step 1: Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Register mode requires username
    if (mode === 'register' && !username.trim()) {
      setFormError('Please enter your username / client name.');
      return;
    }

    // Clean and validate phone number
    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setTimer(30);
      setOtp(['', '', '', '']);
      showToast(`Verification code sent to +91 ${cleanPhone}. Demo code: 1234`, 'success');
    }, 450);
  };

  // Handle OTP digit entry
  const handleOtpChange = (index: number, val: string) => {
    setFormError(null);
    const cleanVal = val.replace(/[^0-9]/g, '');

    // Pasting multiple digits
    if (cleanVal.length > 1) {
      const digits = cleanVal.slice(0, 4).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 4) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 3);
      otpInputsRef.current[nextIdx]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance to next box if digit entered
    if (cleanVal && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (pastedData) {
      const digits = pastedData.split('');
      const newOtp = ['', '', '', ''];
      digits.forEach((d, i) => {
        if (i < 4) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 3);
      otpInputsRef.current[nextIdx]?.focus();
    }
  };

  const fillDemoOtp = () => {
    setOtp(['1', '2', '3', '4']);
    setFormError(null);
    showToast('Demo OTP 1234 entered.', 'info');
    otpInputsRef.current[3]?.focus();
  };

  const handleResendOtp = () => {
    setTimer(30);
    setOtp(['', '', '', '']);
    setFormError(null);
    showToast(`Fresh OTP dispatched to +91 ${phone}. Demo code: 1234`, 'info');
    otpInputsRef.current[0]?.focus();
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');

    if (enteredOtp.length < 4) {
      setFormError('Please enter the complete 4-digit verification code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = `+91 ${phone.trim()}`;
      const clientName = mode === 'register' ? username.trim() : undefined;

      loginWithPhone(cleanPhone, clientName);

      if (mode === 'register') {
        showToast(`Welcome to the ${BRAND_NAME} Atelier, ${username}!`, 'success');
      } else {
        showToast(`Welcome back to the ${BRAND_NAME} Atelier.`, 'success');
      }

      router.push('/account');
    }, 450);
  };

  return (
    <div
      style={{
        paddingTop: 'calc(var(--header-total-height, 113px) + 24px)',
        paddingBottom: '96px',
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 15%, var(--bg-subtle) 0%, var(--bg-secondary) 50%, var(--color-golden-50) 100%)',
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
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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

          {/* Heading */}
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
            {step === 'otp'
              ? 'Verify Security Code'
              : mode === 'login'
              ? 'Sign In with Mobile'
              : 'Create Atelier Account'}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              textAlign: 'center',
              marginBottom: '26px',
              lineHeight: 1.5,
            }}
          >
            {step === 'otp' ? (
              <span>
                Enter the 4-digit code sent via SMS to{' '}
                <strong style={{ color: 'var(--text-primary)' }}>+91 {phone}</strong>
              </span>
            ) : mode === 'login' ? (
              'Enter your registered mobile number to receive a secure one-time passcode.'
            ) : (
              'Register your profile with your username and mobile number for private previews and bespoke services.'
            )}
          </p>

          {/* Error Banner */}
          {formError && (
            <div
              style={{
                backgroundColor: 'rgba(176, 0, 32, 0.08)',
                border: '1px solid rgba(176, 0, 32, 0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-error)',
                fontSize: '0.84rem',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          {step === 'credentials' ? (
            /* Step 1: Credentials Form */
            <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Username ONLY on register */}
              {mode === 'register' && (
                <Input
                  label="Username / Client Name"
                  placeholder="e.g. Ayesha Rahman"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setFormError(null);
                  }}
                  leftIcon={<UserIcon size={16} />}
                  required
                />
              )}

              {/* Mobile Number on both Login and Register */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                <label
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Mobile Number
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      minHeight: 44,
                      userSelect: 'none',
                    }}
                  >
                    +91
                  </div>
                  <div style={{ flex: 1 }}>
                    <Input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/[^0-9]/g, ''));
                        setFormError(null);
                      }}
                      leftIcon={<Phone size={16} />}
                      maxLength={10}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                style={{
                  backgroundColor: 'var(--brand-primary)',
                  borderColor: 'var(--brand-primary)',
                  color: 'var(--text-inverse)',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Get OTP</span>
                <ArrowRight size={16} />
              </Button>
            </form>
          ) : (
            /* Step 2: OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Phone target recap with Edit link */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={16} style={{ color: 'var(--brand-primary)' }} />
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>+91 {phone}</strong>
                    {mode === 'register' && username && (
                      <span style={{ color: 'var(--text-muted)' }}> ({username})</span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--brand-primary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Edit
                </button>
              </div>

              {/* 4-digit OTP Inputs */}
              <div>
                <label
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px',
                  }}
                >
                  Enter 4-Digit Code
                </label>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                  onPaste={handlePaste}
                >
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      style={{
                        width: '58px',
                        height: '62px',
                        fontSize: '1.6rem',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 600,
                        textAlign: 'center',
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-surface)',
                        border: digit
                          ? '2px solid var(--brand-primary)'
                          : '1px solid var(--border-color)',
                        borderRadius: '12px',
                        outline: 'none',
                        boxShadow: digit ? '0 0 0 3px rgba(186, 75, 102, 0.12)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick Fill Demo Code Helper */}
              <button
                type="button"
                onClick={fillDemoOtp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  margin: '0 auto',
                  padding: '6px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--brand-primary)',
                  backgroundColor: 'rgba(186, 75, 102, 0.08)',
                  border: '1px dashed rgba(186, 75, 102, 0.4)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                }}
              >
                <Sparkles size={13} />
                <span>Quick Fill Demo Code (1234)</span>
              </button>

              {/* Countdown and Resend */}
              <div style={{ textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {timer > 0 ? (
                  <span>
                    Resend code in <strong style={{ color: 'var(--text-primary)' }}>{timer}s</strong>
                  </span>
                ) : (
                  <span>
                    Didn&apos;t receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      style={{
                        color: 'var(--brand-primary)',
                        fontWeight: 600,
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Resend OTP
                    </button>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  style={{
                    backgroundColor: 'var(--brand-primary)',
                    borderColor: 'var(--brand-primary)',
                    color: 'var(--text-inverse)',
                  }}
                >
                  {mode === 'register' ? 'Verify & Create Account' : 'Verify & Sign In'}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: 'var(--text-muted)',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Change mobile number</span>
                </button>
              </div>
            </form>
          )}

          {/* Mode Switcher Footer */}
          {step === 'credentials' && (
            <div
              style={{
                marginTop: '26px',
                textAlign: 'center',
                fontSize: '0.86rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '20px',
              }}
            >
              {mode === 'login' ? (
                <span>
                  New to the atelier?{' '}
                  <Link
                    href="/signup"
                    onClick={(e) => {
                      e.preventDefault();
                      switchMode('register');
                    }}
                    style={{
                      color: 'var(--brand-primary)',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
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
                      switchMode('login');
                    }}
                    style={{
                      color: 'var(--brand-primary)',
                      fontWeight: 600,
                      textDecoration: 'underline',
                    }}
                  >
                    Sign In
                  </Link>
                </span>
              )}
            </div>
          )}

          {/* Security Assurance */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              marginTop: '22px',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--brand-primary)' }} />
            <span>Encrypted White-Glove Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
