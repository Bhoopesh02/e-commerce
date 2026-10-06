'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { getOrders } from '@/lib/mockApi';
import { Order } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { StatusTimeline } from '@/components/ui/StatusTimeline';
import { ArrowRight } from 'lucide-react';

export default function TrackOrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const data = await getOrders(user?.id || 'usr_001');
      // Only keep active orders
      const active = data.filter(o => !['Delivered', 'Cancelled'].includes(o.status));
      setOrders(active);
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  if (loading) {
    return <div className="account-section fade-in"><p>Loading...</p></div>;
  }

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">Track Your Orders</h1>
        <p className="page-subheading">Follow your current orders from confirmation to delivery.</p>
      </div>

      <div className="tracking-list">
        {orders.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">NO ACTIVE ORDERS</h3>
            <p className="empty-state-text">You don't have any orders currently in progress.</p>
            <Link href="/account/orders" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              View Order History &rarr;
            </Link>
          </div>
        ) : (
          <div className="list-container">
            {orders.map(order => {
              const firstItem = order.items[0];
              const additionalItems = order.items.length - 1;

              return (
                <div key={order.id} className="tracking-row">
                  <div className="tracking-header">
                    <div className="tracking-meta">
                      <span className="row-title">ORDER</span>
                      <span className="row-meta">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="tracking-status-text">
                      <span className="status-label">CURRENT STATUS</span>
                      <span className="status-value">{order.status}</span>
                    </div>
                  </div>

                  <div className="tracking-product">
                    <span className="product-title">{firstItem?.productName || 'Garment'}</span>
                    <span className="product-meta">
                      Size {firstItem?.size || 'Standard'} 
                      {additionalItems > 0 && ` · +${additionalItems} more item${additionalItems > 1 ? 's' : ''}`}
                    </span>
                    <span className="amount">{formatPrice(order.totals.total)}</span>
                  </div>

                  <div className="tracking-timeline-container">
                    <StatusTimeline currentStatus={order.status} statusHistory={order.statusHistory} />
                  </div>

                  <div className="tracking-footer">
                    {order.trackingInfo && (
                      <div className="tracking-info">
                        <span className="tracking-label">TRACKING</span>
                        <span className="tracking-id">Tracking ID: {order.trackingInfo.trackingId}</span>
                      </div>
                    )}
                    
                    <Link href={`/account/orders/${order.id}`} className="text-action" style={{ marginLeft: 'auto' }}>
                      View Order Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .list-container {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .tracking-row {
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(20, 20, 20, 0.1);
        }

        .tracking-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .tracking-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tracking-status-text {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .row-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }

        .row-meta {
          font-size: 0.9rem;
          color: rgba(20, 20, 20, 0.6);
        }

        .status-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(20, 20, 20, 0.5);
        }

        .status-value {
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          color: var(--color-black-tie);
        }

        .tracking-product {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 32px;
        }

        .product-title {
          font-size: 1.1rem;
          color: var(--color-black-tie);
        }

        .product-meta {
          font-size: 0.9rem;
          color: rgba(20, 20, 20, 0.6);
        }

        .amount {
          font-size: 1.05rem;
          margin-top: 4px;
        }

        .tracking-timeline-container {
          margin-bottom: 32px;
          padding: 32px;
          background-color: rgba(20, 20, 20, 0.02);
          border-radius: 4px;
        }

        .tracking-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .tracking-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tracking-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(20, 20, 20, 0.5);
        }

        .tracking-id {
          font-size: 0.9rem;
          color: var(--color-black-tie);
          font-family: var(--font-mono);
        }

        .text-action {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--color-black-tie);
          text-decoration: none;
          transition: opacity 0.2s ease;
          opacity: 0.8;
          cursor: pointer;
        }

        .text-action:hover {
          opacity: 1;
        }

        .text-action svg {
          transition: transform 0.2s ease;
        }

        .text-action:hover svg {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
