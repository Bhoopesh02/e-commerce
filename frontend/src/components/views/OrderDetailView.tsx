'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById, cancelOrder, requestReturn } from '@/lib/mockApi';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import {
  Package,
  Truck,
  RotateCcw,
  XCircle,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  MapPin,
  CreditCard,
} from 'lucide-react';

interface OrderDetailViewProps {
  orderId: string;
}

const OrderItemThumbnail: React.FC<{ src?: string; alt: string }> = ({ src, alt }) => {
  const [hasError, setHasError] = useState(!src);

  return (
    <div
      className="order-item-thumb"
      style={{
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: 'var(--color-neutral-100)',
        borderRadius: 'var(--radius-sm)',
      }}
    >
      {!hasError && src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 600px) 22vw, 120px"
          style={{ objectFit: 'cover' }}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          className="order-item-fallback"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-neutral-100)',
          }}
          aria-hidden="true"
        >
          <Package size={22} style={{ color: 'var(--text-muted)', opacity: 0.6 }} />
        </div>
      )}
      <style jsx>{`
        .order-item-thumb {
          width: 75px;
          height: 95px;
        }
        @media (max-width: 600px) {
          .order-item-thumb {
            width: clamp(72px, 22vw, 120px) !important;
            aspect-ratio: 3 / 4 !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  // Modals
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('Size fit preference');
  const [returnComments, setReturnComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center' }}>
        <p>Loading Commission Details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h2>Order Not Located</h2>
        <Link href="/account">
          <Button variant="outline" style={{ marginTop: '16px' }}>Return to Account</Button>
        </Link>
      </div>
    );
  }

  // Check cancellation eligibility
  const canCancel = order.status === 'Placed' || order.status === 'Confirmed';
  // Check return eligibility
  const canReturn = order.status === 'Delivered';

  const handleConfirmCancel = async () => {
    setIsProcessing(true);
    try {
      const res = await cancelOrder(order.id, 'customer');
      if (res.success && res.order) {
        setOrder(res.order);
        setCancelModalOpen(false);
        showToast('Commission cancelled successfully.', 'success');
      } else {
        showToast(res.error || 'Cancellation not permitted.', 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmReturn = async () => {
    setIsProcessing(true);
    try {
      const res = await requestReturn(order.id, returnReason, returnComments);
      if (res.success) {
        setReturnModalOpen(false);
        showToast('Return authorization requested. Our courier desk will coordinate pickup.', 'success');
      } else {
        showToast(res.error || 'Return request unsuccessful.', 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="account-section fade-in">
      <div className="container" style={{ maxWidth: '100%', padding: 0 }}>
        {/* Navigation back */}
        <Link
          href="/account/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--brand-primary)',
            marginBottom: '24px',
            fontWeight: 500,
            minHeight: '2.75rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Commissions Portfolio
        </Link>

        {/* Order Header Card */}
        <div className="order-detail-card">
          <div className="order-header-row">
            <div>
              <span className="order-header-badge">
                Official Atelier Commission
              </span>
              <h1 className="order-header-title">
                Commission Details
              </h1>
              <span className="order-header-date">
                Registered: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="order-header-actions">
              {canCancel && (
                <Button className="order-action-btn" variant="danger" size="sm" onClick={() => setCancelModalOpen(true)} leftIcon={<XCircle size={15} />}>
                  Cancel Commission
                </Button>
              )}

              {canReturn && (
                <Button className="order-action-btn order-action-return" variant="outline" size="sm" onClick={() => setReturnModalOpen(true)} leftIcon={<RotateCcw size={15} />}>
                  Request Return / Exchange
                </Button>
              )}
            </div>
          </div>

          {/* Fulfillment Status Progress Timeline */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '0.88rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
              Fulfillment Status
            </h2>
            <StatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
          </div>

          {/* Courier Tracking strip */}
          {order.trackingInfo && order.status !== 'Cancelled' && (
            <div className="order-tracking-strip">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Truck size={20} style={{ color: 'var(--brand-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <span className="tracking-carrier-text">
                    {order.trackingInfo.carrier} · Waybill <span className="tracking-waybill">#{order.trackingInfo.trackingId}</span>
                  </span>
                  <span className="tracking-arrival-text">
                    Estimated Arrival: {order.trackingInfo.estimatedDelivery || 'In Transit'}
                  </span>
                </div>
              </div>

              {order.trackingInfo.trackingUrl && (
                <a
                  href={order.trackingInfo.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tracking-link-btn"
                >
                  Live Courier Tracking <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Garments Breakdown Card */}
        <div className="order-detail-card">
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
            Commissioned Silhouettes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} className="order-item-row">
                <OrderItemThumbnail src={item.productImage} alt={item.productName || 'Garment'} />
                
                <div className="order-item-content">
                  <div className="order-item-header">
                    <h3 className="order-item-title">{item.productName}</h3>
                    <span className="order-item-price-mobile">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                  <p className="order-item-meta">
                    SKU: {item.sku} · Size: {item.size} · Color: {item.color}
                  </p>
                  <p className="order-item-qty">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                
                <span className="order-item-price-desktop">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="order-totals-card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>{formatPrice(order.totals.subtotal)}</span>
            </div>
            {order.totals.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)' }}>
                <span>Privilege Discount</span>
                <span>-{formatPrice(order.totals.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Luxury GST (5%)</span>
              <span style={{ color: 'var(--text-secondary)' }}>Included ({formatPrice(order.totals.tax)})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>White-Glove Delivery</span>
              <span style={{ color: 'var(--color-success)' }}>Complimentary</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '1.2rem', fontWeight: 600, borderTop: '1px solid var(--border-light)', paddingTop: '12px', marginTop: '4px' }}>
              <div>
                <span>Total Settlement</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Inclusive of all taxes
                </div>
              </div>
              <span style={{ color: 'var(--brand-primary)' }}>{formatPrice(order.totals.total)}</span>
            </div>
          </div>
        </div>

        {/* Address & Payment Info Grid */}
        <div className="order-info-grid">
          <div className="order-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <MapPin size={18} style={{ color: 'var(--brand-primary)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Delivery Residence</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {order.address.name}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.state} — {order.address.pincode}
            </p>
          </div>

          <div className="order-info-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CreditCard size={18} style={{ color: 'var(--brand-primary)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Payment Method</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Method: <strong>{order.payment.method}</strong>
              <br />
              Status: <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>Settled via Adyen</span>
              <br />
              Transaction ID: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', overflowWrap: 'anywhere' }}>{order.payment.transactionId}</span>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .order-detail-card {
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 32px;
          box-shadow: var(--shadow-sm);
          margin-bottom: 32px;
        }

        .order-header-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 20px;
          margin-bottom: 24px;
        }

        .order-header-badge {
          display: block;
          margin-bottom: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--brand-primary);
        }

        .order-header-title {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          margin-top: 4px;
        }

        .order-header-date {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .order-header-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .order-tracking-strip {
          background-color: var(--overlay-golden-10);
          border: 1px solid var(--overlay-golden-35);
          border-radius: var(--radius-sm);
          padding: 16px 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .tracking-carrier-text {
          font-size: 0.88rem;
          font-weight: 600;
          display: block;
        }

        .tracking-waybill {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .tracking-arrival-text {
          font-size: 0.78rem;
          color: var(--text-muted);
          display: block;
        }

        .tracking-link-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          color: var(--brand-primary);
          font-weight: 600;
          text-decoration: none;
        }

        .order-item-row {
          display: flex;
          gap: 16px;
          align-items: center;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: 16px;
        }

        :global(.order-item-thumb) {
          position: relative;
          width: 75px;
          height: 95px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          flex-shrink: 0;
          background-color: var(--color-neutral-100);
        }

        .order-item-fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--color-neutral-100);
        }

        .order-item-content {
          flex: 1;
          min-width: 0;
        }

        .order-item-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
        }

        .order-item-title {
          font-size: 0.98rem;
          font-weight: 600;
          margin: 0;
          word-break: break-word;
        }

        .order-item-price-mobile {
          display: none;
        }

        .order-item-price-desktop {
          font-size: 1.05rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .order-item-meta {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 2px;
          overflow-wrap: anywhere;
        }

        .order-item-qty {
          font-size: 0.85rem;
          color: var(--text-primary);
          margin-top: 4px;
        }

        .order-totals-card {
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.9rem;
          max-width: 380px;
          margin-left: auto;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .order-info-card {
          background-color: var(--bg-surface);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          padding: 24px;
        }

        @media (max-width: 600px) {
          .order-detail-card {
            padding: clamp(12px, 4vw, 32px);
            margin-bottom: 20px;
          }

          .order-header-actions {
            width: 100%;
            min-width: 0;
            overflow: visible;
            flex-direction: column;
            gap: 10px;
          }

          :global(.order-action-btn) {
            width: 100% !important;
            max-width: 100% !important;
            box-sizing: border-box !important;
            justify-content: center !important;
            min-height: 2.75rem !important;
            padding-inline: clamp(14px, 4vw, 24px) !important;
            padding-top: 0.6rem !important;
            padding-bottom: 0.6rem !important;
            font-size: clamp(0.72rem, 3.4vw, 0.85rem) !important;
            letter-spacing: 0.06em !important;
            white-space: normal !important;
            line-height: 1.3 !important;
            text-align: center !important;
            overflow: visible !important;
            min-width: 0 !important;
          }

          .order-tracking-strip {
            flex-direction: column;
            align-items: stretch;
            padding: 14px 16px;
            gap: 12px;
          }

          .tracking-link-btn {
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
          }

          .order-item-row {
            gap: clamp(12px, 3.5vw, 16px);
            align-items: flex-start;
          }

          :global(.order-item-thumb) {
            width: clamp(72px, 22vw, 120px);
            aspect-ratio: 3 / 4;
            height: auto;
          }

          .order-item-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }

          .order-item-title {
            font-size: clamp(0.92rem, 3vw, 1rem);
            line-height: 1.3;
          }

          .order-item-price-mobile {
            display: block;
            font-size: 1.05rem;
            font-weight: 600;
            margin-top: 2px;
            color: var(--brand-primary);
          }

          .order-item-price-desktop {
            display: none;
          }

          .order-item-meta {
            margin-top: 6px;
            line-height: 1.4;
          }

          .order-item-qty {
            margin-top: 4px;
          }

          .order-totals-card {
            max-width: 100%;
            width: 100%;
            margin-left: 0;
            padding-top: 16px;
            border-top: 1px solid var(--border-light);
          }

          .order-info-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .order-info-card {
            padding: clamp(12px, 4vw, 24px);
          }
        }
      `}</style>

      {/* Cancellation Modal */}
      <Modal isOpen={cancelModalOpen} onClose={() => setCancelModalOpen(false)} title="Confirm Commission Cancellation">
        <div>
          <p className="modal-description" style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Are you certain you wish to cancel this commission? Your reservation of this limited edition will be released back to the central atelier inventory.
          </p>
          <div className="modal-action-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="ghost" onClick={() => setCancelModalOpen(false)} disabled={isProcessing}>
              Keep Commission
            </Button>
            <Button variant="danger" isLoading={isProcessing} onClick={handleConfirmCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>

      {/* Return Request Modal */}
      <Modal isOpen={returnModalOpen} onClose={() => setReturnModalOpen(false)} title="Request Return / Exchange Privilege">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p className="modal-description" style={{ color: 'var(--text-muted)' }}>
            Returns are accommodated within 7 days of physical delivery. Our concierge courier will collect the sealed package at your delivery residence.
          </p>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Primary Reason
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
              }}
            >
              <option value="Size fit preference">Size / Fit exchange needed</option>
              <option value="Color tone variation">Color tone differs from expectation</option>
              <option value="Styling consultation">Styling preference exchange</option>
              <option value="Inspection issue">Atelier seal inspection</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Notes for Courier Desk (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide any specific fit notes or preferred pickup timing..."
              value={returnComments}
              onChange={(e) => setReturnComments(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
                fontSize: '0.9rem',
                resize: 'none',
              }}
            />
          </div>

          <div className="modal-action-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => setReturnModalOpen(false)} disabled={isProcessing}>
              Dismiss
            </Button>
            <Button variant="primary" isLoading={isProcessing} onClick={handleConfirmReturn}>
              Submit Return Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
