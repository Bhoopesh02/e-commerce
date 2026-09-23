'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/formatPrice';
import { Plus, Minus, Tag, Check, ArrowRight, ShoppingBag } from 'lucide-react';
import { AnimatedTrashIcon } from '@/components/ui/AnimatedTrashIcon';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
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
  } = useCartStore();

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

  const handleProceedToCheckout = () => {
    closeDrawer();
    router.push('/checkout');
  };

  return (
    <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} title="Your Atelier Bag" width="480px">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {items.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '70%',
              textAlign: 'center',
              padding: '32px',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'rgba(243, 159, 90, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                color: 'var(--cta-primary)',
              }}
            >
              <ShoppingBag size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>Your Bag is Empty</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Explore our latest curated silhouettes from the Milan and Florentine ateliers.
            </p>
            <Button
              onClick={() => {
                closeDrawer();
                router.push('/shop');
              }}
              variant="primary"
            >
              Explore Collections
            </Button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '6px',
                marginBottom: '24px',
              }}
            >
              {items.map((item) => (
                <div
                  key={item.sku}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid var(--border-light)',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '90px',
                      height: '115px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      backgroundColor: 'var(--bg-primary)',
                    }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeDrawer}
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.sku)}
                        style={{ color: 'var(--text-muted)', padding: '2px' }}
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <AnimatedTrashIcon size={15} />
                      </button>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong> · Color: {item.color}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: '10px',
                      }}
                    >
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '2px 8px',
                          gap: '10px',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div style={{ marginBottom: '20px' }}>
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
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-success)' }}>
                      {appliedCoupon.code} applied (-{formatPrice(discountAmount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ fontSize: '0.75rem', color: 'var(--color-error)', textDecoration: 'underline' }}
                  >
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
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    <Tag size={15} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ width: '100%', fontSize: '0.82rem', textTransform: 'uppercase' }}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    isLoading={isApplyingCoupon}
                    disabled={!couponInput.trim()}
                  >
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

            {/* Financial Summary */}
            <div
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-sm)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                border: '1px solid var(--border-color)',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--color-success)' }}>
                  <span>Privilege Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated GST (5%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>Included ({formatPrice(tax)})</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>White-Glove Luxury Delivery</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Complimentary</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '12px',
                  marginTop: '4px',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                    Inclusive of all taxes
                  </div>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-sunset-700)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Button
              onClick={handleProceedToCheckout}
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={<ArrowRight size={16} />}
            >
              Proceed to Checkout
            </Button>
          </>
        )}
      </div>
    </Drawer>
  );
};
