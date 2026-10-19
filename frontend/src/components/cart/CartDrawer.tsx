'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CheckoutAuthModal } from '@/components/checkout/CheckoutAuthModal';
import { formatPrice } from '@/lib/formatPrice';
import { Plus, Minus, Tag, Check, ArrowRight, ShoppingBag, AlertTriangle, AlertCircle, RefreshCw } from 'lucide-react';
import { AnimatedTrashIcon } from '@/components/ui/AnimatedTrashIcon';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
    cartValidation,
    isValidatingCart,
    validateCart,
    syncPrices,
    fixStockIssues,
    updateItemPrice,
  } = useCartStore();

  useEffect(() => {
    if (isDrawerOpen) {
      validateCart();
    }
  }, [isDrawerOpen, validateCart]);

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
    if (!isAuthenticated || !user) {
      setIsAuthModalOpen(true);
      return;
    }
    closeDrawer();
    router.push('/checkout');
  };

  if (!isDrawerOpen && !isAuthModalOpen) {
    return null;
  }

  return (
    <>
      {isDrawerOpen && (
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
                backgroundColor: 'var(--color-golden-100)',
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
            {/* Real-time Inventory & Price Feedback Banners */}
            {cartValidation?.hasStockIssues && (
              <div
                style={{
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-error)', margin: 0 }}>
                      Inventory Availability Alert
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4, margin: 0 }}>
                      {cartValidation.summaryMessage || 'Some items in your bag are no longer available in the requested quantity.'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={fixStockIssues}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--color-error)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--color-error)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0 16px',
                      minHeight: 44,
                      minWidth: 44,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    Auto-Adjust Bag
                  </button>
                </div>
              </div>
            )}

            {cartValidation?.hasPriceChanges && (
              <div
                style={{
                  backgroundColor: 'var(--overlay-golden-10)',
                  border: '1px solid var(--overlay-golden-35)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Tag size={18} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-primary)', margin: 0 }}>
                      Atelier Catalog Price Notice
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4, margin: 0 }}>
                      Item prices have updated in our atelier catalog.
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                  <button
                    onClick={syncPrices}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--brand-primary)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--brand-primary)',
                      borderRadius: 'var(--radius-pill)',
                      padding: '0 16px',
                      minHeight: 44,
                      minWidth: 44,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <RefreshCw size={13} /> Update Prices
                  </button>
                </div>
              </div>
            )}

            {/* Items List */}
            <div
              data-lenis-prevent
              style={{
                flex: 1,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                paddingRight: '6px',
                marginBottom: '24px',
              }}
            >
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
                      gap: '16px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid var(--border-light)',
                      opacity: isOutOfStock ? 0.75 : 1,
                      backgroundColor: isOutOfStock ? 'rgba(239, 68, 68, 0.04)' : undefined,
                      padding: isOutOfStock ? '12px' : undefined,
                      borderRadius: isOutOfStock ? 'var(--radius-sm)' : undefined,
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
                            fontSize: '0.75rem',
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
                          style={{
                            color: 'var(--text-muted)',
                            width: 44,
                            height: 44,
                            minWidth: 44,
                            minHeight: 44,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '-10px -10px -10px 0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                          aria-label={`Remove ${item.product.name}`}
                        >
                          <AnimatedTrashIcon size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Size: <strong style={{ color: 'var(--text-primary)' }}>{item.size}</strong> · Color: {item.color}
                      </div>

                      {/* Stock Warning Badges */}
                      {isOutOfStock && (
                        <div style={{ marginTop: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: 'var(--color-error)',
                              backgroundColor: 'var(--color-error-bg)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              border: '1px solid var(--color-error)',
                            }}
                          >
                            <AlertCircle size={11} /> Out of Stock
                          </span>
                          <button
                            onClick={() => removeItem(item.sku)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              minHeight: 44,
                              fontSize: '0.8rem',
                              color: 'var(--color-error)',
                              textDecoration: 'underline',
                              marginTop: '2px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 4px',
                            }}
                          >
                            Remove item to proceed
                          </button>
                        </div>
                      )}

                      {!isOutOfStock && isExceeded && (
                        <div style={{ marginTop: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--color-warning)',
                              backgroundColor: 'var(--color-warning-bg)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              border: '1px solid var(--color-warning)',
                            }}
                          >
                            <AlertTriangle size={11} /> Only {val.availableStock} in stock (requested {item.quantity})
                          </span>
                          <button
                            onClick={() => updateQuantity(item.sku, val.availableStock)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              minHeight: 44,
                              fontSize: '0.8rem',
                              color: 'var(--color-warning)',
                              textDecoration: 'underline',
                              marginTop: '2px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '0 4px',
                            }}
                          >
                            Adjust to available {val.availableStock}
                          </button>
                        </div>
                      )}

                      {/* Price Change Feedback */}
                      {isPriceChanged && (
                        <div style={{ marginTop: '6px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: 'var(--brand-primary)',
                              backgroundColor: 'var(--overlay-golden-10)',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              border: '1px solid var(--overlay-golden-35)',
                            }}
                          >
                            <Tag size={11} /> Catalog price: {formatPrice(val.currentPrice)}
                          </span>
                        </div>
                      )}

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
                            padding: '0 2px',
                            height: 44,
                            boxSizing: 'border-box',
                            opacity: isOutOfStock ? 0.5 : 1,
                          }}
                        >
                          <button
                            onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                            style={{
                              width: 44,
                              height: 44,
                              minWidth: 44,
                              minHeight: 44,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                              background: 'none',
                              border: 'none',
                              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                              padding: 0,
                            }}
                            aria-label="Decrease quantity"
                            disabled={isOutOfStock}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, minWidth: '20px', textAlign: 'center', userSelect: 'none' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              if (!val || item.quantity < val.availableStock) {
                                updateQuantity(item.sku, item.quantity + 1);
                              }
                            }}
                            style={{
                              width: 44,
                              height: 44,
                              minWidth: 44,
                              minHeight: 44,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: item.quantity >= maxStock ? 'var(--text-muted)' : 'var(--text-primary)',
                              opacity: item.quantity >= maxStock ? 0.35 : 1,
                              cursor: item.quantity >= maxStock ? 'not-allowed' : 'pointer',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                            }}
                            disabled={isOutOfStock || item.quantity >= maxStock}
                            aria-label="Increase quantity"
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
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                textDecoration: 'line-through',
                              }}
                            >
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          )}
                          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatPrice((isPriceChanged && val ? val.currentPrice : item.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-error)',
                      textDecoration: 'underline',
                      minHeight: 44,
                      minWidth: 44,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 8px',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0 12px',
                      minHeight: 44,
                      backgroundColor: 'var(--bg-surface)',
                    }}
                  >
                    <Tag size={15} style={{ color: 'var(--text-muted)', marginRight: '8px', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Privilege Code (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        height: '100%',
                        minHeight: 44,
                        fontSize: '1rem',
                        textTransform: 'uppercase',
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                      }}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="outline"
                    size="md"
                    isLoading={isApplyingCoupon}
                    disabled={!couponInput.trim()}
                    style={{ minHeight: 44, minWidth: 80 }}
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
                <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--brand-primary)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Button
              onClick={handleProceedToCheckout}
              variant="primary"
              size="lg"
              fullWidth
              rightIcon={!isValidatingCart && <ArrowRight size={16} />}
              disableSheen
              disabled={isValidatingCart || !!cartValidation?.hasStockIssues}
            >
              {isValidatingCart ? 'Validating Atelier Inventory…' : 'Proceed to Checkout'}
            </Button>
            {cartValidation?.hasStockIssues && (
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-error)',
                  textAlign: 'center',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <AlertTriangle size={13} />
                Please resolve unavailable items before checkout
              </p>
            )}
          </>
        )}
      </div>
    </Drawer>
      )}

      <CheckoutAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          closeDrawer();
          router.push('/checkout');
        }}
      />
    </>
  );
};
