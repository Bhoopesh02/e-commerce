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
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
  X,
} from 'lucide-react';

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'this_month' | 'custom';

export default function AdminReturnsPage() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToastStore();
  const filterRef = React.useRef<HTMLDivElement>(null);
  const dateFilterRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (dateFilterRef.current && !dateFilterRef.current.contains(event.target as Node)) {
        setIsDateFilterOpen(false);
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

  const handleResetDateFilter = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDatePreset('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  const isDateFilterActive = datePreset !== 'all' || Boolean(customStartDate || customEndDate);

  const getDateFilterLabel = () => {
    if (datePreset === 'today') return 'Today';
    if (datePreset === '7d') return 'Last 7 Days';
    if (datePreset === '30d') return 'Last 30 Days';
    if (datePreset === 'this_month') return 'This Month';
    if (datePreset === 'custom' || customStartDate || customEndDate) {
      if (customStartDate && customEndDate) {
        return `${customStartDate} → ${customEndDate}`;
      } else if (customStartDate) {
        return `From ${customStartDate}`;
      } else if (customEndDate) {
        return `Until ${customEndDate}`;
      }
      return 'Custom Range';
    }
    return 'All Dates';
  };

  const matchesDate = (createdAtStr?: string) => {
    if (!isDateFilterActive) return true;
    if (!createdAtStr) return false;
    const itemTime = new Date(createdAtStr).getTime();
    if (isNaN(itemTime)) return false;
    const now = new Date();

    if (datePreset === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return itemTime >= startOfDay && itemTime <= endOfDay;
    } else if (datePreset === '7d') {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return itemTime >= sevenDaysAgo.getTime() && itemTime <= endOfDay;
    } else if (datePreset === '30d') {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
      return itemTime >= thirtyDaysAgo.getTime() && itemTime <= endOfDay;
    } else if (datePreset === 'this_month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
      return itemTime >= startOfMonth && itemTime <= endOfMonth;
    } else if (datePreset === 'custom' || customStartDate || customEndDate) {
      if (customStartDate) {
        const [y, m, d] = customStartDate.split('-').map(Number);
        const start = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
        if (itemTime < start) return false;
      }
      if (customEndDate) {
        const [y, m, d] = customEndDate.split('-').map(Number);
        const end = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
        if (itemTime > end) return false;
      }
      return true;
    }
    return true;
  };

  const dateFilteredReturns = returns.filter((r) => matchesDate(r.createdAt));

  const filteredReturns = dateFilteredReturns.filter((ret) => {
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

  const pendingCount = dateFilteredReturns.filter((r) => r.status === 'Requested').length;
  const approvedCount = dateFilteredReturns.filter((r) => r.status === 'Approved').length;
  const rejectedCount = dateFilteredReturns.filter((r) => r.status === 'Rejected').length;

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Return Authorizations...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
          Atelier Operations · Returns Management
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Returns & Authorizations Desk
        </h1>
        <p style={{ color: 'var(--admin-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Confidential authorization desk displaying Return IDs and associated Commission IDs for concierge verification.
        </p>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Total Return Requests {isDateFilterActive && <span style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'none' }}>({getDateFilterLabel()})</span>}
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: "var(--text-primary)", marginTop: '8px' }}>
            {dateFilteredReturns.length}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Pending Authorization
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-warning)', marginTop: '8px' }}>
            {pendingCount}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Approved & Settled
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '8px' }}>
            {approvedCount}
          </h3>
        </div>

        <div className="admin-glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
            Rejected
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-accent)', marginTop: '8px' }}>
            {rejectedCount}
          </h3>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '450px', flex: 1, minWidth: '240px' }}>
            <Input
              placeholder="Search by Return ID, Commission ID, client, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>

          {/* Status Filter Dropdown */}
          <div style={{ position: 'relative' }} ref={filterRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsDateFilterOpen(false);
              }}
              style={{ height: '40px' }}
              leftIcon={<Filter size={16} strokeWidth={1.8} />}
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
                    boxShadow: '0 4px 20px var(--overlay-black-15)',
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
                      {filterStatus === status && <Check size={14} style={{ color: 'var(--brand-primary)' }} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Filter Dropdown */}
          <div style={{ position: 'relative' }} ref={dateFilterRef}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsDateFilterOpen(!isDateFilterOpen);
                setIsFilterOpen(false);
              }}
              style={{ height: '40px' }}
              leftIcon={<Calendar size={16} strokeWidth={2.1} />}
              rightIcon={<ChevronDown size={16} style={{ opacity: 0.7 }} />}
            >
              {getDateFilterLabel()}
            </Button>

            <AnimatePresence>
              {isDateFilterOpen && (
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
                    boxShadow: '0 4px 20px var(--overlay-black-15)',
                    width: '300px',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)' }}>
                        Filter by Date
                      </span>
                      {isDateFilterActive && (
                        <button
                          onClick={handleResetDateFilter}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.75rem',
                            color: 'var(--admin-text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'underline'
                          }}
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Presets */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      {[
                        { id: 'all', label: 'All Dates' },
                        { id: 'today', label: 'Today' },
                        { id: '7d', label: 'Last 7 Days' },
                        { id: '30d', label: 'Last 30 Days' },
                        { id: 'this_month', label: 'This Month' },
                      ].map((preset) => {
                        const isSelected = datePreset === preset.id && !customStartDate && !customEndDate;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              setDatePreset(preset.id as DatePreset);
                              setCustomStartDate('');
                              setCustomEndDate('');
                              setIsDateFilterOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: 'none',
                              backgroundColor: isSelected ? 'var(--admin-background)' : 'transparent',
                              color: 'var(--admin-text-primary)',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '0.85rem'
                            }}
                          >
                            {preset.label}
                            {isSelected && <Check size={16} style={{ color: 'var(--brand-primary)' }} />}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--admin-border)', margin: '12px 0 10px 0' }} />

                    {/* Custom Range */}
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '8px' }}>
                        Custom Range
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', width: '38px' }}>From</span>
                          <input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => {
                              setCustomStartDate(e.target.value);
                              setDatePreset('custom');
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-background)',
                              color: 'var(--admin-text-primary)',
                              fontSize: '0.82rem',
                              outline: 'none',
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)', width: '38px' }}>To</span>
                          <input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => {
                              setCustomEndDate(e.target.value);
                              setDatePreset('custom');
                            }}
                            style={{
                              flex: 1,
                              padding: '6px 10px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--admin-border)',
                              backgroundColor: 'var(--admin-background)',
                              color: 'var(--admin-text-primary)',
                              fontSize: '0.82rem',
                              outline: 'none',
                              fontFamily: 'inherit'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(filterStatus !== 'all' || isDateFilterActive || searchQuery.trim() !== '') && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--admin-text-secondary)' }}>Active filters:</span>
            {filterStatus !== 'all' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)'
                }}
              >
                Status: {filterStatus}
                <X
                  size={12}
                  style={{ cursor: 'pointer', opacity: 0.7 }}
                  onClick={() => setFilterStatus('all')}
                />
              </span>
            )}
            {isDateFilterActive && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)'
                }}
              >
                Date: {getDateFilterLabel()}
                <X
                  size={12}
                  style={{ cursor: 'pointer', opacity: 0.7 }}
                  onClick={handleResetDateFilter}
                />
              </span>
            )}
            {searchQuery.trim() !== '' && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  color: 'var(--admin-text-primary)'
                }}
              >
                Query: "{searchQuery}"
                <X
                  size={12}
                  style={{ cursor: 'pointer', opacity: 0.7 }}
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}
            <button
              onClick={() => {
                setFilterStatus('all');
                handleResetDateFilter();
                setSearchQuery('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '0.75rem',
                color: 'var(--brand-primary)',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '0 4px'
              }}
            >
              Clear all
            </button>
          </div>
        )}
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
                  <td colSpan={7} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                        No return authorizations found
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', maxWidth: '360px' }}>
                        No return requests match your current search, status, or date filter criteria.
                      </span>
                      {(isDateFilterActive || filterStatus !== 'all' || searchQuery.trim() !== '') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFilterStatus('all');
                            handleResetDateFilter();
                            setSearchQuery('');
                          }}
                          style={{ marginTop: '8px' }}
                        >
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredReturns.map((ret) => {
                  const order = orders.find((o) => o.id === ret.orderId);
                  const isProcessing = processingId === ret.id;

                  return (
                    <tr key={ret.id} className="admin-table-row">
                      {/* Prominent Return ID */}
                      <td style={{ padding: '14px', fontWeight: 600, color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
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
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
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
                            color: ret.refundStatus === 'completed' ? 'var(--color-success)' : ret.refundStatus === 'failed' ? 'var(--brand-accent)' : 'var(--color-warning)',
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
