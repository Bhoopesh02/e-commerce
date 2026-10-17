'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckoutAuthModal } from '@/components/checkout/CheckoutAuthModal';
import { formatPrice } from '@/lib/formatPrice';
import { Button } from '@/components/ui/Button';
import { Plus, Minus, Tag, Check, ArrowRight, ShieldCheck, ShoppingBag, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { AnimatedTrashIcon } from '@/components/ui/AnimatedTrashIcon';

export const CartView: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    cartValidation,
    isValidatingCart,
    validateCart,
    syncPrices,
    fixStockIssues,
  } = useCartStore();

  useEffect(() => {
    setCheckoutMode('cart');
    validateCart();
  }, [setCheckoutMode, validateCart]);

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div style={{ minHeight: '300px' }} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: '140px', paddingBottom: '120px', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ maxWidth: '640px', textAlign: 'center' }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-golden-100)',
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
          className="cart-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '48px',
            alignItems: 'flex-start',
            minWidth: 0,
          }}
        >
          {/* Left: Bag Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Real-time Inventory & Price Feedback Banners */}
            {cartValidation?.hasStockIssues && (
              <div
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: '240px' }}>
                  <AlertTriangle size={20} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-error)', margin: 0 }}>
                      Inventory Availability Alert
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0, lineHeight: 1.4 }}>
                      {cartValidation.summaryMessage || 'Some items in your bag are no longer available in requested quantities.'}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={fixStockIssues}>
                  Auto-Adjust Bag
                </Button>
              </div>
            )}

            {cartValidation?.hasPriceChanges && (
              <div
                style={{
                  backgroundColor: 'var(--overlay-golden-10)',
                  border: '1px solid var(--overlay-golden-35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: '240px' }}>
                  <Tag size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-primary)', margin: 0 }}>
                      Atelier Catalog Price Notice
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '4px', margin: 0, lineHeight: 1.4 }}>
                      Catalog prices have updated for one or more silhouettes in your atelier bag.
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={syncPrices} leftIcon={<RefreshCw size={13} />}>
                  Update Prices
                </Button>
              </div>
            )}

            {items.map((item) => {
              const val = cartValidation?.itemValidations[item.sku];
              const isOutOfStock = val?.isOutOfStock;
              const isExceeded = val?.isQuantityExceeded;
              const isPriceChanged = val?.isPriceChanged;
              const maxStock = val ? val.availableStock : 99;

              return (
                <div
                  key={item.sku}
                  style={{
                    display: 'flex',
                    gap: '20px',
                    padding: '24px',
                    backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: isOutOfStock
                      ? '1px solid var(--color-error)'
                      : isExceeded
                      ? '1px solid var(--color-warning)'
                      : '1px solid var(--border-color)',
                    opacity: isOutOfStock ? 0.78 : 1,
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
                    {isOutOfStock && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-diamond)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Sold Out
                      </div>
                    )}
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
                        <AnimatedTrashIcon size={16} />
                      </button>
                    </div>

                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong> · Color: {item.color}
                    </span>

                    {/* Stock Warning Badges */}
                    {isOutOfStock && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: 'var(--color-error)',
                            backgroundColor: 'var(--color-error-bg)',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            border: '1px solid var(--color-error)',
                          }}
                        >
                          <AlertCircle size={12} /> Out of Stock
                        </span>
                        <button
                          onClick={() => removeItem(item.sku)}
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-error)',
                            textDecoration: 'underline',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Remove from bag
                        </button>
                      </div>
                    )}

                    {!isOutOfStock && isExceeded && (
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: 'var(--color-warning)',
                            backgroundColor: 'var(--color-warning-bg)',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            border: '1px solid var(--color-warning)',
                          }}
                        >
                          <AlertTriangle size={12} /> Only {val.availableStock} available in atelier (requested {item.quantity})
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sku, val.availableStock)}
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--color-warning)',
                            textDecoration: 'underline',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          Adjust to {val.availableStock}
                        </button>
                      </div>
                    )}

                    {/* Price Change Feedback */}
                    {isPriceChanged && (
                      <div style={{ marginTop: '8px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: 'var(--brand-primary)',
                            backgroundColor: 'var(--overlay-golden-10)',
                            padding: '3px 10px',
                            borderRadius: 'var(--radius-pill)',
                            border: '1px solid var(--overlay-golden-35)',
                          }}
                        >
                          <Tag size={12} /> Catalog rate: {formatPrice(val.currentPrice)} ({val.priceDifference > 0 ? `+${formatPrice(val.priceDifference)}` : formatPrice(val.priceDifference)})
                        </span>
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-pill)',
                          padding: '4px 12px',
                          gap: '12px',
                          opacity: isOutOfStock ? 0.5 : 1,
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          aria-label="Decrease"
                          disabled={isOutOfStock}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '18px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            if (!val || item.quantity < val.availableStock) {
                              updateQuantity(item.sku, item.quantity + 1);
                            }
                          }}
                          aria-label="Increase"
                          disabled={isOutOfStock || item.quantity >= maxStock}
                          style={{
                            opacity: item.quantity >= maxStock ? 0.35 : 1,
                            cursor: item.quantity >= maxStock ? 'not-allowed' : 'pointer',
                          }}
                          title={item.quantity >= maxStock ? `Maximum available stock (${maxStock}) reached` : undefined}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {isPriceChanged && (
                          <span
                            style={{
                              display: 'block',
                              fontSize: '0.85rem',
                              color: 'var(--text-muted)',
                              textDecoration: 'line-through',
                            }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        )}
                        <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatPrice((isPriceChanged && val ? val.currentPrice : item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Order Summary & Privilege Code */}
          <div
            className="cart-summary-card"
            style={{
              padding: '32px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              minWidth: 0,
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
                <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={!isValidatingCart && <ArrowRight size={16} />}
              onClick={() => {
                if (!isAuthenticated || !user) {
                  setIsAuthModalOpen(true);
                  return;
                }
                router.push('/checkout');
              }}
              disableSheen
              disabled={isValidatingCart || !!cartValidation?.hasStockIssues}
            >
              {isValidatingCart ? 'Validating Atelier Inventory…' : 'Proceed to Checkout'}
            </Button>

            {cartValidation?.hasStockIssues && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-error)', fontSize: '0.82rem' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span>Please resolve unavailable items before checkout.</span>
                </div>
                <button
                  onClick={fixStockIssues}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-error)',
                    textDecoration: 'underline',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Auto-Adjust
                </button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              <ShieldCheck size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
              <span>Adyen encrypted checkout · Real-time stock reservation</span>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .cart-main-grid {
            gap: 24px !important;
          }

          .cart-summary-card {
            padding: clamp(14px, 4vw, 24px) !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
      <CheckoutAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          router.push('/checkout');
        }}
      />
    </div>
  );
};
