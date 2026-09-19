'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminGetDashboardStats, getOrders, adminUpdateOrderStatus, getProducts } from '@/lib/mockApi';
import { DashboardStats, Order, OrderStatus, Product } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToastStore();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashStats, orders, prods] = await Promise.all([
          adminGetDashboardStats(),
          getOrders(),
          getProducts(),
        ]);
        setStats(dashStats);
        setRecentOrders(orders.slice(0, 5));
        setLowStockProducts(prods.filter((p) => p.availability === 'low_stock' || p.availability === 'out_of_stock'));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAdvanceStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      const updated = await adminUpdateOrderStatus(orderId, nextStatus);
      setRecentOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Commission #${orderId} status advanced to "${nextStatus}".`, 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#FFF' }}>Loading Atelier Executive Overview...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-400)' }}>
          Executive Dashboard
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: '#FFF8F5', marginTop: '4px' }}>
          Atelier Performance & Operations
        </h1>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#231F42', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(232, 188, 185, 0.15)', padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232, 188, 185, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Gross Commission Revenue
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-sunset-400)', marginTop: '8px' }}>
            {formatPrice(stats?.grossRevenue)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', display: 'block' }}>
            +18.4% vs last seasonal quarter
          </span>
        </div>

        <div style={{ backgroundColor: '#231F42', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(232, 188, 185, 0.15)', padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232, 188, 185, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Total Commissions
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFF8F5', marginTop: '8px' }}>
            {stats?.totalOrders}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'rgba(232, 188, 185, 0.6)', marginTop: '4px', display: 'block' }}>
            Dispatched across India
          </span>
        </div>

        <div style={{ backgroundColor: '#231F42', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(232, 188, 185, 0.15)', padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232, 188, 185, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Average Commission Value
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFF8F5', marginTop: '8px' }}>
            {formatPrice(stats?.averageOrderValue)}
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', display: 'block' }}>
            High-luxury basket density
          </span>
        </div>

        <div style={{ backgroundColor: '#231F42', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(232, 188, 185, 0.15)', padding: '24px' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(232, 188, 185, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Low Reserve Alerts
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '8px' }}>
            {stats?.lowStockItemsCount} Silhouettes
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '4px', display: 'block' }}>
            Immediate replenishment advised
          </span>
        </div>
      </div>

      {/* Recent Commissions Table */}
      <div
        style={{
          backgroundColor: '#231F42',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(232, 188, 185, 0.15)',
          padding: '28px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: '#FFF8F5' }}>
            Active Commissions & Fulfillment Operations
          </h3>
          <Link href="/admin/orders" style={{ fontSize: '0.82rem', color: 'var(--color-sunset-400)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            View All Commissions <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.2)', color: 'rgba(232, 188, 185, 0.7)' }}>
                <th style={{ padding: '12px 14px' }}>Commission</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Total</th>
                <th style={{ padding: '12px 14px' }}>Payment</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid rgba(232, 188, 185, 0.08)' }}>
                  <td style={{ padding: '14px', fontWeight: 600, color: '#FFF' }}>#{order.id}</td>
                  <td style={{ padding: '14px' }}>{order.customerName || 'Private Client'}</td>
                  <td style={{ padding: '14px', fontWeight: 600 }}>{formatPrice(order.totals.total)}</td>
                  <td style={{ padding: '14px' }}>{order.payment.method}</td>
                  <td style={{ padding: '14px' }}>
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'gold' : 'warning'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {order.status === 'Placed' && (
                      <Button variant="outline" size="sm" onClick={() => handleAdvanceStatus(order.id, 'Confirmed')}>
                        Confirm
                      </Button>
                    )}
                    {order.status === 'Confirmed' && (
                      <Button variant="outline" size="sm" onClick={() => handleAdvanceStatus(order.id, 'Packed')}>
                        Pack
                      </Button>
                    )}
                    {order.status === 'Packed' && (
                      <Button variant="primary" size="sm" onClick={() => handleAdvanceStatus(order.id, 'Shipped')}>
                        Dispatch / Ship
                      </Button>
                    )}
                    {order.status === 'Shipped' && (
                      <Button variant="primary" size="sm" onClick={() => handleAdvanceStatus(order.id, 'Delivered')}>
                        Mark Delivered
                      </Button>
                    )}
                    {order.status === 'Delivered' && (
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
    </div>
  );
}
