'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getReturns, getOrders, adminProcessReturn } from '@/lib/mockApi';
import { ReturnRequest, Order } from '@/types';
import { useToastStore } from '@/store/useToastStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Check,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
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

  const loadData = async () => {
    setLoading(true);
    try {
      const [returnsData, ordersData] = await Promise.all([
        getReturns(),
        getOrders(),
      ]);
      setReturns(returnsData);
      setOrders(ordersData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcess = async (
    returnId: string,
    status: 'Approved' | 'Rejected',
    refundStatus: 'completed' | 'failed'
  ) => {
    setProcessingId(returnId);
    try {
      const updated = await adminProcessReturn(returnId, status, refundStatus);
      setReturns((prev) => prev.map((r) => (r.id === returnId ? updated : r)));
      showToast(
        `Return #${returnId} marked as ${status} (Refund: ${refundStatus}).`,
        'success'
      );
    } catch {
      showToast('Failed to update return authorization.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReturns = returns.filter((ret) => {
    const matchesStatus = filterStatus === 'all' || ret.status === filterStatus;
    if (!matchesStatus) return false;

    if (searchQuery.trim() === '') return true;

    const q = searchQuery.toLowerCase();
    const idMatch = ret.id.toLowerCase().includes(q);
    const orderIdMatch = ret.orderId.toLowerCase().includes(q);
    const reasonMatch = ret.reason.toLowerCase().includes(q);
    const commentsMatch = (ret.comments || '').toLowerCase().includes(q);
    const order = orders.find((o) => o.id === ret.orderId);
    const clientMatch = (order?.customerName || '').toLowerCase().includes(q);

    return idMatch || orderIdMatch || reasonMatch || commentsMatch || clientMatch;
  });

  const pendingCount = returns.filter((r) => r.status === 'Requested').length;
  const approvedCount = returns.filter((r) => r.status === 'Approved').length;
  const rejectedCount = returns.filter((r) => r.status === 'Rejected').length;

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Return Authorizations...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
          Atelier Operations · Returns Management
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Returns & Authorizations Desk
        </h1>
        <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Confidential authorization desk displaying Return IDs and associated Commission IDs for concierge verification.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--admin-border)', paddingBottom: '12px' }}>
        <Link
          href="/admin/orders"
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
          <ShoppingCart size={16} /> Commissions & Dispatch
        </Link>
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
          <RotateCcw size={16} /> Returns & Authorizations ({returns.length})
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Total Return Requests
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-black-tie)', marginTop: '8px' }}>
            {returns.length}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Pending Authorization
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '8px' }}>
            {pendingCount}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Approved & Settled
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '8px' }}>
            {approvedCount}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: '#595F69', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Rejected
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-golden)', marginTop: '8px' }}>
            {rejectedCount}
          </h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: '450px', flex: 1 }}>
          <Input
            placeholder="Search by Return ID, Commission ID, client, or reason..."
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
            {filterStatus === 'all' ? 'All Returns' : filterStatus}
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
                  width: '220px',
                  zIndex: 50,
                  padding: '8px',
                  overflow: 'hidden'
                }}
              >
                {['all', 'Requested', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      backgroundColor: filterStatus === status ? 'var(--admin-background)' : 'transparent',
                      color: 'var(--admin-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                    }}
                  >
                    {status === 'all' ? 'All Returns' : status}
                    {filterStatus === status && <Check size={14} style={{ color: 'var(--color-sapphire)' }} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Returns Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ minWidth: '950px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr className="admin-table-header">
                <th style={{ padding: '12px 14px' }}>Return ID</th>
                <th style={{ padding: '12px 14px' }}>Commission ID</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Reason & Notes</th>
                <th style={{ padding: '12px 14px' }}>Refund Settlement</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px' }}>Operations Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReturns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: 'var(--admin-text-secondary)' }}>
                    No return authorization requests match your filter.
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => {
                  const order = orders.find((o) => o.id === ret.orderId);
                  const isProcessing = processingId === ret.id;

                  return (
                    <tr key={ret.id} className="admin-table-row">
                      {/* Prominent Return ID */}
                      <td style={{ padding: '14px', fontWeight: 600, color: 'var(--color-sapphire)', fontFamily: 'var(--font-mono)' }}>
                        #{ret.id}
                      </td>

                      {/* Prominent Commission ID */}
                      <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)', fontFamily: 'var(--font-mono)' }}>
                        <Link
                          href={`/admin/orders`}
                          style={{
                            color: 'inherit',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          title="View Commission in fulfillment table"
                        >
                          #{ret.orderId}
                          <ArrowUpRight size={12} style={{ opacity: 0.6 }} />
                        </Link>
                      </td>

                      {/* Client */}
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
                          {order?.customerName || ret.userId}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                          {order?.customerEmail || 'Registered Client'}
                        </span>
                      </td>

                      {/* Reason & Notes */}
                      <td style={{ padding: '14px', maxWidth: '280px' }}>
                        <span style={{ fontWeight: 500, color: 'var(--admin-text-primary)', display: 'block' }}>
                          {ret.reason}
                        </span>
                        {ret.comments && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)', display: 'block', marginTop: '2px', fontStyle: 'italic' }}>
                            "{ret.comments}"
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#8C92A0', display: 'block', marginTop: '4px' }}>
                          Requested: {new Date(ret.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>

                      {/* Refund Settlement */}
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            fontSize: '0.78rem',
                            textTransform: 'capitalize',
                            fontWeight: 600,
                            color: ret.refundStatus === 'completed' ? 'var(--color-success)' : ret.refundStatus === 'failed' ? 'var(--color-golden)' : 'var(--color-warning)',
                          }}
                        >
                          {ret.refundStatus}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--admin-text-secondary)', display: 'block' }}>
                          Adyen Reversal
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '14px' }}>
                        <Badge
                          variant={
                            ret.status === 'Approved'
                              ? 'success'
                              : ret.status === 'Rejected'
                              ? 'gold'
                              : 'warning'
                          }
                        >
                          {ret.status}
                        </Badge>
                      </td>

                      {/* Operations Action */}
                      <td style={{ padding: '14px' }}>
                        {ret.status === 'Requested' ? (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              variant="primary"
                              size="sm"
                              isLoading={isProcessing}
                              onClick={() => handleProcess(ret.id, 'Approved', 'completed')}
                              leftIcon={<CheckCircle2 size={13} />}
                              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              isLoading={isProcessing}
                              onClick={() => handleProcess(ret.id, 'Rejected', 'failed')}
                              leftIcon={<XCircle size={13} />}
                              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>
                            Resolved {ret.resolvedAt ? new Date(ret.resolvedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : ''}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
