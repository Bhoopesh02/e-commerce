'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrders, adminUpdateOrderStatus } from '@/lib/mockApi';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Truck, CheckCircle2, Search, Filter, ChevronDown, Check, ShoppingCart, RotateCcw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Orders...</div>;
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    if (!matchesStatus) return false;

    if (searchQuery.trim() === '') return true;

    const q = searchQuery.toLowerCase();
    const idMatch = o.id.toLowerCase().includes(q);
    const nameMatch = (o.customerName || 'Client').toLowerCase().includes(q);
    const cityMatch = (o.address?.city || '').toLowerCase().includes(q);
    const stateMatch = (o.address?.state || '').toLowerCase().includes(q);
    const statusMatch = o.status.toLowerCase().includes(q);
    const carrierMatch = (o.trackingInfo?.carrier || '').toLowerCase().includes(q);
    const trackingIdMatch = (o.trackingInfo?.trackingId || '').toLowerCase().includes(q);

    return idMatch || nameMatch || cityMatch || stateMatch || statusMatch || carrierMatch || trackingIdMatch;
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedOrders = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
          Fulfillment Desk
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Client Commissions & Dispatch
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            backgroundColor: 'rgba(194, 155, 76, 0.15)',
            color: 'var(--color-sapphire)',
            border: '1px solid rgba(194, 155, 76, 0.3)',
          }}
        >
          <ShoppingCart size={16} /> Commissions & Dispatch ({orders.length})
        </div>
        <Link
          href="/admin/returns"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--admin-text-secondary)',
            textDecoration: 'none',
          }}
        >
          <RotateCcw size={16} /> Returns & Authorizations
        </Link>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
        <div style={{ maxWidth: '400px', flex: 1 }}>
          <Input 
            placeholder="Search commissions..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        
        <div style={{ position: 'relative' }} ref={filterRef}>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ height: '40px' }}
            leftIcon={<Filter size={16} />}
            rightIcon={<ChevronDown size={16} style={{ opacity: 0.7 }} />}
          >
            {filterStatus === 'all' ? 'All Commissions' : filterStatus}
          </Button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ 
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
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '12px' }}>
                  <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button
                      onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '10px 12px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: 'none', 
                        backgroundColor: filterStatus === 'all' ? 'var(--admin-background)' : 'transparent', 
                        color: 'var(--admin-text-primary)', 
                        cursor: 'pointer', 
                        textAlign: 'left', 
                        fontSize: '0.85rem' 
                      }}
                    >
                      All Commissions
                      {filterStatus === 'all' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ minWidth: '800px' }}>
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
              {paginatedOrders.map((o) => (
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-sapphire)', fontFamily: 'var(--font-mono)' }}>
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
