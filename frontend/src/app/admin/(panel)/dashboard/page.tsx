'use client';

import React, { useEffect, useState } from 'react';
import {
  adminGetDashboardStats,
  getProducts,
  getOrders,
  triggerCsvDownload,
  adminExportReport,
} from '@/lib/mockApi';
import { DashboardStats, Product, Order } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { useToastStore } from '@/store/useToastStore';
import {
  Calendar,
  ChevronDown,
  Download,
  Users,
  ShoppingBag,
  MoreHorizontal,
  TrendingUp,
  Boxes,
  Sparkles,
  CreditCard,
  Smartphone,
  Landmark,
  Layers,
  Check,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [channelView, setChannelView] = useState<'payments' | 'sources'>('payments');
  const [loading, setLoading] = useState(true);
  
  // Date picker state
  const [preset, setPreset] = useState('Last 30 days');
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [dashStats, orderList, productList] = await Promise.all([
          adminGetDashboardStats(),
          getOrders(),
          getProducts(),
        ]);
        setStats(dashStats);
        setOrders(orderList);
        setProducts(productList);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Top Performing Items calculated from real client orders & catalog
  const topItems = React.useMemo(() => {
    const salesMap = new Map<string, { units: number; revenue: number }>();

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      o.items.forEach((item) => {
        const cur = salesMap.get(item.productId) || { units: 0, revenue: 0 };
        cur.units += item.quantity;
        cur.revenue += item.price * item.quantity;
        salesMap.set(item.productId, cur);
      });
    });

    const list: {
      id: string;
      displayId: string;
      name: string;
      subtitle?: string;
      units: number;
      revenue: number;
      rating: number;
      image?: string;
    }[] = [];

    salesMap.forEach((sales, prodId) => {
      const prod = products.find((p) => p.id === prodId);
      const fallbackItem = orders.flatMap((o) => o.items).find((i) => i.productId === prodId);
      list.push({
        id: prodId,
        displayId: `#${prodId.replace(/^prod_/, '').toUpperCase()}`,
        name: prod?.name || fallbackItem?.productName || 'Atelier Garment',
        subtitle: prod?.subtitle,
        units: sales.units,
        revenue: sales.revenue,
        rating: prod?.rating.average ?? 4.8,
        image: prod?.images?.[0] || fallbackItem?.productImage,
      });
    });

    list.sort((a, b) => b.revenue - a.revenue);

    // If fewer than 5 items have orders, backfill with featured catalog products
    if (list.length < 5 && products.length > 0) {
      const existingIds = new Set(list.map((i) => i.id));
      const backfills = products
        .filter((p) => !existingIds.has(p.id))
        .slice(0, 5 - list.length)
        .map((p) => ({
          id: p.id,
          displayId: `#${p.id.replace(/^prod_/, '').toUpperCase()}`,
          name: p.name,
          subtitle: p.subtitle,
          units: 1,
          revenue: p.price,
          rating: p.rating.average,
          image: p.images?.[0],
        }));
      return [...list, ...backfills];
    }

    return list.slice(0, 5);
  }, [orders, products]);

  // Dynamic Revenue Chart Timeline from Real Orders
  const chartData = React.useMemo(() => {
    const validOrders = [...orders]
      .filter((o) => o.status !== 'Cancelled')
      .sort((a, b) => {
        const tA = new Date(a.statusHistory[0]?.timestamp || a.id).getTime();
        const tB = new Date(b.statusHistory[0]?.timestamp || b.id).getTime();
        return tA - tB;
      });

    if (validOrders.length === 0) {
      return {
        points: [],
        linePath: 'M0,80 L400,80',
        areaPath: 'M0,80 L400,80 L400,100 L0,100 Z',
        maxVal: 50000,
      };
    }

    const maxVal = Math.max(...validOrders.map((o) => o.totals.total), 40000);
    const paddingX = 30;
    const usableWidth = 340;

    const points = validOrders.map((o, idx) => {
      const x = paddingX + (idx / Math.max(1, validOrders.length - 1)) * usableWidth;
      const y = 88 - (o.totals.total / maxVal) * 65;
      const dateObj = new Date(o.statusHistory[0]?.timestamp || Date.now());
      const label = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      return {
        x: Math.round(x),
        y: Math.round(y),
        amount: o.totals.total,
        label,
        id: o.id,
      };
    });

    const linePath = points.reduce((acc, p, i) => (i === 0 ? `M${p.x},${p.y}` : `${acc} L${p.x},${p.y}`), '');
    const areaPath = `${linePath} L${points[points.length - 1].x},100 L${points[0].x},100 Z`;

    return { points, linePath, areaPath, maxVal };
  }, [orders]);

  // Real Payment Settlement Distribution
  const settlementStats = React.useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== 'Cancelled');
    const totalRev = validOrders.reduce((sum, o) => sum + o.totals.total, 0) || 1;

    let upiRev = 0;
    let cardRev = 0;
    let netBankRev = 0;

    validOrders.forEach((o) => {
      const m = (o.payment?.method || '').toLowerCase();
      if (m.includes('upi')) upiRev += o.totals.total;
      else if (m.includes('card')) cardRev += o.totals.total;
      else netBankRev += o.totals.total;
    });

    return {
      upi: { amount: upiRev, pct: Math.round((upiRev / totalRev) * 100) },
      card: { amount: cardRev, pct: Math.round((cardRev / totalRev) * 100) },
      netBanking: { amount: netBankRev, pct: Math.round((netBankRev / totalRev) * 100) },
    };
  }, [orders]);

  // Peak Activity Day by Weekday from Real Orders
  const weeklyActivity = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayTotals = days.map((label, dayIdx) => {
      const matches = orders.filter((o) => {
        const d = new Date(o.statusHistory[0]?.timestamp || o.id).getDay();
        return d === dayIdx;
      });
      const rev = matches.reduce((acc, o) => acc + o.totals.total, 0);
      return {
        label,
        count: matches.length,
        revenue: rev,
      };
    });

    const maxRev = Math.max(...dayTotals.map((d) => d.revenue), 1);
    return dayTotals.map((d) => ({
      ...d,
      active: d.revenue === maxRev && d.revenue > 0,
      value: d.count > 0 ? `${formatPrice(d.revenue)}` : '',
      height: Math.max(26, Math.min(105, Math.round((d.revenue / maxRev) * 92))),
    }));
  }, [orders]);

  // Export State and Handlers
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const { showToast } = useToastStore();
  const exportMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = async (type: 'comprehensive' | 'orders' | 'inventory' = 'comprehensive') => {
    if (!stats) return;
    setIsExporting(true);
    setIsExportMenuOpen(false);

    try {
      let csvString = '';
      let filename = '';

      if (type === 'orders') {
        csvString = await adminExportReport('orders');
        filename = `aurelia_commissions_log_${dateRange.start}_to_${dateRange.end}`;
      } else if (type === 'inventory') {
        csvString = await adminExportReport('inventory');
        filename = `aurelia_inventory_reserves_${new Date().toISOString().split('T')[0]}`;
      } else {
        // Comprehensive Executive Performance Report for the active period
        const lines: string[] = [
          'AURELIA ATELIER - EXECUTIVE PERFORMANCE REPORT',
          `Generated On: ${new Date().toLocaleString()}`,
          `Reporting Period: ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()} (${preset})`,
          '',
          '--- EXECUTIVE KPIS ---',
          'Metric,Value',
          `Gross Revenue,"${formatPrice(stats.grossRevenue)}"`,
          `Total Commissions,${stats.totalOrders}`,
          `Active Private Clients,${stats.activeCustomers}`,
          `Average Commission Value,"${formatPrice(stats.averageOrderValue)}"`,
          `Low Stock Silhouettes,${stats.lowStockItemsCount}`,
          `Pending Returns,${stats.pendingReturnsCount}`,
          `Open Concierge Tickets,${stats.openTicketsCount}`,
          '',
          '--- TOP PERFORMING PIECES ---',
          'Piece ID,Silhouette Name,Subtitle,Units Sold,Revenue,Rating',
          ...topItems.map(
            (item) =>
              `${item.displayId},"${item.name.replace(/"/g, '""')}","${(item.subtitle || '').replace(/"/g, '""')}",${item.units},"${formatPrice(item.revenue)}",${item.rating}`
          ),
          '',
          '--- SETTLEMENT CHANNELS ---',
          'Payment Gateway,Total Settled,Share',
          `UPI / Instant VPA,"${formatPrice(settlementStats.upi.amount)}",${settlementStats.upi.pct}%`,
          `Credit & Debit Cards,"${formatPrice(settlementStats.card.amount)}",${settlementStats.card.pct}%`,
          `Net Banking,"${formatPrice(settlementStats.netBanking.amount)}",${settlementStats.netBanking.pct}%`,
          '',
          '--- CLIENT COMMISSIONS & ORDERS ---',
          'Order ID,Customer Name,Customer Email,Status,Date,Subtotal (INR),Discount,Tax,Total (INR),Payment Method,Tracking Carrier,Tracking ID',
          ...orders.map((o) =>
            [
              o.id,
              `"${(o.customerName || '').replace(/"/g, '""')}"`,
              `"${(o.customerEmail || '').replace(/"/g, '""')}"`,
              o.status,
              o.statusHistory[0]?.timestamp || '',
              o.totals.subtotal,
              o.totals.discount,
              o.totals.tax,
              o.totals.total,
              `"${o.payment.method}"`,
              `"${o.trackingInfo?.carrier || ''}"`,
              `"${o.trackingInfo?.trackingId || ''}"`,
            ].join(',')
          ),
        ];
        csvString = lines.join('\n');
        filename = `aurelia_executive_report_${dateRange.start}_to_${dateRange.end}`;
      }

      triggerCsvDownload(csvString, filename);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2500);
      showToast(
        type === 'orders'
          ? 'Commissions log exported to CSV.'
          : type === 'inventory'
          ? 'Silhouette inventory exported to CSV.'
          : 'Executive performance report exported to CSV.',
        'success'
      );
    } catch {
      showToast('Failed to export dataset.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ padding: 'var(--space-8)', color: 'var(--admin-text-primary)' }}>
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <span style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--brand-primary)',
          }}>
            Executive Dashboard
          </span>
          <h1 style={{
            fontSize: '2rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--admin-text-primary)',
            marginTop: 'var(--space-1)',
          }}>
            Performance Overview
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Date Picker */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setIsDatePickerOpen(!isDatePickerOpen);
                setIsPresetOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--admin-surface)',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--admin-border)',
                fontSize: '0.85rem',
                color: 'var(--admin-text-primary)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
              }}>
              <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
              <span>
                {new Date(dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} – {new Date(dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            {isDatePickerOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 'var(--space-1)',
                backgroundColor: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 10,
                padding: 'var(--space-3)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                minWidth: '220px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Start Date</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, start: e.target.value });
                      setPreset('Custom');
                    }}
                    style={{
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>End Date</label>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, end: e.target.value });
                      setPreset('Custom');
                    }}
                    style={{
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--admin-border)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preset Dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => {
                setIsPresetOpen(!isPresetOpen);
                setIsDatePickerOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--admin-surface)',
                padding: 'var(--space-2) var(--space-4)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--admin-border)',
                fontSize: '0.85rem',
                color: 'var(--admin-text-primary)',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
              }}>
              <span>{preset}</span>
              <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
            {isPresetOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--space-1)',
                backgroundColor: 'var(--admin-surface)',
                border: '1px solid var(--admin-border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 10,
                minWidth: '150px',
                overflow: 'hidden'
              }}>
                {['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'This Year', 'Custom'].map(p => (
                  <div 
                    key={p} 
                    onClick={() => {
                      setPreset(p);
                      setIsPresetOpen(false);
                      // Update dates based on preset if it's not custom
                      const today = new Date();
                      let start = new Date();
                      if (p === 'Today') {
                        start = today;
                      } else if (p === 'Last 7 days') {
                        start.setDate(today.getDate() - 7);
                      } else if (p === 'Last 30 days') {
                        start.setDate(today.getDate() - 30);
                      } else if (p === 'Last 90 days') {
                        start.setDate(today.getDate() - 90);
                      } else if (p === 'This Year') {
                        start = new Date(today.getFullYear(), 0, 1);
                      }
                      
                      if (p !== 'Custom') {
                        setDateRange({
                          start: start.toISOString().split('T')[0],
                          end: today.toISOString().split('T')[0]
                        });
                      }
                    }}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      fontSize: '0.85rem',
                      color: 'var(--admin-text-primary)',
                      cursor: 'pointer',
                      backgroundColor: p === preset ? 'var(--bg-subtle)' : 'transparent',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = p === preset ? 'var(--bg-subtle)' : 'transparent'}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Export Button with Dropdown options */}
          <div ref={exportMenuRef} style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                onClick={() => handleExport('comprehensive')}
                disabled={isExporting}
                title="Export comprehensive executive report for active period"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  backgroundColor: 'var(--admin-surface)',
                  padding: 'var(--space-2) var(--space-3) var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                  border: '1px solid var(--admin-border)',
                  borderRight: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--admin-text-primary)',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  letterSpacing: '0.02em',
                  transition: 'background-color var(--duration-fast) ease',
                  opacity: isExporting ? 0.75 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
                }}
              >
                {exportSuccess ? (
                  <Check size={16} style={{ color: 'var(--color-sapphire-700)' }} />
                ) : (
                  <Download size={16} style={{ color: 'var(--text-muted)' }} />
                )}
                <span>{isExporting ? 'Exporting...' : exportSuccess ? 'Exported' : 'Export'}</span>
              </button>

              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                disabled={isExporting}
                title="Export Options"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--admin-surface)',
                  padding: 'var(--space-2) 6px',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  border: '1px solid var(--admin-border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'background-color var(--duration-fast) ease',
                }}
                onMouseEnter={(e) => {
                  if (!isExporting) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--admin-surface)';
                }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {isExportMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 'var(--space-1)',
                  backgroundColor: 'var(--admin-surface)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--shadow-md)',
                  zIndex: 20,
                  minWidth: '240px',
                  overflow: 'hidden',
                  padding: '4px 0',
                }}
              >
                <div
                  onClick={() => handleExport('comprehensive')}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontWeight: 600 }}>Executive Overview (CSV)</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    KPIs, Top Pieces & Settlement ({preset})
                  </span>
                </div>

                <div
                  onClick={() => handleExport('orders')}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    borderTop: '1px solid var(--admin-border-light)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontWeight: 600 }}>Commissions & Orders Log</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Full transaction log with tracking IDs
                  </span>
                </div>

                <div
                  onClick={() => handleExport('inventory')}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    borderTop: '1px solid var(--admin-border-light)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontWeight: 600 }}>Silhouette Reserves & Stock</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Inventory SKUs and availability
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards – using glassmorphic design system cards */}
      <div style={{ position: 'relative' }}>
        {/* Ambient glow bloom behind cards */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20px',
            left: '3%',
            width: '380px',
            height: '180px',
            background: 'radial-gradient(ellipse at center, rgba(36, 75, 87, 0.12) 0%, var(--overlay-sapphire-10) 45%, transparent 70%)',
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
            background: 'radial-gradient(ellipse at center, rgba(36, 75, 87, 0.15) 0%, rgba(202, 212, 214, 0.3) 50%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 'var(--space-4)',
        }}>
          {/* Card 1: Total Users */}
          <div className="admin-glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Active Customers
              </span>
              <div className="admin-glass-pill">
                <Users size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-3)' }}>
                {stats.activeCustomers.toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-sapphire-700)', marginTop: 'var(--space-1)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={12} /> +12.5%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', display: 'block' }}>
                vs. last period
              </span>
            </div>
          </div>

          {/* Card 2: Active Sessions */}
          <div className="admin-glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Total Orders
              </span>
              <div className="admin-glass-pill">
                <ShoppingBag size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-3)' }}>
                {stats.totalOrders.toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-sapphire-700)', marginTop: 'var(--space-1)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={12} /> +8.2%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', display: 'block' }}>
                vs. last period
              </span>
            </div>
          </div>

          {/* Card 3: Bounce Rate */}
          <div className="admin-glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Average Order Value
              </span>
              <div className="admin-glass-pill">
                <TrendingUp size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-3)' }}>
                {formatPrice(stats.averageOrderValue)}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-sapphire-700)', marginTop: 'var(--space-1)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <TrendingUp size={12} /> +2.4%
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', display: 'block' }}>
                vs. last period
              </span>
            </div>
          </div>

          {/* Card 4: New Subscriptions */}
          <div className="admin-glass-card" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Pending Operations
              </span>
              <div className="admin-glass-pill">
                <Boxes size={18} />
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-3)' }}>
                {stats.pendingReturnsCount + stats.openTicketsCount}
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-sapphire-700)', marginTop: 'var(--space-1)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                Requires Attention
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)', display: 'block' }}>
                {stats.pendingReturnsCount} returns, {stats.openTicketsCount} tickets
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-4)' }}>
        {/* Left Column (8 cols) */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Revenue Chart Card */}
          <div className="admin-table-wrapper" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', margin: '0 0 var(--space-4) 0' }}>
              Overall Revenue
            </h2>

            <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-body)', color: 'var(--text-primary)', margin: 0 }}>
                  {formatPrice(stats.grossRevenue)}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--color-sapphire-700)',
                    backgroundColor: 'var(--overlay-sapphire-10)',
                    padding: '2px var(--space-2)',
                    borderRadius: 'var(--radius-pill)',
                  }}>
                    <TrendingUp size={14} /> 32.1%
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>vs. last period</span>
                </div>
              </div>

              {/* SVG Line Chart */}
              <div style={{ flex: 1, height: '140px', position: 'relative' }}>
                <svg viewBox="0 0 400 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-sapphire-700)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-sapphire-700)" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient fill under the dynamic curve */}
                  <path d={chartData.areaPath} fill="url(#chartGradient)" />

                  {/* Main line path */}
                  <path
                    d={chartData.linePath}
                    fill="none"
                    stroke="var(--color-sapphire-700)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Dynamic interactive points for each actual commission */}
                  {chartData.points.map((pt) => (
                    <circle
                      key={pt.id}
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="var(--color-sapphire-700)"
                      stroke="var(--admin-surface)"
                      strokeWidth="2"
                      style={{ cursor: 'pointer' }}
                    >
                      <title>{`${pt.label}: ${formatPrice(pt.amount)} (Commission #${pt.id})`}</title>
                    </circle>
                  ))}

                  {/* Grid lines */}
                  <line x1="0" y1="100" x2="400" y2="100" stroke="var(--border-color)" strokeWidth="1" />
                  <line x1="0" y1="20" x2="400" y2="20" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />

                  {/* Axis dates from real orders */}
                  {chartData.points.map((pt) => (
                    <text key={`lbl-${pt.id}`} x={pt.x} y="115" fontSize="10" textAnchor="middle" fill="var(--text-muted)">
                      {pt.label}
                    </text>
                  ))}

                  {/* Y-axis markers */}
                  <text x="-12" y="24" fontSize="10" textAnchor="end" fill="var(--text-muted)">
                    {formatPrice(chartData.maxVal).replace(/\D000$/, 'K')}
                  </text>
                  <text x="-12" y="64" fontSize="10" textAnchor="end" fill="var(--text-muted)">
                    {formatPrice(Math.round(chartData.maxVal / 2)).replace(/\D000$/, 'K')}
                  </text>
                </svg>
              </div>
            </div>

            {/* Revenue & Settlement Breakdown */}
            <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text-primary)', margin: 0 }}>
                    {channelView === 'payments' ? 'Settlement Channels' : 'Traffic Sources'}
                  </h3>
                  <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-pill)', padding: '2px' }}>
                    <button
                      onClick={() => setChannelView('payments')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        backgroundColor: channelView === 'payments' ? 'var(--admin-surface)' : 'transparent',
                        color: channelView === 'payments' ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                        boxShadow: channelView === 'payments' ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      Payment Methods
                    </button>
                    <button
                      onClick={() => setChannelView('sources')}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        backgroundColor: channelView === 'sources' ? 'var(--admin-surface)' : 'transparent',
                        color: channelView === 'sources' ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                        boxShadow: channelView === 'sources' ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      Traffic Sources
                    </button>
                  </div>
                </div>
                <MoreHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
              </div>

              {channelView === 'payments' ? (
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  {/* UPI */}
                  <div style={{ flex: 1, borderRight: '1px solid var(--admin-border-light)', paddingRight: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-sapphire-700)' }} />
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatPrice(settlementStats.upi.amount)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                      UPI / Instant VPA ({settlementStats.upi.pct}%)
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${settlementStats.upi.pct}%`, backgroundColor: 'var(--color-sapphire-700)' }} />
                    </div>
                  </div>

                  {/* Credit Cards */}
                  <div style={{ flex: 1, borderRight: '1px solid var(--admin-border-light)', paddingRight: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-sapphire-300)' }} />
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatPrice(settlementStats.card.amount)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                      Credit / Debit Cards ({settlementStats.card.pct}%)
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${settlementStats.card.pct}%`, backgroundColor: 'var(--color-sapphire-300)' }} />
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-icy-lake-300)' }} />
                      <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatPrice(settlementStats.netBanking.amount)}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                      Net Banking ({settlementStats.netBanking.pct}%)
                    </div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${settlementStats.netBanking.pct}%`, backgroundColor: 'var(--color-icy-lake-300)' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  {/* Organic */}
                  <div style={{ flex: 1, borderRight: '1px solid var(--admin-border-light)', paddingRight: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-sapphire-700)' }} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>45.2K</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Organic Search (53%)</div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '53%', backgroundColor: 'var(--color-sapphire-700)' }} />
                    </div>
                  </div>

                  {/* Direct */}
                  <div style={{ flex: 1, borderRight: '1px solid var(--admin-border-light)', paddingRight: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-sapphire-300)' }} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>22.4K</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Direct Atelier (26%)</div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '26%', backgroundColor: 'var(--color-sapphire-300)' }} />
                    </div>
                  </div>

                  {/* Social */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-icy-lake-300)' }} />
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>18.1K</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>Curated Social (21%)</div>
                    <div style={{ height: '4px', backgroundColor: 'var(--overlay-sapphire-10)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '21%', backgroundColor: 'var(--color-icy-lake-300)' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Performing Items Table */}
          <div className="admin-table-wrapper" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', margin: 0 }}>
                  Top Performing Items
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Highest revenue pieces from client commissions
                </span>
              </div>
              <MoreHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr className="admin-table-header">
                  <th style={{ padding: 'var(--space-3) var(--space-3) var(--space-3) 0' }}>ID</th>
                  <th style={{ padding: 'var(--space-3)' }}>Item Name</th>
                  <th style={{ padding: 'var(--space-3)' }}>Units Sold</th>
                  <th style={{ padding: 'var(--space-3)' }}>Revenue</th>
                  <th style={{ padding: 'var(--space-3)' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item) => (
                  <tr key={item.id} className="admin-table-row">
                    <td style={{ padding: 'var(--space-4) 0', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {item.displayId}
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--admin-border-light)'
                      }}>
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ShoppingBag size={16} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--admin-text-primary)' }}>
                          {item.name}
                        </span>
                        {item.subtitle && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.subtitle}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      {item.units} sold
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-sapphire-700)' }}>
                      {formatPrice(item.revenue)}
                    </td>
                    <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--admin-text-primary)' }}>
                      <span style={{ color: 'var(--color-sapphire-700)', marginRight: '4px' }}>★</span>
                      ({item.rating.toFixed(1)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Peak Engagement Day */}
          <div className="admin-glass-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', margin: 0 }}>
                  Peak Engagement Day
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Commission activity by weekday
                </span>
              </div>
              <MoreHorizontal size={16} style={{ color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '140px', paddingBottom: 'var(--space-2)' }}>
              {weeklyActivity.map((day) => (
                <div key={day.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', width: '36px' }}>
                  {day.active && (
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--admin-text-primary)', whiteSpace: 'nowrap' }}>
                      {day.value}
                    </span>
                  )}
                  <div
                    title={`${day.label}: ${day.count} commissions (${formatPrice(day.revenue)})`}
                    style={{
                      width: '24px',
                      height: `${day.height}px`,
                      backgroundColor: day.active ? 'var(--brand-primary)' : 'var(--admin-border-light)',
                      borderRadius: '4px',
                      transition: 'background-color var(--duration-fast) var(--ease-editorial), height var(--duration-normal)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{
                    fontSize: '0.75rem',
                    color: day.active ? 'var(--brand-primary)' : 'var(--text-muted)',
                    fontWeight: day.active ? 600 : 400,
                  }}>
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>



        </div>
      </div>
    </div>
  );
}
