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
  Search,
  Filter,
  ChevronDown,
  Check,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const { showToast } = useToastStore();
  const filterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        setAllOrders(orders);
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
      setAllOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      showToast(`Commission #${orderId} status advanced to "${nextStatus}".`, 'success');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Executive Overview...</div>;
  }

  const filteredOrders = allOrders.filter(order => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(query) || 
      (order.customerName && order.customerName.toLowerCase().includes(query)) ||
      (order.address?.city && order.address.city.toLowerCase().includes(query)) ||
      (order.address?.state && order.address.state.toLowerCase().includes(query));
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const displayOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
          Executive Dashboard
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Atelier Performance & Operations
        </h1>
      </div>

      {/* KPI Cards Grid with Ambient Frosted Glass Glow */}
      <div style={{ position: 'relative' }}>
        {/* Soft atmospheric ambient blooms behind the frosted cards so the blur effect refracts visible light */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20px',
            left: '3%',
            width: '380px',
            height: '180px',
            background: 'radial-gradient(ellipse at center, rgba(224, 224, 224, 0.6) 0%, rgba(194, 155, 76, 0.35) 45%, transparent 70%)',
            filter: 'blur(36px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '-15px',
            right: '4%',
            width: '420px',
            height: '180px',
            background: 'radial-gradient(ellipse at center, rgba(174, 68, 90, 0.25) 0%, rgba(224, 224, 224, 0.45) 50%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <div
            className="admin-glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Gross Commission Revenue
              </span>
              <div className="admin-glass-pill">
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-black-tie)', marginTop: '12px' }}>
                {formatPrice(stats?.grossRevenue)}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                +18.4% vs last seasonal quarter
              </span>
            </div>
          </div>

          <div
            className="admin-glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Total Commissions
              </span>
              <div className="admin-glass-pill">
                <ShoppingBag size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-black-tie)', marginTop: '12px' }}>
                {stats?.totalOrders}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#595F69', marginTop: '4px', display: 'block' }}>
                Dispatched across India
              </span>
            </div>
          </div>

          <div
            className="admin-glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Average Commission Value
              </span>
              <div className="admin-glass-pill">
                <Users size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-black-tie)', marginTop: '12px' }}>
                {formatPrice(stats?.averageOrderValue)}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                High-luxury basket density
              </span>
            </div>
          </div>

          <div
            className="admin-glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Low Reserve Alerts
              </span>
              <div className="admin-glass-pill">
                <AlertTriangle size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--color-black-tie)', marginTop: '12px' }}>
                {stats?.lowStockItemsCount} Silhouettes
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-warning)', marginTop: '4px', display: 'block', fontWeight: 600 }}>
                Immediate replenishment advised
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Commissions Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)' }}>
            Active Commissions & Fulfillment Operations
          </h3>
          <Link
            href="/admin/orders"
            style={{
              fontSize: '0.82rem',
              color: 'var(--color-sapphire)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View All Commissions <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px', maxWidth: '400px' }}>
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#595F69' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search by order ID, client name, or place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 10px 10px 38px',
                border: '1px solid rgba(20, 20, 20, 0.1)',
                borderRadius: '8px',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>
          <div style={{ position: 'relative' }} ref={filterRef}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ height: '40px', display: 'flex', alignItems: 'center' }}
            >
              <Filter size={16} style={{ marginRight: '8px' }} />
              {filterStatus === 'All' ? 'All Statuses' : filterStatus}
              <ChevronDown size={16} style={{ marginLeft: '8px', opacity: 0.7 }} />
            </Button>
            
            {isFilterOpen && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                right: 0, 
                marginTop: '8px',
                backgroundColor: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                width: '240px',
                zIndex: 50,
                overflow: 'hidden',
                padding: '12px'
              }}>
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => { setFilterStatus('All'); setIsFilterOpen(false); }}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '10px 12px', 
                      borderRadius: 'var(--radius-sm)', 
                      border: 'none', 
                      backgroundColor: filterStatus === 'All' ? 'var(--admin-background)' : 'transparent', 
                      color: 'var(--admin-text-primary)', 
                      cursor: 'pointer', 
                      textAlign: 'left', 
                      fontSize: '0.85rem' 
                    }}
                  >
                    All Statuses
                    {filterStatus === 'All' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                  </button>
                  {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '10px 12px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: 'none', 
                        backgroundColor: filterStatus === status ? 'var(--admin-background)' : 'transparent', 
                        color: 'var(--admin-text-primary)', 
                        cursor: 'pointer', 
                        textAlign: 'left', 
                        fontSize: '0.85rem' 
                      }}
                    >
                      {status}
                      {filterStatus === status && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '800px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
              <tr className="admin-table-header">
                <th style={{ padding: '12px 14px' }}>Commission</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Total</th>
                <th style={{ padding: '12px 14px' }}>Payment</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((order) => (
                <tr key={order.id} className="admin-table-row">
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>#{order.id}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
                      {order.customerName || 'Private Client'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                      {order.address.city}, {order.address.state}
                    </span>
                  </td>
                  <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                    {formatPrice(order.totals.total)}
                  </td>
                  <td style={{ padding: '14px', color: 'var(--admin-text-secondary)' }}>{order.payment.method}</td>
                  <td style={{ padding: '14px' }}>
                    <Badge variant={order.status === 'Delivered' ? 'success' : order.status === 'Shipped' ? 'gold' : 'warning'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '14px' }}>
                    {order.status === 'Placed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ minWidth: '136px' }}
                        onClick={() => handleAdvanceStatus(order.id, 'Confirmed')}
                      >
                        Confirm
                      </Button>
                    )}
                    {order.status === 'Confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        style={{ minWidth: '136px' }}
                        onClick={() => handleAdvanceStatus(order.id, 'Packed')}
                      >
                        Pack
                      </Button>
                    )}
                    {order.status === 'Packed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ minWidth: '136px' }}
                        onClick={() => handleAdvanceStatus(order.id, 'Shipped')}
                      >
                        Dispatch / Ship
                      </Button>
                    )}
                    {order.status === 'Shipped' && (
                      <Button
                        variant="primary"
                        size="sm"
                        style={{ minWidth: '136px' }}
                        onClick={() => handleAdvanceStatus(order.id, 'Delivered')}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    {order.status === 'Delivered' && (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '20px', alignItems: 'center' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span style={{ fontSize: '0.88rem', color: 'var(--admin-text-primary)' }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
