'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/formatPrice';
import { Button } from '@/components/ui/Button';
import { Trash2, Plus, Minus, Tag, Check, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CartView: React.FC = () => {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    appliedCoupon,
    discountAmount,
    couponError,
    applyCouponCode,
    removeCoupon,
    getSubtotal,
    getTax,
    getDeliveryFee,
    getTotal,
    setCheckoutMode,
  } = useCartStore();

  useEffect(() => {
    setCheckoutMode('cart');
  }, [setCheckoutMode]);

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const tax = getTax();
  const delivery = getDeliveryFee();
  const total = getTotal();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput);
    setIsApplyingCoupon(false);
  };

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(243, 159, 90, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--cta-primary)',
            }}
          >
            <ShoppingBag size={32} />
          </div>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '16px' }}>Your Atelier Bag is Empty</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
            Explore the current editions from Milan and Florence ateliers, tailored in superfine virgin wool and Grade-A cashmere.
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Explore Collections
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: '36px' }}>Your Atelier Bag</h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Bag Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {items.map((item) => (
              <div
                key={item.sku}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '24px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '110px',
                    height: '140px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image src={item.product.images[0]} alt={item.product.name} fill sizes="110px" style={{ objectFit: 'cover' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Link href={`/product/${item.product.slug}`}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.product.name}
                      </h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item.sku)}
                      style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong> · Color: {item.color}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-pill)',
                        padding: '4px 12px',
                        gap: '12px',
                      }}
                    >
                      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} aria-label="Decrease">
                        <Minus size={13} />
                      </button>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} aria-label="Increase">
                        <Plus size={13} />
                      </button>
                    </div>

                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary & Privilege Code */}
          <div
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-display)' }}>Order Summary</h3>

            {/* Privilege Code Form */}
            <div>
              {appliedCoupon ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: 'var(--color-success-bg)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-success)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={16} style={{ color: 'var(--color-success)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)' }}>
                      {appliedCoupon.code} applied (-{formatPrice(discountAmount)})
                    </span>
                  </div>
                  <button onClick={removeCoupon} style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 12px',
                    }}
                  >
                    <Tag size={15} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ width: '100%', fontSize: '0.85rem', textTransform: 'uppercase' }}
                    />
                  </div>
                  <Button type="submit" variant="outline" size="sm" isLoading={isApplyingCoupon}>
                    Apply
                  </Button>
                </form>
              )}

              {couponError && (
                <p style={{ fontSize: '0.78rem', color: 'var(--color-error)', marginTop: '6px' }}>
                  {couponError}
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Luxury GST (5%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>Included ({formatPrice(tax)})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>White-Glove Luxury Delivery</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Complimentary</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '16px',
                  marginTop: '4px',
                }}
              >
                <div>
                  <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Estimated Total</span>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '2px' }}>
                    Inclusive of all taxes
                  </div>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-sunset-700)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight size={16} />}
              onClick={() => router.push('/checkout')}
            >
              Proceed to Checkout
            </Button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-sunset-600)', flexShrink: 0 }} />
              <span>Adyen encrypted checkout · Real-time stock reservation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
