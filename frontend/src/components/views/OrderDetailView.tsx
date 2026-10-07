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
          }}
        >
          <ArrowLeft size={16} /> Back to Commissions Portfolio
        </Link>

        {/* Order Header Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '16px',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '20px',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ display: 'block', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                Official Atelier Commission
              </span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginTop: '4px' }}>
                Commission Details
              </h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Registered: {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {canCancel && (
                <Button variant="danger" size="sm" onClick={() => setCancelModalOpen(true)} leftIcon={<XCircle size={15} />}>
                  Cancel Commission
                </Button>
              )}

              {canReturn && (
                <Button variant="outline" size="sm" onClick={() => setReturnModalOpen(true)} leftIcon={<RotateCcw size={15} />}>
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
            <div
              style={{
                backgroundColor: 'var(--overlay-golden-10)',
                border: '1px solid var(--overlay-golden-35)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Truck size={20} style={{ color: 'var(--brand-primary)' }} />
                <div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {order.trackingInfo.carrier} · Waybill #{order.trackingInfo.trackingId}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                    Estimated Arrival: {order.trackingInfo.estimatedDelivery || 'In Transit'}
                  </span>
                </div>
              </div>

              {order.trackingInfo.trackingUrl && (
                <a
                  href={order.trackingInfo.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    color: 'var(--brand-primary)',
                    fontWeight: 600,
                  }}
                >
                  Live Courier Tracking <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Garments Breakdown Card */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '20px' }}>
            Commissioned Silhouettes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            {order.items.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '75px',
                    height: '95px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <Image src={item.productImage || ''} alt={item.productName || 'Garment'} fill sizes="75px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 600 }}>{item.productName}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    SKU: {item.sku} · Size: {item.size} · Color: {item.color}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', maxWidth: '380px', marginLeft: 'auto' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}
          >
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

          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CreditCard size={18} style={{ color: 'var(--brand-primary)' }} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Payment Method</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Method: <strong>{order.payment.method}</strong>
              <br />
              Status: <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>Settled via Adyen</span>
              <br />
              Transaction ID: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{order.payment.transactionId}</span>
            </p>
          </div>
        </div>
      </div>

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
