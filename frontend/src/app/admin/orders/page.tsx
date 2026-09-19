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

  const filtered = filterStatus === 'all' ? orders : orders.filter((o) => o.status === filterStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-400)' }}>
          Fulfillment Desk
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: '#FFF8F5', marginTop: '4px' }}>
          Client Commissions & Dispatch
        </h1>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: filterStatus === st ? 'var(--color-sunset-400)' : 'rgba(255, 255, 255, 0.08)',
              color: filterStatus === st ? 'var(--color-sunset-900)' : '#FFF',
              border: 'none',
            }}
          >
            {st === 'all' ? 'All Commissions' : st}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: '#231F42',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(232, 188, 185, 0.15)',
          padding: '24px',
          overflowX: 'auto',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.2)', color: 'rgba(232, 188, 185, 0.7)' }}>
              <th style={{ padding: '12px' }}>Commission</th>
              <th style={{ padding: '12px' }}>Client</th>
              <th style={{ padding: '12px' }}>Total Amount</th>
              <th style={{ padding: '12px' }}>Carrier & Tracking</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Operations Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.08)' }}>
                <td style={{ padding: '14px', fontWeight: 600, color: '#FFF' }}>#{o.id}</td>
                <td style={{ padding: '14px' }}>
                  <span style={{ fontWeight: 600, display: 'block' }}>{o.customerName || 'Client'}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(232, 188, 185, 0.6)' }}>{o.address.city}, {o.address.state}</span>
                </td>
                <td style={{ padding: '14px', fontWeight: 600 }}>{formatPrice(o.totals.total)}</td>
                <td style={{ padding: '14px' }}>
                  {o.trackingInfo ? (
                    <div>
                      <span style={{ fontSize: '0.82rem', display: 'block' }}>{o.trackingInfo.carrier}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-sunset-400)', fontFamily: 'var(--font-mono)' }}>
                        {o.trackingInfo.trackingId}
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: 'rgba(232, 188, 185, 0.5)' }}>Pending</span>
                  )}
                </td>
                <td style={{ padding: '14px' }}>
                  <Badge variant={o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'gold' : 'warning'}>
                    {o.status}
                  </Badge>
                </td>
                <td style={{ padding: '14px' }}>
                  {o.status === 'Placed' && (
                    <Button variant="outline" size="sm" onClick={() => handleAdvanceStatus(o.id, 'Confirmed')}>
                      Confirm
                    </Button>
                  )}
                  {o.status === 'Confirmed' && (
                    <Button variant="outline" size="sm" onClick={() => handleAdvanceStatus(o.id, 'Packed')}>
                      Pack
                    </Button>
                  )}
                  {o.status === 'Packed' && (
                    <Button variant="primary" size="sm" onClick={() => handleAdvanceStatus(o.id, 'Shipped')}>
                      Dispatch / Ship
                    </Button>
                  )}
                  {o.status === 'Shipped' && (
                    <Button variant="primary" size="sm" onClick={() => handleAdvanceStatus(o.id, 'Delivered')}>
                      Mark Delivered
                    </Button>
                  )}
                  {o.status === 'Delivered' && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Completed
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
