'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { formatPrice } from '@/lib/formatPrice';
import { validateStock, placeOrder } from '@/lib/mockApi';
import { Order, Address } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PaymentAdyenDropIn, PaymentMethodType, PaymentDetails } from '@/components/checkout/PaymentAdyenDropIn';
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  Mail,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const { getActiveItems, clearCart, clearBuyNowItem, checkoutMode, getSubtotal, getTax, getDeliveryFee, getTotal, appliedCoupon, discountAmount } = useCartStore();
  const items = getActiveItems();
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState(user?.email || 'ayesha@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [name, setName] = useState(user?.name || 'Ayesha Rahman');

  // Address state
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [addressLine1, setAddressLine1] = useState(defaultAddr?.line1 || '12 MG Road, Alwarpet');
  const [city, setCity] = useState(defaultAddr?.city || 'Chennai');
  const [state, setState] = useState(defaultAddr?.state || 'Tamil Nadu');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '600001');

  // Payment state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ method: 'UPI', upiVpa: 'ayesha@oksbi' });

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

      const res = await placeOrder({
        userId: user?.id || 'usr_001',
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
        setStep(5);
        if (checkoutMode === 'buy_now') {
          clearBuyNowItem();
        } else {
          clearCart();
        }
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F39F5A', '#AE445A', '#662549', '#E8BCB9'],
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

          <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-600)' }}>
            Atelier Order Confirmed
          </span>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', marginTop: '8px', marginBottom: '16px' }}>
            Thank You, {confirmedOrder.customerName}
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Your commission has been registered under reference <strong>#{confirmedOrder.id}</strong>.
            Our master tailors are preparing your pieces for white-glove dispatch.
          </p>

          {/* Email dispatch notice per rule */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'rgba(243, 159, 90, 0.12)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(243, 159, 90, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '36px',
              textAlign: 'left',
            }}
          >
            <Mail size={20} style={{ color: 'var(--color-sunset-600)', flexShrink: 0 }} />
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
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Delivery</span>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {confirmedOrder.trackingInfo?.estimatedDelivery} via {confirmedOrder.trackingInfo?.carrier}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Waybill Tracking</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-sunset-700)' }}>
                  {confirmedOrder.trackingInfo?.trackingId}
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

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 600 }}>
              <span>Total Paid ({confirmedOrder.payment.method})</span>
              <span style={{ color: 'var(--color-sunset-700)' }}>{formatPrice(confirmedOrder.totals.total)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link href={`/account/orders/${confirmedOrder.id}`}>
              <Button variant="primary">Track Order Progress</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
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
          <Link href="/shop">
            <Button variant="primary">Browse Collections</Button>
          </Link>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '0.85rem' }}>
            <span style={{ color: step >= 1 ? 'var(--color-sunset-700)' : 'var(--text-muted)', fontWeight: step === 1 ? 700 : 500 }}>
              1. Contact
            </span>
            <span>→</span>
            <span style={{ color: step >= 2 ? 'var(--color-sunset-700)' : 'var(--text-muted)', fontWeight: step === 2 ? 700 : 500 }}>
              2. Shipping
            </span>
            <span>→</span>
            <span style={{ color: step >= 3 ? 'var(--color-sunset-700)' : 'var(--text-muted)', fontWeight: step === 3 ? 700 : 500 }}>
              3. Delivery
            </span>
            <span>→</span>
            <span style={{ color: step >= 4 ? 'var(--color-sunset-700)' : 'var(--text-muted)', fontWeight: step === 4 ? 700 : 500 }}>
              4. Payment
            </span>
          </div>
        </div>

        {/* Stock Error Alert */}
        {stockError && (
          <div
            style={{
              maxWidth: '960px',
              margin: '0 auto 32px',
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
          style={{
            maxWidth: '1040px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Step Content */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '36px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Step 1: Contact */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Contact Information</h3>
                <Input
                  label="Client Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email (Order Dossier & Updates Only)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Telephone / Mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <Button variant="primary" onClick={() => setStep(2)} rightIcon={<ArrowRight size={16} />}>
                  Continue to Shipping
                </Button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Shipping Address</h3>
                  <button onClick={() => setStep(1)} style={{ fontSize: '0.8rem', color: 'var(--color-sunset-600)' }}>
                    ← Edit Contact
                  </button>
                </div>
                <Input
                  label="Street Address / Residence"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} required />
                  <Input label="State" value={state} onChange={(e) => setState(e.target.value)} required />
                </div>
                <Input
                  label="PIN Code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                />
                <Button variant="primary" onClick={() => setStep(3)} rightIcon={<ArrowRight size={16} />}>
                  Continue to Delivery
                </Button>
              </div>
            )}

            {/* Step 3: Delivery */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Delivery Method</h3>
                  <button onClick={() => setStep(2)} style={{ fontSize: '0.8rem', color: 'var(--color-sunset-600)' }}>
                    ← Edit Address
                  </button>
                </div>

                <div
                  style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-sm)',
                    border: '2px solid var(--color-sunset-700)',
                    backgroundColor: 'rgba(243, 159, 90, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <Truck size={24} style={{ color: 'var(--color-sunset-600)' }} />
                    <div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block' }}>
                        White-Glove Insured Courier
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        BlueDart Luxury Service · 2–4 business days with signature handover
                      </span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '0.9rem' }}>
                    Complimentary
                  </span>
                </div>

                <Button variant="primary" onClick={() => setStep(4)} rightIcon={<ArrowRight size={16} />}>
                  Continue to Payment
                </Button>
              </div>
            )}

            {/* Step 4: Payment (Adyen Drop-in) */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Select Payment Method</h3>
                  <button onClick={() => setStep(3)} style={{ fontSize: '0.8rem', color: 'var(--color-sunset-600)' }}>
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
                >
                  Authorize Payment ({formatPrice(total)})
                </Button>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
              Summary ({items.length} Silhouettes)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {items.map((item) => (
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
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.product.name}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Size: {item.size} · Qty: {item.quantity}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
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
                <span>{formatPrice(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivery</span>
                <span style={{ color: 'var(--color-success)' }}>Complimentary</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
                <span>Total</span>
                <span style={{ color: 'var(--color-sunset-700)' }}>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
