'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrders, adminUpdateOrderStatus } from '@/lib/mockApi';
import { Order, OrderStatus } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Truck,
  CheckCircle2,
  Search,
  Filter,
  ChevronDown,
  Check,
  Calendar,
  X,
  Eye,
} from 'lucide-react';
import { useDropdownPosition } from '@/hooks/useDropdownPosition';
import { AdminOrderDetailsModal } from '@/components/admin/AdminOrderDetailsModal';

type DatePreset = 'all' | 'today' | '7d' | '30d' | 'this_month' | 'custom';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { showToast } = useToastStore();
  const filterRef = React.useRef<HTMLDivElement>(null);
  const dateFilterRef = React.useRef<HTMLDivElement>(null);

  const filterDropdownStyle = useDropdownPosition(filterRef, isFilterOpen, 230);
  const dateDropdownStyle = useDropdownPosition(dateFilterRef, isDateFilterOpen, 230);

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
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
      showToast(`Commission #${orderId} status set to "${nextStatus}".`, 'success');
    } catch {
      showToast('Status update failed.', 'error');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery, datePreset, customStartDate, customEndDate]);

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

  if (loading) {
    return <div style={{ padding: '40px', color: 'var(--admin-text-primary)' }}>Loading Atelier Orders...</div>;
  }

  const filtered = orders.filter((o) => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    if (!matchesStatus) return false;

    // Date filtering
    if (isDateFilterActive) {
      const orderDateStr = o.createdAt || (o.statusHistory && o.statusHistory[0]?.timestamp);
      if (!orderDateStr) return false;
      const orderTime = new Date(orderDateStr).getTime();
      const now = new Date();

      if (datePreset === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
        if (orderTime < startOfDay || orderTime > endOfDay) return false;
      } else if (datePreset === '7d') {
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        if (orderTime < sevenDaysAgo.getTime() || orderTime > now.getTime()) return false;
      } else if (datePreset === '30d') {
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        if (orderTime < thirtyDaysAgo.getTime() || orderTime > now.getTime()) return false;
      } else if (datePreset === 'this_month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        if (orderTime < startOfMonth || orderTime > endOfMonth) return false;
      } else if (datePreset === 'custom' || customStartDate || customEndDate) {
        if (customStartDate) {
          const [y, m, d] = customStartDate.split('-').map(Number);
          const start = new Date(y, m - 1, d, 0, 0, 0, 0).getTime();
          if (orderTime < start) return false;
        }
        if (customEndDate) {
          const [y, m, d] = customEndDate.split('-').map(Number);
          const end = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
          if (orderTime > end) return false;
        }
      }
    }

    if (searchQuery.trim() === '') return true;

    const q = searchQuery.toLowerCase();
    const idMatch = o.id.toLowerCase().includes(q);
    const nameMatch = (o.customerName || 'Client').toLowerCase().includes(q);
    const emailMatch = (o.customerEmail || '').toLowerCase().includes(q);
    const cityMatch = (o.address?.city || '').toLowerCase().includes(q);
    const stateMatch = (o.address?.state || '').toLowerCase().includes(q);
    const statusMatch = o.status.toLowerCase().includes(q);
    const carrierMatch = (o.trackingInfo?.carrier || '').toLowerCase().includes(q);
    const trackingIdMatch = (o.trackingInfo?.trackingId || '').toLowerCase().includes(q);
    const paymentMatch =
      (o.payment?.method || '').toLowerCase().includes(q) ||
      (o.paymentMethod || '').toLowerCase().includes(q) ||
      (o.payment?.transactionId || '').toLowerCase().includes(q) ||
      (o.payment?.upiVpa || '').toLowerCase().includes(q);
    const itemsMatch = o.items?.some(
      (item) =>
        item.productName?.toLowerCase().includes(q) ||
        item.sku?.toLowerCase().includes(q) ||
        item.size?.toLowerCase().includes(q) ||
        item.color?.toLowerCase().includes(q)
    );

    return (
      idMatch ||
      nameMatch ||
      emailMatch ||
      cityMatch ||
      stateMatch ||
      statusMatch ||
      carrierMatch ||
      trackingIdMatch ||
      paymentMatch ||
      itemsMatch
    );
  });
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedOrders = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
          Fulfillment Desk
        </span>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', marginTop: '4px' }}>
          Client Commissions & Dispatch
        </h1>
      </div>

      {/* Filters and Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ maxWidth: '400px', flex: 1, minWidth: '240px' }}>
            <Input 
              placeholder="Search commissions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          
          {/* Status Filter Dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }} ref={filterRef}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
                setIsDateFilterOpen(false);
              }}
              style={{
                height: '40px',
                width: '160px',
                minWidth: '160px',
                maxWidth: '160px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
              leftIcon={<Filter size={16} strokeWidth={1.8} style={{ flexShrink: 0 }} />}
              rightIcon={<ChevronDown size={16} style={{ opacity: 0.7, flexShrink: 0 }} />}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                {filterStatus === 'all' ? 'All Commissions' : filterStatus}
              </span>
            </Button>
            
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    ...filterDropdownStyle,
                    width: '230px',
                    minWidth: '230px',
                    maxWidth: '230px',
                    boxSizing: 'border-box',
                    marginTop: '8px',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 20px var(--overlay-black-15)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '10px' }}>
                    <div 
                      className="admin-dropdown-scroll-container" 
                      style={{ maxHeight: '190px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '3px' }}
                    >
                      <button
                        onClick={() => { setFilterStatus('all'); setIsFilterOpen(false); }}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          padding: '7px 10px', 
                          borderRadius: 'var(--radius-sm)', 
                          border: 'none', 
                          backgroundColor: filterStatus === 'all' ? 'var(--admin-background)' : 'transparent', 
                          color: 'var(--admin-text-primary)', 
                          cursor: 'pointer', 
                          textAlign: 'left', 
                          fontSize: '0.82rem' 
                        }}
                      >
                        All Commissions
                        {filterStatus === 'all' && <Check size={14} style={{ color: 'var(--brand-primary)' }} />}
                      </button>
                      {['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '7px 10px', 
                            borderRadius: 'var(--radius-sm)', 
                            border: 'none', 
                            backgroundColor: filterStatus === status ? 'var(--admin-background)' : 'transparent', 
                            color: 'var(--admin-text-primary)', 
                            cursor: 'pointer', 
                            textAlign: 'left', 
                            fontSize: '0.82rem' 
                          }}
                        >
                          {status}
                          {filterStatus === status && <Check size={14} style={{ color: 'var(--brand-primary)' }} />}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Date Filter Dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }} ref={dateFilterRef}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setIsDateFilterOpen(!isDateFilterOpen);
                setIsFilterOpen(false);
              }}
              style={{
                height: '40px',
                width: '160px',
                minWidth: '160px',
                maxWidth: '160px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
              leftIcon={<Calendar size={16} strokeWidth={2.1} style={{ flexShrink: 0 }} />}
              rightIcon={<ChevronDown size={16} style={{ opacity: 0.7, flexShrink: 0 }} />}
              title={getDateFilterLabel()}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                {getDateFilterLabel()}
              </span>
            </Button>
            
            <AnimatePresence>
              {isDateFilterOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    ...dateDropdownStyle,
                    width: '230px',
                    minWidth: '230px',
                    maxWidth: '230px',
                    boxSizing: 'border-box',
                    marginTop: '8px',
                    backgroundColor: 'var(--admin-surface)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 20px var(--overlay-black-15)',
                    zIndex: 50,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', padding: '0 2px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--brand-primary)' }}>
                        Filter by Date
                      </span>
                      {isDateFilterActive && (
                        <button
                          onClick={handleResetDateFilter}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '0.72rem',
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

                    <div 
                      className="admin-dropdown-scroll-container" 
                      style={{ 
                        maxHeight: '190px', 
                        overflowY: 'auto', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '3px' 
                      }}
                    >
                      {/* Presets */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
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
                                padding: '7px 10px', 
                                borderRadius: 'var(--radius-sm)', 
                                border: 'none', 
                                backgroundColor: isSelected ? 'var(--admin-background)' : 'transparent', 
                                color: 'var(--admin-text-primary)', 
                                cursor: 'pointer', 
                                textAlign: 'left', 
                                fontSize: '0.82rem' 
                              }}
                            >
                              {preset.label}
                              {isSelected && <Check size={14} style={{ color: 'var(--brand-primary)' }} />}
                            </button>
                          );
                        })}
                      </div>

                      <div style={{ height: '1px', backgroundColor: 'var(--admin-border)', margin: '6px 0 4px 0' }} />

                      {/* Custom Range */}
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '5px' }}>
                          Custom Range
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)', width: '34px' }}>From</span>
                            <input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => {
                                setCustomStartDate(e.target.value);
                                setDatePreset('custom');
                              }}
                              style={{
                                flex: 1,
                                padding: '4px 6px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--admin-border)',
                                backgroundColor: 'var(--admin-background)',
                                color: 'var(--admin-text-primary)',
                                fontSize: '0.76rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--admin-text-secondary)', width: '34px' }}>To</span>
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => {
                                setCustomEndDate(e.target.value);
                                setDatePreset('custom');
                              }}
                              style={{
                                flex: 1,
                                padding: '4px 6px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--admin-border)',
                                backgroundColor: 'var(--admin-background)',
                                color: 'var(--admin-text-primary)',
                                fontSize: '0.76rem',
                                outline: 'none',
                                fontFamily: 'inherit'
                              }}
                            />
                          </div>
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

      {/* Orders Table */}
      <div className="admin-table-wrapper" style={{ padding: '24px', overflowX: 'auto' }}>
        <div style={{ minWidth: '920px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr className="admin-table-header">
                <th style={{ padding: '12px 14px' }}>Commission</th>
                <th style={{ padding: '12px 14px' }}>Client</th>
                <th style={{ padding: '12px 14px' }}>Total Amount</th>
                <th style={{ padding: '12px 14px' }}>Carrier & Tracking</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', minWidth: '250px' }}>Operations Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                        No commissions found
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', maxWidth: '360px' }}>
                        No commissions match your current search, status, or date filter criteria.
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
              ) :
                paginatedOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="admin-table-row"
                    onClick={() => {
                      setSelectedOrder(o);
                      setIsDetailsModalOpen(true);
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Click row to inspect full order dossier"
                  >
                    {/* Commission ID and Date */}
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>#{o.id}</span>
                      </div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 400, color: 'var(--admin-text-secondary)', marginTop: '2px' }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </div>
                    </td>

                    {/* Client */}
                    <td style={{ padding: '14px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--admin-text-primary)', display: 'block' }}>
                        {o.customerName || 'Client'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-secondary)' }}>
                        {o.address.city}, {o.address.state}
                      </span>
                    </td>

                    {/* Total Amount */}
                    <td style={{ padding: '14px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                      {formatPrice(o.totals.total)}
                    </td>

                    {/* Carrier & Tracking */}
                    <td style={{ padding: '14px' }}>
                      {o.trackingInfo ? (
                        <div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--admin-text-primary)', display: 'block' }}>
                            {o.trackingInfo.carrier}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--brand-primary)', fontFamily: 'var(--font-mono)' }}>
                            {o.trackingInfo.trackingId}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--admin-text-secondary)' }}>Pending</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <Badge variant={o.status === 'Delivered' ? 'success' : o.status === 'Shipped' ? 'gold' : 'warning'}>
                        {o.status}
                      </Badge>
                    </td>

                    {/* Operations Action */}
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Details Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          style={{ height: '36px', padding: '0 12px' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(o);
                            setIsDetailsModalOpen(true);
                          }}
                          leftIcon={<Eye size={14} />}
                          title="Inspect Order Details & Dossier"
                        >
                          Details
                        </Button>

                        {/* State Transition Button */}
                        {o.status === 'Placed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ minWidth: '136px', height: '36px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(o.id, 'Confirmed');
                            }}
                          >
                            Confirm
                          </Button>
                        )}
                        {o.status === 'Confirmed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            style={{ minWidth: '136px', height: '36px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(o.id, 'Packed');
                            }}
                          >
                            Pack
                          </Button>
                        )}
                        {o.status === 'Packed' && (
                          <Button
                            variant="primary"
                            size="sm"
                            style={{ minWidth: '136px', height: '36px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(o.id, 'Shipped');
                            }}
                          >
                            Dispatch / Ship
                          </Button>
                        )}
                        {o.status === 'Shipped' && (
                          <Button
                            variant="primary"
                            size="sm"
                            style={{ minWidth: '136px', height: '36px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAdvanceStatus(o.id, 'Delivered');
                            }}
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
                              padding: '0 14px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              color: 'var(--color-success)',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: 'var(--color-success-bg)',
                              border: '1px solid var(--color-success-bg)',
                              boxSizing: 'border-box',
                            }}
                          >
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                      </div>
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

      {/* Comprehensive Order Details Dossier Modal */}
      <AdminOrderDetailsModal
        order={selectedOrder}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        onAdvanceStatus={handleAdvanceStatus}
      />
    </div>
  );
}
