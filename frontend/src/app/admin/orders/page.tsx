'use client';

import React, { useEffect, useState } from 'react';
import { getOrders, adminUpdateOrderStatus } from '@/lib/mockApi';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Truck, CheckCircle2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getOrders();
        setOrders(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = await adminUpdateOrderStatus(orderId, nextStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Commission #${orderId} status set to "${nextStatus}".`, 'success');
    } catch {
      showToast('Status update failed.', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Orders...</div>;
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-700)' }}>
          Fulfillment Desk
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Client Commissions & Dispatch
        </h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`admin-filter-pill ${filterStatus === st ? 'admin-filter-pill-active' : 'admin-filter-pill-inactive'}`}
          >
            {st === 'all' ? 'All Commissions' : st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr className="admin-table-header">
              <th style={{ padding: '12px 14px' }}>Commission</th>
              <th style={{ padding: '12px 14px' }}>Client</th>
              <th style={{ padding: '12px 14px' }}>Total Amount</th>
              <th style={{ padding: '12px 14px' }}>Carrier & Tracking</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
              <th style={{ padding: '12px 14px' }}>Operations Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="admin-table-row">
                <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>#{o.id}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
                    {o.customerName || 'Client'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                    {o.address.city}, {o.address.state}
                  </span>
                </td>
                <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                  {formatPrice(o.totals.total)}
                </td>
                <td style={{ padding: '14px' }}>
                  {o.trackingInfo ? (
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-primary)', display: 'block' }}>
                        {o.trackingInfo.carrier}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-sunset-800)', fontFamily: 'var(--font-mono)' }}>
                        {o.trackingInfo.trackingId}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: 'var(--admin-text-secondary)' }}>Pending</span>
                  )}
                </td>
                <td style={{ padding: '14px' }}>
                  <Badge variant={o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'gold' : 'warning'}>
                    {o.status}
                  </Badge>
                </td>
                <td style={{ padding: '14px' }}>
                  {o.status === 'Placed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ minWidth: '136px' }}
                      onClick={() => handleAdvanceStatus(o.id, 'Confirmed')}
                    >
                      Confirm
                    </Button>
                  )}
                  {o.status === 'Confirmed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      style={{ minWidth: '136px' }}
                      onClick={() => handleAdvanceStatus(o.id, 'Packed')}
                    >
                      Pack
                    </Button>
                  )}
                  {o.status === 'Packed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ minWidth: '136px' }}
                      onClick={() => handleAdvanceStatus(o.id, 'Shipped')}
                    >
                      Dispatch / Ship
                    </Button>
                  )}
                  {o.status === 'Shipped' && (
                    <Button
                      variant="primary"
                      size="sm"
                      style={{ minWidth: '136px' }}
                      onClick={() => handleAdvanceStatus(o.id, 'Delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                  {o.status === 'Delivered' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        height: '36px',
                        minWidth: '136px',
                        padding: '0 18px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--color-success)',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: 'var(--color-success-bg)',
                        border: '1px solid rgba(30, 111, 92, 0.25)',
                        boxSizing: 'border-box',
                      }}
                    >
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
