'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/useToastStore';
import { useScrollLock } from '@/hooks/useScrollLock';
import {
  X,
  CreditCard,
  Smartphone,
  Landmark,
  Banknote,
  Wallet,
  Package,
  Truck,
  MapPin,
  Receipt,
  Copy,
  Check,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface AdminOrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onAdvanceStatus?: (orderId: string, nextStatus: OrderStatus) => Promise<void> | void;
}

export const AdminOrderDetailsModal: React.FC<AdminOrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onAdvanceStatus,
}) => {
  const { showToast } = useToastStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const handleCopy = (text: string, key: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      showToast(`${label} copied to clipboard`, 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleAdvance = async (nextStatus: OrderStatus) => {
    if (!onAdvanceStatus) return;
    setIsUpdatingStatus(true);
    try {
      await onAdvanceStatus(order.id, nextStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Payment method presentation helper
  const getPaymentMethodPresentation = () => {
    const rawMethod = (order.payment?.method || order.paymentMethod || 'Card').toUpperCase();
    if (rawMethod.includes('UPI')) {
      return {
        label: 'UPI (Unified Payments Interface)',
        icon: <Smartphone size={18} style={{ color: 'var(--brand-primary)' }} />,
        details: order.payment?.upiVpa ? `VPA / UPI ID: ${order.payment.upiVpa}` : 'Instant Mobile Settlement',
        badgeVariant: 'gold' as const,
      };
    }
    if (rawMethod.includes('CARD')) {
      return {
        label: 'Credit / Debit Card',
        icon: <CreditCard size={18} style={{ color: 'var(--brand-primary)' }} />,
        details: order.payment?.cardLast4 ? `Encrypted Card ending in •••• ${order.payment.cardLast4}` : 'Secure Tokenized Card via Adyen',
        badgeVariant: 'gold' as const,
      };
    }
    if (rawMethod.includes('NET') || rawMethod.includes('BANK')) {
      return {
        label: 'Online Net Banking',
        icon: <Landmark size={18} style={{ color: 'var(--brand-primary)' }} />,
        details: 'Direct Bank Settlement (IMPS/NEFT)',
        badgeVariant: 'sapphire' as const,
      };
    }
    if (rawMethod.includes('COD') || rawMethod.includes('CASH')) {
      return {
        label: 'Cash on Delivery (COD)',
        icon: <Banknote size={18} style={{ color: 'var(--brand-accent)' }} />,
        details: 'Payment collected by white-glove courier upon parcel delivery',
        badgeVariant: 'warning' as const,
      };
    }
    return {
      label: order.payment?.method || order.paymentMethod || 'Electronic Settlement',
      icon: <Wallet size={18} style={{ color: 'var(--brand-primary)' }} />,
      details: 'Secure Atelier Digital Payment',
      badgeVariant: 'gold' as const,
    };
  };

  const paymentMeta = getPaymentMethodPresentation();

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-modal-title"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(9, 21, 26, 0.72)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            backgroundColor: 'var(--admin-surface)',
            border: '1px solid var(--admin-border)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '840px',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '22px 28px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--admin-surface)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--brand-primary)',
                  }}
                >
                  Commission Dossier
                </span>
                <Badge
                  variant={
                    order.status === 'Delivered'
                      ? 'success'
                      : order.status === 'Shipped'
                      ? 'gold'
                      : order.status === 'Cancelled'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '4px' }}>
                <h2
                  id="admin-order-modal-title"
                  style={{
                    fontSize: '1.45rem',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--admin-text-primary)',
                    margin: 0,
                  }}
                >
                  #{order.id}
                </h2>
                <button
                  type="button"
                  onClick={() => handleCopy(order.id, 'orderId', 'Commission ID')}
                  title="Copy Commission ID"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '2px',
                    color: copiedKey === 'orderId' ? 'var(--color-success)' : 'var(--admin-text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                  }}
                >
                  {copiedKey === 'orderId' ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedKey === 'orderId' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--admin-text-secondary)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Calendar size={13} style={{ opacity: 0.7 }} />
                <span>
                  Placed on{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Recorded in atelier system'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close dialog"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                border: '1px solid var(--admin-border)',
                backgroundColor: 'transparent',
                color: 'var(--admin-text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--admin-background)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div
            data-lenis-prevent
            style={{
              padding: '28px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* SECTION 1: ORDERED PRODUCTS / ITEMS */}
            <div
              style={{
                backgroundColor: 'var(--admin-background)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--admin-border)',
                  paddingBottom: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Package size={16} />
                  Ordered Atelier Pieces ({order.items?.length || 0})
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                  Total Units: {order.items?.reduce((acc, i) => acc + i.quantity, 0) || 0}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, idx) => {
                    const itemKey = `${item.sku}-${idx}`;
                    const hasError = imgErrors[itemKey];

                    return (
                      <div
                        key={itemKey}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          padding: '12px 14px',
                          backgroundColor: 'var(--admin-surface)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            width: '64px',
                            height: '78px',
                            position: 'relative',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            backgroundColor: 'var(--bg-subtle, #f0f0f0)',
                            flexShrink: 0,
                            border: '1px solid var(--admin-border)',
                          }}
                        >
                          {!hasError && item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName || 'Product'}
                              fill
                              sizes="64px"
                              style={{ objectFit: 'cover' }}
                              onError={() => setImgErrors((prev) => ({ ...prev, [itemKey]: true }))}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--admin-text-secondary)',
                              }}
                            >
                              <Package size={22} style={{ opacity: 0.5 }} />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              margin: '0 0 4px 0',
                              fontSize: '0.94rem',
                              fontWeight: 600,
                              color: 'var(--admin-text-primary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.productName || 'Atelier Garment'}
                          </h4>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flexWrap: 'wrap',
                              fontSize: '0.78rem',
                              color: 'var(--admin-text-secondary)',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                backgroundColor: 'var(--admin-background)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid var(--admin-border)',
                              }}
                            >
                              SKU: {item.sku}
                            </span>
                            {item.size && (
                              <span style={{ fontWeight: 500, color: 'var(--admin-text-primary)' }}>
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span>
                                Color: {item.color}
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              marginTop: '6px',
                              fontSize: '0.82rem',
                              color: 'var(--admin-text-secondary)',
                            }}
                          >
                            Quantity: <strong style={{ color: 'var(--admin-text-primary)' }}>{item.quantity}</strong> × {formatPrice(item.price)}
                          </div>
                        </div>

                        {/* Price Subtotal */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: 'var(--admin-text-primary)',
                              display: 'block',
                            }}
                          >
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.88rem', margin: 0 }}>
                    No line items recorded for this order.
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 2: PAYMENT METHOD & FINANCIAL SETTLEMENT */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '18px',
              }}
            >
              {/* Payment Method Card */}
              <div
                style={{
                  backgroundColor: 'var(--admin-background)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Receipt size={16} />
                    Payment Details
                  </span>
                  <Badge
                    variant={
                      order.payment?.status === 'successful'
                        ? 'success'
                        : order.payment?.status === 'pending'
                        ? 'warning'
                        : 'gold'
                    }
                  >
                    {order.payment?.status === 'successful' ? 'Settled / Paid' : order.payment?.status || 'Verified'}
                  </Badge>
                </div>

                {/* Primary Payment Method Block */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--admin-background)',
                      border: '1px solid var(--admin-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {paymentMeta.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                      {paymentMeta.label}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                      {paymentMeta.details}
                    </div>
                  </div>
                </div>

                {/* Transaction Reference & Specifics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
                  {order.payment?.transactionId && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        backgroundColor: 'var(--admin-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Transaction Reference:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--brand-primary)',
                            fontWeight: 600,
                            fontSize: '0.78rem',
                          }}
                        >
                          {order.payment.transactionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.payment.transactionId!, 'txnId', 'Transaction ID')}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: copiedKey === 'txnId' ? 'var(--color-success)' : 'var(--admin-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px',
                          }}
                        >
                          {copiedKey === 'txnId' ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {order.payment?.upiVpa && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        backgroundColor: 'var(--admin-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      <span style={{ color: 'var(--admin-text-secondary)' }}>UPI VPA:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--admin-text-primary)' }}>
                        {order.payment.upiVpa}
                      </span>
                    </div>
                  )}

                  {order.payment?.cardLast4 && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        backgroundColor: 'var(--admin-surface)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--admin-border)',
                      }}
                    >
                      <span style={{ color: 'var(--admin-text-secondary)' }}>Card Number:</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--admin-text-primary)' }}>
                        •••• •••• •••• {order.payment.cardLast4}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Ledger Breakdown */}
              <div
                style={{
                  backgroundColor: 'var(--admin-background)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brand-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <ShieldCheck size={16} />
                    Settlement Summary
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                    INR (₹)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-secondary)' }}>
                    <span>Pieces Subtotal</span>
                    <span style={{ color: 'var(--admin-text-primary)', fontWeight: 500 }}>
                      {formatPrice(order.totals.subtotal)}
                    </span>
                  </div>

                  {order.totals.discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                      <span>Privilege Atelier Discount</span>
                      <span style={{ fontWeight: 600 }}>-{formatPrice(order.totals.discount)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-secondary)' }}>
                    <span>Luxury GST (5%)</span>
                    <span>Included ({formatPrice(order.totals.tax)})</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--admin-text-secondary)' }}>
                    <span>White-Glove Courier</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>
                      {order.totals.delivery > 0 ? formatPrice(order.totals.delivery) : 'Complimentary'}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      borderTop: '1px solid var(--admin-border)',
                      paddingTop: '12px',
                      marginTop: '4px',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--admin-text-primary)' }}>
                        Total Collected
                      </span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--admin-text-secondary)' }}>
                        All taxes & atelier duties included
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: 'var(--brand-primary)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {formatPrice(order.totals.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: CLIENT & LOGISTICS INFORMATION */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '18px',
              }}
            >
              {/* Client & Delivery Residence */}
              <div
                style={{
                  backgroundColor: 'var(--admin-background)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '8px',
                  }}
                >
                  <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    Client & Destination
                  </span>
                </div>

                <div style={{ fontSize: '0.86rem', color: 'var(--admin-text-secondary)', lineHeight: 1.6 }}>
                  <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)', fontSize: '0.94rem' }}>
                    {order.customerName || order.address.name || 'Private Client'}
                  </div>
                  {order.customerEmail && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)' }}>
                      {order.customerEmail}
                    </div>
                  )}
                  {order.address.phone && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                      Phone: {order.address.phone}
                    </div>
                  )}
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed var(--admin-border)' }}>
                    {order.address.line1}
                    <br />
                    {order.address.city}, {order.address.state} — {order.address.pincode}
                  </div>
                </div>
              </div>

              {/* Courier & Dispatch Tracking */}
              <div
                style={{
                  backgroundColor: 'var(--admin-background)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    borderBottom: '1px solid var(--admin-border)',
                    paddingBottom: '8px',
                  }}
                >
                  <Truck size={16} style={{ color: 'var(--brand-primary)' }} />
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--brand-primary)',
                    }}
                  >
                    Carrier & Tracking
                  </span>
                </div>

                {order.trackingInfo ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Carrier Partner:</span>
                      <div style={{ fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                        {order.trackingInfo.carrier}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>Tracking Waybill:</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--brand-primary)',
                            fontWeight: 600,
                          }}
                        >
                          {order.trackingInfo.trackingId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.trackingInfo!.trackingId, 'trackingId', 'Tracking number')}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: copiedKey === 'trackingId' ? 'var(--color-success)' : 'var(--admin-text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '2px',
                          }}
                        >
                          {copiedKey === 'trackingId' ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    {order.trackingInfo.estimatedDelivery && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                        Estimated Delivery: <strong style={{ color: 'var(--admin-text-primary)' }}>{order.trackingInfo.estimatedDelivery}</strong>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.86rem', margin: 0 }}>
                    White-glove tracking will be registered once parcel is packed and dispatched.
                  </p>
                )}
              </div>
            </div>

            {/* SECTION 4: AUDIT TIMELINE / LIFECYCLE */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div
                style={{
                  backgroundColor: 'var(--admin-background)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                }}
              >
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '14px',
                  }}
                >
                  <Clock size={16} />
                  Fulfillment Audit Trail
                </span>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
                  {order.statusHistory.map((step, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor:
                            sIdx === order.statusHistory.length - 1
                              ? 'var(--brand-primary)'
                              : 'var(--admin-border)',
                          marginTop: '5px',
                          flexShrink: 0,
                          boxShadow:
                            sIdx === order.statusHistory.length - 1
                              ? '0 0 0 3px rgba(36, 75, 87, 0.2)'
                              : 'none',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--admin-text-primary)' }}>
                            {step.status}
                          </span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)' }}>
                            {new Date(step.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        {step.note && (
                          <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: 'var(--admin-text-secondary)' }}>
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer / Quick Actions */}
          <div
            style={{
              padding: '16px 28px',
              borderTop: '1px solid var(--admin-border)',
              backgroundColor: 'var(--admin-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-secondary)' }}>
                Current Status: <strong style={{ color: 'var(--admin-text-primary)' }}>{order.status}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Advance Status Button from inside modal */}
              {onAdvanceStatus && (
                <>
                  {order.status === 'Placed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleAdvance('Confirmed')}
                    >
                      Confirm Commission
                    </Button>
                  )}
                  {order.status === 'Confirmed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleAdvance('Packed')}
                    >
                      Package Order
                    </Button>
                  )}
                  {order.status === 'Packed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleAdvance('Shipped')}
                    >
                      Dispatch / Ship
                    </Button>
                  )}
                  {order.status === 'Shipped' && (
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isUpdatingStatus}
                      onClick={() => handleAdvance('Delivered')}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                  {order.status === 'Delivered' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-success)',
                      }}
                    >
                      <CheckCircle2 size={16} /> Fulfillment Completed
                    </span>
                  )}
                </>
              )}

              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
