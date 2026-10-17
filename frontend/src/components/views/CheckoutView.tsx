'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import dynamic from 'next/dynamic';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { formatPrice } from '@/lib/formatPrice';
import { validateStock, placeOrder, loginUser, registerUser } from '@/lib/mockApi';
import { Order, Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import type { PaymentMethodType, PaymentDetails } from '@/components/checkout/PaymentAdyenDropIn';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  Lock,
  Sparkles,
  Tag,
  RefreshCw,
  AlertCircle,
  Receipt,
  Copy,
  Check,
} from 'lucide-react';

// Lazy-load the payment component — only needed at checkout step 4
const PaymentAdyenDropIn = dynamic(
  () =>
    import('@/components/checkout/PaymentAdyenDropIn').then(
      (mod) => mod.PaymentAdyenDropIn,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Loading secure payment options…
        </span>
      </div>
    ),
  },
);

export const CheckoutView: React.FC = () => {
  const {
    getActiveItems,
    clearCart,
    clearBuyNowItem,
    checkoutMode,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
    appliedCoupon,
    discountAmount,
    cartValidation,
    validateCart,
    syncPrices,
    fixStockIssues,
  } = useCartStore();
  const items = getActiveItems();
  const { user, isAuthenticated, setUser, logout, loginAsCustomer } = useAuthStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  useEffect(() => {
    validateCart();
  }, [validateCart]);

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [mounted, setMounted] = useState(false);

  const goToStep = (newStep: 1 | 2 | 3 | 4 | 5, pushHistory = true) => {
    setStep(newStep);
    if (typeof window !== 'undefined' && pushHistory) {
      if (newStep >= 1 && newStep <= 4) {
        const url = new URL(window.location.href);
        url.searchParams.set('step', newStep.toString());
        window.history.pushState({ step: newStep }, '', url.toString());
      } else if (newStep === 5) {
        const url = new URL(window.location.href);
        url.searchParams.delete('step');
        window.history.replaceState({ step: 5 }, '', url.toString());
      }
    }
  };

  useEffect(() => {
    setMounted(true);
    // Sync initial step from URL query params
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const s = parseInt(params.get('step') || '1', 10);
      if (s >= 1 && s <= 4) {
        setStep(s as 1 | 2 | 3 | 4);
        window.history.replaceState({ step: s }, '', window.location.href);
      }
    }

    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.step === 'number') {
        const s = e.state.step;
        if (s >= 1 && s <= 4) {
          setStep(s as 1 | 2 | 3 | 4);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const s = parseInt(params.get('step') || '1', 10);
        if (s >= 1 && s <= 4) {
          setStep(s as 1 | 2 | 3 | 4);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copiedField, setCopiedField] = useState<'order' | 'tracking' | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  const handleCopy = (text: string, field: 'order' | 'tracking') => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`${field === 'order' ? 'Order ID' : 'Tracking ID'} copied to clipboard`, 'success');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Auth State
  const isUserAuthenticated = !!(isAuthenticated && user);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');

  // Form states
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [name, setName] = useState(user?.name || '');
  const [contactError, setContactError] = useState<string | null>(null);

  // Inline Sign-in state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Inline Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Address state
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.line1 || '');
  const [city, setCity] = useState(defaultAddr?.city || '');
  const [state, setState] = useState(defaultAddr?.state || '');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Billing Address state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingName, setBillingName] = useState(user?.name || '');
  const [billingPhone, setBillingPhone] = useState(user?.phone || '');
  const [billingAddressLine1, setBillingAddressLine1] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPincode, setBillingPincode] = useState('');
  const [billingError, setBillingError] = useState<string | null>(null);

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'UPI', upiVpa: 'ayesha@oksbi' });

  // Sync state if user changes or authenticates
  useEffect(() => {
    if (user && isAuthenticated) {
      if (!name) setName(user.name);
      if (!email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
      if (!billingName) setBillingName(user.name);
      if (!billingPhone && user.phone) setBillingPhone(user.phone);
      const def = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (def) {
        if (!addressLine1) setAddressLine1(def.line1);
        if (!city) setCity(def.city);
        if (!state) setState(def.state);
        if (!pincode) setPincode(def.pincode);
      }
    }
  }, [user, isAuthenticated]);

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSignInError(null);
    if (!signInEmail.trim()) {
      setSignInError('Please enter your account email.');
      return;
    }
    setIsSigningIn(true);
    try {
      const loggedUser = await loginUser(signInEmail.trim());
      setUser(loggedUser);
      setName(loggedUser.name || '');
      setEmail(loggedUser.email || signInEmail.trim());
      if (loggedUser.phone) setPhone(loggedUser.phone);
      const def = loggedUser.addresses?.find((a) => a.isDefault) || loggedUser.addresses?.[0];
      if (def) {
        setAddressLine1(def.line1);
        setCity(def.city);
        setState(def.state);
        setPincode(def.pincode);
      }
      showToast(`Welcome back, ${loggedUser.name || 'Client'}.`, 'success');
    } catch {
      setSignInError('Unable to sign in. Please check your credentials.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setRegisterError(null);
    if (!regName.trim()) {
      setRegisterError('Please enter your full client name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regEmail.trim() || !emailRegex.test(regEmail.trim())) {
      setRegisterError('Please enter a valid email address.');
      return;
    }
    setIsRegistering(true);
    try {
      const newUser = await registerUser(regName.trim(), regEmail.trim());
      setUser(newUser);
      setName(newUser.name);
      setEmail(newUser.email);
      showToast(`Client account established for ${newUser.name}. Welcome to Aurelia.`, 'success');
    } catch {
      setRegisterError('Unable to create client account. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleDemoSignIn = async () => {
    setIsSigningIn(true);
    setSignInError(null);
    try {
      loginAsCustomer();
      const loggedUser = await loginUser('ayesha@example.com');
      setUser(loggedUser);
      setName(loggedUser.name || 'Ayesha Rahman');
      setEmail(loggedUser.email || 'ayesha@example.com');
      if (loggedUser.phone) setPhone(loggedUser.phone);
      const def = loggedUser.addresses?.find((a) => a.isDefault) || loggedUser.addresses?.[0];
      if (def) {
        setAddressLine1(def.line1);
        setCity(def.city);
        setState(def.state);
        setPincode(def.pincode);
      }
      showToast('Signed in as Ayesha Rahman (Atelier Member).', 'success');
    } catch {
      setSignInError('Demo sign in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = () => {
    logout();
    setName('');
    setEmail('');
    setPhone('');
    setAddressLine1('');
    setCity('');
    setState('');
    setPincode('');
    setSameAsShipping(true);
    setBillingName('');
    setBillingPhone('');
    setBillingAddressLine1('');
    setBillingCity('');
    setBillingState('');
    setBillingPincode('');
    setShippingError(null);
    setBillingError(null);
    goToStep(1, false);
    showToast('Signed out of atelier account.', 'info');
  };

  const handleContinueToShipping = () => {
    setContactError(null);
    if (!name.trim()) {
      setContactError('Please enter your full client name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setContactError('Please provide a valid email address for order confirmation & tracking.');
      return;
    }
    if (!phone.trim()) {
      setContactError('Please provide a telephone number for white-glove courier delivery.');
      return;
    }
    if (cartValidation?.hasStockIssues) {
      setStockError('Some items in your bag are no longer available. Please resolve them before proceeding.');
      return;
    }
    goToStep(2);
  };

  const handleContinueToDelivery = () => {
    setShippingError(null);
    setBillingError(null);

    if (!addressLine1.trim()) {
      setShippingError('Please enter your shipping street address or residence.');
      return;
    }
    if (!city.trim()) {
      setShippingError('Please enter your shipping city.');
      return;
    }
    if (!state.trim()) {
      setShippingError('Please enter your shipping state or province.');
      return;
    }
    if (!pincode.trim()) {
      setShippingError('Please enter a valid postal / PIN code.');
      return;
    }

    if (!sameAsShipping) {
      if (!billingName.trim()) {
        setBillingError('Please enter the client or company name for the billing dossier.');
        return;
      }
      if (!billingAddressLine1.trim()) {
        setBillingError('Please enter the billing street address.');
        return;
      }
      if (!billingCity.trim()) {
        setBillingError('Please enter the billing city.');
        return;
      }
      if (!billingState.trim()) {
        setBillingError('Please enter the billing state or province.');
        return;
      }
      if (!billingPincode.trim()) {
        setBillingError('Please enter the billing postal / PIN code.');
        return;
      }
    }

    goToStep(3);
  };

  const subtotal = getSubtotal();
  const tax = getTax();
  const delivery = getDeliveryFee();
  const total = getTotal();

  const handlePlaceOrder = async () => {
    setStockError(null);
    setIsSubmitting(true);

    try {
      // 1. Revalidate Stock against products.json before allowing order placement
      const stockCheck = await validateStock(items.map((i) => ({ sku: i.sku, quantity: i.quantity })));
      if (!stockCheck.valid) {
        setStockError(stockCheck.message || 'Variant out of stock.');
        showToast(stockCheck.message || 'Variant out of stock.', 'error');
        setIsSubmitting(false);
        return;
      }

      // 2. Place Order via Mock API
      const deliveryAddress: Address = {
        name,
        phone,
        line1: addressLine1,
        city,
        state,
        pincode,
        isDefault: true,
      };

      const finalBillingAddress: Address = sameAsShipping
        ? {
            name,
            phone,
            line1: addressLine1,
            city,
            state,
            pincode,
          }
        : {
            name: billingName.trim() || name,
            phone: billingPhone.trim() || phone,
            line1: billingAddressLine1.trim(),
            city: billingCity.trim(),
            state: billingState.trim(),
            pincode: billingPincode.trim(),
          };

      if (!user) {
        showToast('Please sign in or create an account to authorize payment.', 'error');
        goToStep(1, false);
        return;
      }

      const res = await placeOrder({
        userId: user.id,
        customerName: name,
        customerEmail: email,
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: i.product.images[0],
          sku: i.sku,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
          price: i.price,
        })),
        status: 'Placed',
        address: deliveryAddress,
        billingAddress: finalBillingAddress,
        sameAsShipping,
        payment: {
          method: paymentDetails.method,
          status: 'successful',
          transactionId: `TXN_${paymentDetails.method.toUpperCase()}_${Date.now().toString().slice(-8)}`,
          cardLast4: paymentDetails.cardLast4,
          upiVpa: paymentDetails.upiVpa,
        },
        totals: {
          subtotal,
          discount: discountAmount,
          tax,
          delivery,
          total,
        },
        trackingInfo: {
          carrier: 'BlueDart Express Luxury',
          trackingId: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
          estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
      });

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        goToStep(5, false);
        if (checkoutMode === 'buy_now') {
          clearBuyNowItem();
        } else {
          clearCart();
        }
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['var(--brand-accent)', 'var(--brand-accent)', 'var(--brand-primary)', 'var(--border-color)'],
        });
        showToast('Order registered at Aurelia Central Atelier.', 'success');
      } else {
        showToast(res.error || 'Failed to place order.', 'error');
      }
    } catch {
      showToast('A network anomaly occurred. Please re-attempt.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation View
  if (step === 5 && confirmedOrder) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '96px', minHeight: '85vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
            Atelier Order Confirmed
          </span>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginTop: '8px', marginBottom: '16px' }}>
            Thank You, {confirmedOrder.customerName}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Your commission has been registered successfully.
            Our master tailors are preparing your pieces for white-glove dispatch.
          </p>

          {/* Prominent Order Credentials Badge showing Order ID & Tracking ID */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px 28px',
              padding: '14px 28px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-color)',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Order ID:
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                {confirmedOrder.id}
              </span>
              <button
                type="button"
                onClick={() => handleCopy(confirmedOrder.id, 'order')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: copiedField === 'order' ? 'var(--color-success)' : 'var(--text-muted)',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'color 0.2s',
                }}
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copiedField === 'order' ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-color)' }} />

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                Tracking ID:
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {confirmedOrder.trackingInfo?.trackingId || 'Pending'}
              </span>
              {confirmedOrder.trackingInfo?.trackingId && (
                <button
                  type="button"
                  onClick={() => handleCopy(confirmedOrder.trackingInfo!.trackingId, 'tracking')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    color: copiedField === 'tracking' ? 'var(--color-success)' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-xs)',
                    transition: 'color 0.2s',
                  }}
                  title="Copy Tracking ID"
                  aria-label="Copy Tracking ID"
                >
                  {copiedField === 'tracking' ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>

          {/* Email dispatch notice per rule */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
              textAlign: 'left',
            }}
          >
            <Mail size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              A full physical atelier dossier and tax invoice has been dispatched to{' '}
              <strong>{confirmedOrder.customerEmail}</strong>. (Notifications are strictly email-only).
            </span>
          </div>

          {/* Order Details Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '32px',
              textAlign: 'left',
              marginBottom: '40px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                borderBottom: '1px solid var(--border-light)',
                paddingBottom: '20px',
                marginBottom: '20px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Order ID
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    {confirmedOrder.id}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(confirmedOrder.id, 'order')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      color: copiedField === 'order' ? 'var(--color-success)' : 'var(--text-muted)',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                    title="Copy Order ID"
                    aria-label="Copy Order ID"
                  >
                    {copiedField === 'order' ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Tracking ID
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                    {confirmedOrder.trackingInfo?.trackingId || 'Pending'}
                  </p>
                  {confirmedOrder.trackingInfo?.trackingId && (
                    <button
                      type="button"
                      onClick={() => handleCopy(confirmedOrder.trackingInfo!.trackingId, 'tracking')}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px',
                        color: copiedField === 'tracking' ? 'var(--color-success)' : 'var(--text-muted)',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                      title="Copy Tracking ID"
                      aria-label="Copy Tracking ID"
                    >
                      {copiedField === 'tracking' ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
                {confirmedOrder.trackingInfo?.carrier && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    via {confirmedOrder.trackingInfo.carrier}
                  </span>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Estimated Delivery
                </span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', margin: 0 }}>
                  {confirmedOrder.trackingInfo?.estimatedDelivery || 'Calculated at dispatch'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {confirmedOrder.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.92rem' }}>
                    {item.quantity}x {item.productName} ({item.size})
                  </span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                borderTop: '1px solid var(--border-light)',
                paddingTop: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Delivery Residence
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5, margin: 0 }}>
                  <strong>{confirmedOrder.address.name}</strong>
                  <br />
                  {confirmedOrder.address.line1}
                  <br />
                  {confirmedOrder.address.city}, {confirmedOrder.address.state} — {confirmedOrder.address.pincode}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Billing Address
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5, margin: 0 }}>
                  {confirmedOrder.sameAsShipping || !confirmedOrder.billingAddress ? (
                    <span style={{ color: 'var(--text-secondary)' }}>Same as delivery residence</span>
                  ) : (
                    <>
                      <strong>{confirmedOrder.billingAddress.name}</strong>
                      <br />
                      {confirmedOrder.billingAddress.line1}
                      <br />
                      {confirmedOrder.billingAddress.city}, {confirmedOrder.billingAddress.state} — {confirmedOrder.billingAddress.pincode}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 600 }}>
              <span>Total Paid ({confirmedOrder.payment.method})</span>
              <span style={{ color: 'var(--brand-primary)' }}>{formatPrice(confirmedOrder.totals.total)}</span>
            </div>
          </div>

          <div className="order-success-actions">
            <Button
              variant="primary"
              href={`/account/orders/${confirmedOrder.id}`}
              onClick={() => router.push(`/account/orders/${confirmedOrder.id}`)}
            >
              Track Order Progress
            </Button>
            <Button
              variant="outline"
              disableSheen
              href="/shop"
              onClick={() => router.push('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ minHeight: '300px' }} />
        </div>
      </div>
    );
  }

  // If cart is empty, show empty bag state
  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', textAlign: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '540px' }}>
          <ShoppingBag size={48} style={{ color: 'var(--border-color)', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Your Bag is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Add garments to your bag before initiating checkout.
          </p>
          <Button variant="primary" href="/shop" onClick={() => router.push('/shop')}>
            Browse Collections
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Step Progression Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto 48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px' }}>
            Atelier Checkout
          </h1>
          <div className="checkout-step-container" style={{ display: 'flex', justifyContent: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: step >= 1 ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: step === 1 ? 700 : 500, textAlign: 'center' }}>
              <span className="step-num">1. </span><span className="step-text">Contact</span>
            </span>
            <span className="step-arrow">→</span>
            <span style={{ color: step >= 2 ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: step === 2 ? 700 : 500, textAlign: 'center' }}>
              <span className="step-num">2. </span><span className="step-text">Shipping</span>
            </span>
            <span className="step-arrow">→</span>
            <span style={{ color: step >= 3 ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: step === 3 ? 700 : 500, textAlign: 'center' }}>
              <span className="step-num">3. </span><span className="step-text">Delivery</span>
            </span>
            <span className="step-arrow">→</span>
            <span style={{ color: step >= 4 ? 'var(--brand-primary)' : 'var(--text-muted)', fontWeight: step === 4 ? 700 : 500, textAlign: 'center' }}>
              <span className="step-num">4. </span><span className="step-text">Payment</span>
            </span>
          </div>
        </div>

        {/* Real-time Cart Stock & Price Alerts Prior to Checkout Submission */}
        {cartValidation?.hasStockIssues && (
          <div
            style={{
              maxWidth: '1040px',
              margin: '0 auto 28px',
              padding: '16px 20px',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={22} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Real-Time Inventory Alert
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  {cartValidation.summaryMessage || 'Some items in your bag are out of stock or exceed available quantities.'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button variant="outline" size="sm" onClick={fixStockIssues}>
                Auto-Adjust Bag
              </Button>
              <Link href="/cart">
                <Button variant="secondary" size="sm">
                  Return to Bag
                </Button>
              </Link>
            </div>
          </div>
        )}

        {cartValidation?.hasPriceChanges && (
          <div
            style={{
              maxWidth: '1040px',
              margin: '0 auto 28px',
              padding: '16px 20px',
              backgroundColor: 'var(--color-warning-bg)',
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Tag size={20} style={{ flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Catalog Price Notice
                </span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Atelier catalog rates have updated for silhouettes in your bag.
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={syncPrices} leftIcon={<RefreshCw size={13} />}>
              Update Prices & Totals
            </Button>
          </div>
        )}

        {/* Stock Error Alert */}
        {stockError && (
          <div
            style={{
              maxWidth: '1040px',
              margin: '0 auto 28px',
              padding: '16px 20px',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-error)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{stockError}</span>
          </div>
        )}

        <div
          className="checkout-main-grid"
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
            minWidth: 0,
          }}
        >
          {/* Left: Step Content */}
          <div
            className="checkout-step-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
              minWidth: 0,
              overflow: 'visible',
            }}
          >
            {/* Step 1: Contact */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                      Client & Contact
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                      Provide contact details for white-glove dispatch and physical dossier delivery.
                    </p>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', fontWeight: 600 }}>
                    Step 1 of 4
                  </span>
                </div>

                {/* If NOT authenticated, show mandatory Sign In or Create Account Gate */}
                {!isUserAuthenticated && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'center', padding: '10px 0 4px' }}>
                      <div style={{ display: 'inline-flex', marginBottom: '8px' }}>
                        <Badge variant="gold" size="sm">Client Account Required</Badge>
                      </div>
                      <h4 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
                        Sign In or Create Account to Checkout
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '0 auto', maxWidth: '440px', lineHeight: 1.5 }}>
                        To safeguard your commission, ensure white-glove courier custody, and issue certified tax dossiers, checkout is strictly reserved for registered patrons.
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
                        id="checkout-signin-tab"
                        aria-selected={authMode === 'signin'}
                        onClick={() => {
                          setAuthMode('signin');
                          setSignInError(null);
                        }}
                        style={{
                          padding: '11px 16px',
                          fontSize: '0.88rem',
                          fontWeight: authMode === 'signin' ? 600 : 500,
                          borderRadius: 'var(--radius-xs, 4px)',
                          border: 'none',
                          backgroundColor: authMode === 'signin' ? 'var(--bg-surface)' : 'transparent',
                          color: authMode === 'signin' ? 'var(--brand-primary)' : 'var(--text-muted)',
                          boxShadow: authMode === 'signin' ? 'var(--shadow-sm)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <LogIn size={16} />
                        <span>Sign In</span>
                      </button>

                      <button
                        type="button"
                        role="tab"
                        id="checkout-register-tab"
                        aria-selected={authMode === 'register'}
                        onClick={() => {
                          setAuthMode('register');
                          setRegisterError(null);
                        }}
                        style={{
                          padding: '11px 16px',
                          fontSize: '0.88rem',
                          fontWeight: authMode === 'register' ? 600 : 500,
                          borderRadius: 'var(--radius-xs, 4px)',
                          border: 'none',
                          backgroundColor: authMode === 'register' ? 'var(--bg-surface)' : 'transparent',
                          color: authMode === 'register' ? 'var(--brand-primary)' : 'var(--text-muted)',
                          boxShadow: authMode === 'register' ? 'var(--shadow-sm)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <UserPlus size={16} />
                        <span>Create Account</span>
                      </button>
                    </div>

                    {/* Sign In Tab Form */}
                    {authMode === 'signin' && (
                      <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {signInError && (
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
                            <AlertTriangle size={15} />
                            <span>{signInError}</span>
                          </div>
                        )}

                        <Input
                          label="Account Email"
                          type="email"
                          value={signInEmail}
                          onChange={(e) => setSignInEmail(e.target.value)}
                          placeholder="e.g. ayesha@example.com"
                          leftIcon={<Mail size={16} />}
                          required
                        />

                        <Input
                          label="Password"
                          type="password"
                          value={signInPassword}
                          onChange={(e) => setSignInPassword(e.target.value)}
                          placeholder="••••••••"
                          leftIcon={<Lock size={16} />}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                          <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSigningIn}
                            disableSheen
                            style={{ width: '100%' }}
                          >
                            Sign In & Unlock Checkout
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleDemoSignIn}
                            disabled={isSigningIn}
                            leftIcon={<Sparkles size={16} />}
                            disableSheen
                            style={{ width: '100%' }}
                          >
                            One-Click Demo Sign-In (Ayesha Rahman)
                          </Button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            New to Aurelia Atelier?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode('register');
                                setRegisterError(null);
                              }}
                              style={{
                                color: 'var(--brand-primary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                padding: 0,
                              }}
                            >
                              Create an account →
                            </button>
                          </span>
                        </div>
                      </form>
                    )}

                    {/* Create Account Tab Form */}
                    {authMode === 'register' && (
                      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {registerError && (
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
                            <AlertTriangle size={15} />
                            <span>{registerError}</span>
                          </div>
                        )}

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

                        <Input
                          label="Password"
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Create a secure password"
                          leftIcon={<Lock size={16} />}
                        />

                        <div style={{ marginTop: '6px' }}>
                          <Button
                            type="submit"
                            variant="primary"
                            isLoading={isRegistering}
                            disableSheen
                            style={{ width: '100%' }}
                          >
                            Create Account & Proceed to Checkout
                          </Button>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            Already an atelier client?{' '}
                            <button
                              type="button"
                              onClick={() => {
                                setAuthMode('signin');
                                setSignInError(null);
                              }}
                              style={{
                                color: 'var(--brand-primary)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                                padding: 0,
                              }}
                            >
                              Sign in here →
                            </button>
                          </span>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* If authenticated, show Member Status Card and Contact form */}
                {isUserAuthenticated && user && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div
                      style={{
                        padding: '18px 20px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'var(--brand-primary)',
                              color: 'var(--color-diamond)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.95rem',
                              fontWeight: 700,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {user.name}
                              </span>
                              <Badge variant="gold" size="sm">Member</Badge>
                            </div>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {user.email}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px 6px',
                            textDecoration: 'underline',
                          }}
                        >
                          Sign Out / Switch Account
                        </button>
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={14} style={{ color: 'var(--brand-primary)' }} />
                        <span>Saved addresses and concierge delivery privileges applied automatically.</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <Input
                        label="Client Full Name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (contactError) setContactError(null);
                        }}
                        placeholder="e.g. Ayesha Rahman"
                        required
                      />

                      <Input
                        label="Email (Order Dossier & Updates Only)"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (contactError) setContactError(null);
                        }}
                        placeholder="client@example.com"
                        required
                      />

                      <Input
                        label="Telephone / Mobile (For Delivery Coordination)"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (contactError) setContactError(null);
                        }}
                        placeholder="+91 98765 43210"
                        required
                      />

                      {contactError && (
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
                          <AlertTriangle size={15} />
                          <span>{contactError}</span>
                        </div>
                      )}

                      <Button
                        variant="primary"
                        onClick={handleContinueToShipping}
                        rightIcon={<ArrowRight size={16} />}
                        disableSheen
                        disabled={!!cartValidation?.hasStockIssues}
                      >
                        Continue to Shipping
                      </Button>
                      {cartValidation?.hasStockIssues && (
                        <p
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-error)',
                            marginTop: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <AlertTriangle size={14} />
                          Please resolve out-of-stock items before continuing to shipping.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Shipping & Billing */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)', margin: 0 }}>
                      Shipping & Billing
                    </h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px', margin: 0 }}>
                      Specify your white-glove destination and tax dossier billing address.
                    </p>
                  </div>
                  <button
                    onClick={() => goToStep(1)}
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--brand-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 500,
                      padding: 0,
                    }}
                  >
                    ← Edit Contact
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                      Shipping Destination
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Insured Courier Handover
                    </span>
                  </div>

                  <Input
                    label="Street Address / Residence"
                    value={addressLine1}
                    onChange={(e) => {
                      setAddressLine1(e.target.value);
                      if (shippingError) setShippingError(null);
                    }}
                    placeholder="e.g. 12 MG Road, Alwarpet"
                    required
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input
                      label="City"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (shippingError) setShippingError(null);
                      }}
                      placeholder="e.g. Chennai"
                      required
                    />
                    <Input
                      label="State / Province"
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        if (shippingError) setShippingError(null);
                      }}
                      placeholder="e.g. Tamil Nadu"
                      required
                    />
                  </div>

                  <Input
                    label="PIN Code"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value);
                      if (shippingError) setShippingError(null);
                    }}
                    placeholder="6-digit PIN"
                    required
                  />

                  {shippingError && (
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
                      <AlertTriangle size={15} />
                      <span>{shippingError}</span>
                    </div>
                  )}
                </div>

                {/* Billing Address Subsection */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Receipt size={17} style={{ color: 'var(--brand-primary)' }} />
                      <h4 style={{ fontSize: '1.02rem', fontFamily: 'var(--font-display)', margin: 0, color: 'var(--text-primary)' }}>
                        Billing Address
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Required for certified invoices
                    </span>
                  </div>

                  {/* Same as shipping toggle card */}
                  <label
                    id="billing-same-as-shipping-label"
                    htmlFor="billing-same-as-shipping-checkbox"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px 16px',
                      backgroundColor: sameAsShipping ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                      border: `1px solid ${sameAsShipping ? 'var(--brand-primary)' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      id="billing-same-as-shipping-checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => {
                        setSameAsShipping(e.target.checked);
                        if (e.target.checked) setBillingError(null);
                      }}
                      style={{
                        marginTop: '3px',
                        accentColor: 'var(--brand-primary)',
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Billing address matches shipping destination
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        Official tax invoice and certified physical dossier will be addressed to your delivery residence.
                      </span>
                    </div>
                  </label>

                  {/* Distinct Billing Address Form */}
                  {!sameAsShipping && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        padding: '20px',
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        marginTop: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)' }}>
                          Distinct Billing Entity
                        </span>
                        {user?.addresses && user.addresses.length > 0 && (
                          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                            Quick-fill from saved profile addresses:
                          </span>
                        )}
                      </div>

                      {/* Saved addresses quick picker if user has addresses */}
                      {user?.addresses && user.addresses.length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {user.addresses.map((saved) => (
                            <button
                              key={saved.id || saved.line1}
                              type="button"
                              onClick={() => {
                                setBillingName(saved.name || user.name);
                                setBillingPhone(saved.phone || user.phone || '');
                                setBillingAddressLine1(saved.line1);
                                setBillingCity(saved.city);
                                setBillingState(saved.state);
                                setBillingPincode(saved.pincode);
                                if (billingError) setBillingError(null);
                              }}
                              style={{
                                padding: '6px 12px',
                                fontSize: '0.76rem',
                                borderRadius: 'var(--radius-pill)',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <span>{saved.name ? `${saved.name}: ` : ''}{saved.line1.slice(0, 22)}… ({saved.city})</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <Input
                        label="Client or Entity Legal Name"
                        value={billingName}
                        onChange={(e) => {
                          setBillingName(e.target.value);
                          if (billingError) setBillingError(null);
                        }}
                        placeholder="e.g. Ayesha Rahman or Studio Design Ltd"
                        required
                      />

                      <Input
                        label="Billing Street Address"
                        value={billingAddressLine1}
                        onChange={(e) => {
                          setBillingAddressLine1(e.target.value);
                          if (billingError) setBillingError(null);
                        }}
                        placeholder="e.g. 44 Boat Club Road, Suite 3"
                        required
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Input
                          label="City"
                          value={billingCity}
                          onChange={(e) => {
                            setBillingCity(e.target.value);
                            if (billingError) setBillingError(null);
                          }}
                          placeholder="e.g. Chennai"
                          required
                        />
                        <Input
                          label="State / Province"
                          value={billingState}
                          onChange={(e) => {
                            setBillingState(e.target.value);
                            if (billingError) setBillingError(null);
                          }}
                          placeholder="e.g. Tamil Nadu"
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Input
                          label="PIN / Postal Code"
                          value={billingPincode}
                          onChange={(e) => {
                            setBillingPincode(e.target.value);
                            if (billingError) setBillingError(null);
                          }}
                          placeholder="6-digit PIN"
                          required
                        />
                        <Input
                          label="Billing Phone (Optional)"
                          type="tel"
                          value={billingPhone}
                          onChange={(e) => setBillingPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>

                      {billingError && (
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
                          <AlertTriangle size={15} />
                          <span>{billingError}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={handleContinueToDelivery}
                  rightIcon={<ArrowRight size={16} />}
                  disableSheen
                >
                  Continue to Delivery
                </Button>
              </div>
            )}

            {/* Step 3: Delivery */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Delivery Method</h3>
                  <button onClick={() => goToStep(2)} style={{ fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
                    ← Edit Address
                  </button>
                </div>

                <div
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--brand-primary)',
                    backgroundColor: 'var(--bg-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <Badge
                      variant="success"
                      size="sm"
                      style={{
                        border: '1px solid rgba(30, 111, 92, 0.25)',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                      }}
                    >
                      Complimentary
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <Truck size={22} style={{ color: 'var(--brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block', color: 'var(--text-primary)' }}>
                        White-Glove Insured Courier
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        BlueDart Luxury Service · 2–4 business days with signature handover
                      </span>
                    </div>
                  </div>
                </div>

                <Button variant="primary" onClick={() => goToStep(4)} rightIcon={<ArrowRight size={16} />} disableSheen>
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 4: Payment (Adyen Drop-in) */}
            {step === 4 && (
              <div className="checkout-step-content" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0, overflow: 'visible' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Select Payment Method</h3>
                  <button onClick={() => goToStep(3)} style={{ fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
                    ← Edit Delivery
                  </button>
                </div>

                <PaymentAdyenDropIn
                  amount={total}
                  selectedMethod={paymentDetails.method}
                  onSelectPayment={setPaymentDetails}
                />

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="checkout-auth-button"
                  disableSheen
                >
                  <span className="checkout-auth-label">Authorize Payment</span>
                  <span className="checkout-auth-amount">({formatPrice(total)})</span>
                </Button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div
            className="checkout-summary-card"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
              minWidth: 0,
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
              Summary ({items.length} Silhouettes)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {items.map((item) => {
                const val = cartValidation?.itemValidations[item.sku];
                const isOutOfStock = val?.isOutOfStock;
                const isExceeded = val?.isQuantityExceeded;
                const isPriceChanged = val?.isPriceChanged;

                return (
                  <div key={item.sku} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div
                      style={{
                        position: 'relative',
                        width: '60px',
                        height: '75px',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <Image src={item.product.images[0]} alt={item.product.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                      {isOutOfStock && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-diamond)',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Sold Out
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.product.name}</h4>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Size: {item.size} · Qty: {item.quantity}
                      </span>
                      {isOutOfStock && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-error)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                          Out of Stock
                        </span>
                      )}
                      {!isOutOfStock && isExceeded && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-warning)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                          Only {val.availableStock} in stock
                        </span>
                      )}
                      {isPriceChanged && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                          Catalog: {formatPrice(val.currentPrice)}
                        </span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {isPriceChanged && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      )}
                      <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                        {formatPrice((isPriceChanged && val ? val.currentPrice : item.price) * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Privilege ({appliedCoupon?.code})</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>GST (5%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>Included ({formatPrice(tax)})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ color: 'var(--color-success)' }}>Complimentary</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                <div>
                  <span>Total</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Inclusive of all taxes
                  </div>
                </div>
                <span style={{ color: 'var(--brand-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .checkout-auth-button :global(.checkout-auth-label) {
          display: inline;
        }
        .checkout-auth-button :global(.checkout-auth-amount) {
          display: inline;
          margin-left: 0.35em;
        }

        @media (max-width: 640px) {
          .checkout-main-grid {
            gap: 24px !important;
          }

          .checkout-step-card,
          .checkout-summary-card {
            padding: clamp(14px, 4vw, 24px) !important;
            min-width: 0 !important;
            overflow: visible !important;
            box-sizing: border-box !important;
          }

          .checkout-step-content {
            min-width: 0 !important;
            overflow: visible !important;
            width: 100% !important;
          }

          .checkout-auth-button {
            width: 100% !important;
            min-width: 0 !important;
            overflow: visible !important;
          }

          .checkout-auth-button :global(.checkout-auth-label) {
            display: block !important;
            line-height: 1.25 !important;
          }

          .checkout-auth-button :global(.checkout-auth-amount) {
            display: block !important;
            margin-left: 0 !important;
            margin-top: 2px !important;
            font-size: 0.88em !important;
            opacity: 0.95 !important;
            line-height: 1.2 !important;
          }

          .checkout-step-content :global(button) {
            max-width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
