'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  ChevronUp,
  Download,
  Users,
  ShoppingBag,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ExternalLink,
  Printer,
  Boxes,
  Sparkles,
  CreditCard,
  Smartphone,
  Landmark,
  Layers,
  Check,
  Filter,
  X,
  Table as TableIcon,
  SlidersHorizontal,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [channelView, setChannelView] = useState<'payments' | 'sources'>('payments');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Remember last-used tab per admin in localStorage
  useEffect(() => {
    try {
      const savedTab = window.localStorage.getItem('aurelia_admin_channel_tab');
      if (savedTab === 'payments' || savedTab === 'sources') {
        setChannelView(savedTab);
      }
    } catch {}
  }, []);

  const handleChannelTabChange = (tab: 'payments' | 'sources') => {
    setChannelView(tab);
    try {
      window.localStorage.setItem('aurelia_admin_channel_tab', tab);
    } catch {}
  };

  // Overall Revenue card state
  const [revenueMetric, setRevenueMetric] = useState<'revenue' | 'orders' | 'aov'>('revenue');
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [isUserGranularity, setIsUserGranularity] = useState(false);
  const [showCompareLine, setShowCompareLine] = useState(true);
  const [activeChannelFilter, setActiveChannelFilter] = useState<{
    type: 'payments' | 'sources';
    key: string;
    label: string;
  } | null>(null);
  const [isChannelTableView, setIsChannelTableView] = useState(false);
  const [isRevenueMenuOpen, setIsRevenueMenuOpen] = useState(false);
  const revenueMenuRef = React.useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    id: string;
    label: string;
    fullDate: string;
    revenue: number;
    orders: number;
    aov: number;
    prevVal?: number;
    x: number;
    y: number;
    isCompare?: boolean;
  } | null>(null);
  const [hoveredChannelKey, setHoveredChannelKey] = useState<string | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (revenueMenuRef.current && !revenueMenuRef.current.contains(e.target as Node)) {
        setIsRevenueMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Top Performing Items Table state
  const [sortField, setSortField] = useState<'revenue' | 'units' | 'rating' | 'name'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [topLimit, setTopLimit] = useState<number>(5);
  const [isTableMenuOpen, setIsTableMenuOpen] = useState(false);
  const tableMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
        setIsTableMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Date picker state with presets: Today, 7D, 30D, 90D, This Year, Custom
  const [preset, setPreset] = useState('30D');
  const [isPresetOpen, setIsPresetOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Auto-select granularity based on range duration if not manually overridden
  useEffect(() => {
    if (!isUserGranularity) {
      const s = new Date(dateRange.start).getTime();
      const e = new Date(dateRange.end).getTime();
      const diffDays = Math.max(1, Math.round((e - s) / 86400000));
      if (diffDays <= 14) {
        setGranularity('daily');
      } else if (diffDays <= 90) {
        setGranularity('weekly');
      } else {
        setGranularity('monthly');
      }
    }
  }, [dateRange, isUserGranularity]);

  // Peak Sales Day state
  const [salesDayMetric, setSalesDayMetric] = useState<'revenue' | 'orders'>('revenue');
  const [selectedWeekday, setSelectedWeekday] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const WEEKDAY_FULL_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  // Top Performing Items calculated from real client orders, catalog, stock, and period trends
  const { topItems, maxItemRevenue } = React.useMemo(() => {
    // Current period bounds
    const startMs = dateRange.start ? new Date(dateRange.start + 'T00:00:00').getTime() : 0;
    const endMs = dateRange.end ? new Date(dateRange.end + 'T23:59:59').getTime() : Date.now();
    const durationMs = Math.max(endMs - startMs, 86400000);
    const prevStartMs = startMs - durationMs;
    const prevEndMs = startMs;

    // Track current and previous period sales
    const currentSalesMap = new Map<string, { units: number; revenue: number }>();
    const prevSalesMap = new Map<string, { units: number; revenue: number }>();

    orders.forEach((o) => {
      if (o.status === 'Cancelled') return;
      const orderTime = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getTime();
      const orderDay = new Date(orderTime).getDay();

      // Check weekday filter if active
      if (selectedWeekday !== null && orderDay !== selectedWeekday) return;

      const inCurrent = orderTime >= startMs && orderTime <= endMs;
      const inPrev = orderTime >= prevStartMs && orderTime < prevEndMs;

      if (inCurrent) {
        o.items.forEach((item) => {
          const cur = currentSalesMap.get(item.productId) || { units: 0, revenue: 0 };
          cur.units += item.quantity;
          cur.revenue += item.price * item.quantity;
          currentSalesMap.set(item.productId, cur);
        });
      } else if (inPrev) {
        o.items.forEach((item) => {
          const cur = prevSalesMap.get(item.productId) || { units: 0, revenue: 0 };
          cur.units += item.quantity;
          cur.revenue += item.price * item.quantity;
          prevSalesMap.set(item.productId, cur);
        });
      }
    });

    const list: {
      id: string;
      displayId: string;
      name: string;
      subtitle?: string;
      units: number;
      revenue: number;
      rating: number;
      ratingCount: number;
      image?: string;
      trendPct: number;
      stockBadge: { label: string; type: 'low' | 'out' | 'normal'; count: number } | null;
    }[] = [];

    currentSalesMap.forEach((sales, prodId) => {
      const prod = products.find((p) => p.id === prodId);
      const fallbackItem = orders.flatMap((o) => o.items).find((i) => i.productId === prodId);
      const prevSales = prevSalesMap.get(prodId) || { units: 0, revenue: 0 };

      // Trend vs previous period
      let trendPct = 0;
      if (prevSales.revenue > 0) {
        trendPct = Math.round(((sales.revenue - prevSales.revenue) / prevSales.revenue) * 100);
      } else if (sales.revenue > 0) {
        trendPct = 100;
      }

      // Stock status
      const totalStock = prod?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
      let stockBadge: { label: string; type: 'low' | 'out' | 'normal'; count: number } | null = null;
      if (prod?.availability === 'out_of_stock' || totalStock === 0) {
        stockBadge = { label: 'Out of stock', type: 'out', count: 0 };
      } else if (prod?.availability === 'low_stock' || totalStock <= 5) {
        stockBadge = { label: `Low stock (${totalStock})`, type: 'low', count: totalStock };
      }

      list.push({
        id: prodId,
        displayId: `#${prodId.replace(/^prod_/, '').toUpperCase()}`,
        name: prod?.name || fallbackItem?.productName || 'Atelier Garment',
        subtitle: prod?.subtitle,
        units: sales.units,
        revenue: sales.revenue,
        rating: prod?.rating?.average ?? 4.8,
        ratingCount: prod?.rating?.count ?? 14,
        image: prod?.images?.[0] || fallbackItem?.productImage,
        trendPct,
        stockBadge,
      });
    });

    // If fewer than topLimit items have orders in this period and no weekday filter is active,
    // backfill with featured catalog products so the dashboard provides rich overview
    if (selectedWeekday === null && list.length < topLimit && products.length > 0) {
      const existingIds = new Set(list.map((i) => i.id));
      const backfills = products
        .filter((p) => !existingIds.has(p.id))
        .slice(0, Math.max(0, topLimit - list.length))
        .map((p) => {
          const totalStock = p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;
          let stockBadge: { label: string; type: 'low' | 'out' | 'normal'; count: number } | null = null;
          if (p.availability === 'out_of_stock' || totalStock === 0) {
            stockBadge = { label: 'Out of stock', type: 'out', count: 0 };
          } else if (p.availability === 'low_stock' || totalStock <= 5) {
            stockBadge = { label: `Low stock (${totalStock})`, type: 'low', count: totalStock };
          }

          return {
            id: p.id,
            displayId: `#${p.id.replace(/^prod_/, '').toUpperCase()}`,
            name: p.name,
            subtitle: p.subtitle,
            units: 1,
            revenue: p.price,
            rating: p.rating?.average ?? 4.8,
            ratingCount: p.rating?.count ?? 12,
            image: p.images?.[0],
            trendPct: 8,
            stockBadge,
          };
        });
      list.push(...backfills);
    }

    // Sort items
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'revenue') {
        cmp = a.revenue - b.revenue;
      } else if (sortField === 'units') {
        cmp = a.units - b.units;
      } else if (sortField === 'rating') {
        cmp = a.rating - b.rating;
      } else if (sortField === 'name') {
        cmp = a.name.localeCompare(b.name);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    const sliced = list.slice(0, topLimit);
    const maxRev = Math.max(...sliced.map((item) => item.revenue), 1);

    return {
      topItems: sliced.map((item) => ({
        ...item,
        sharePct: Math.round((item.revenue / maxRev) * 100),
      })),
      maxItemRevenue: maxRev,
    };
  }, [orders, products, dateRange, selectedWeekday, sortField, sortDirection, topLimit]);

  // Rule: Count only paid/confirmed orders, exclude cancelled and refunded orders
  const isPaidConfirmedOrder = (o: Order) =>
    o.status !== 'Cancelled' &&
    (o.status as string) !== 'Refunded' &&
    (o.payment?.status as string) !== 'refunded';

  // Period date bounds (current period and equal-length previous period)
  const { startMs, endMs, prevStartMs, prevEndMs, durationMs } = React.useMemo(() => {
    const s = dateRange.start ? new Date(dateRange.start + 'T00:00:00').getTime() : 0;
    const e = dateRange.end ? new Date(dateRange.end + 'T23:59:59').getTime() : Date.now();
    const dur = Math.max(e - s, 86400000);
    return {
      startMs: s,
      endMs: e,
      durationMs: dur,
      prevStartMs: s - dur,
      prevEndMs: s,
    };
  }, [dateRange]);

  // Orders filtered by date range and counted statuses
  const baseCurrentOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (!isPaidConfirmedOrder(o)) return false;
      const t = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getTime();
      return t >= startMs && t <= endMs;
    });
  }, [orders, startMs, endMs]);

  const basePrevOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (!isPaidConfirmedOrder(o)) return false;
      const t = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getTime();
      return t >= prevStartMs && t < prevEndMs;
    });
  }, [orders, prevStartMs, prevEndMs]);

  // Keep dateFilteredOrders for Peak Sales Day & Top Performing Items
  const dateFilteredOrders = baseCurrentOrders;

  // Real Settlement Channels (Payment Methods & Traffic Sources)
  // Always adds up to baseCurrentOrders revenue (₹3,02,875 default)
  const settlementData = React.useMemo(() => {
    const totalRevenue = baseCurrentOrders.reduce((sum, o) => sum + o.totals.total, 0);

    // 1. Group Payment Methods
    const pGroups: Record<string, { key: string; label: string; amount: number; count: number }> = {
      upi: { key: 'upi', label: 'UPI / Instant VPA', amount: 0, count: 0 },
      card: { key: 'card', label: 'Credit & Debit Cards', amount: 0, count: 0 },
      netbanking: { key: 'netbanking', label: 'Net Banking', amount: 0, count: 0 },
      wallets: { key: 'wallets', label: 'Digital Wallets', amount: 0, count: 0 },
      cod: { key: 'cod', label: 'Cash on Delivery (COD)', amount: 0, count: 0 },
      other: { key: 'other', label: 'Other Gateways', amount: 0, count: 0 },
    };

    baseCurrentOrders.forEach((o) => {
      const m = (o.paymentMethod || o.payment?.method || '').toLowerCase();
      if (m.includes('upi')) {
        pGroups.upi.amount += o.totals.total;
        pGroups.upi.count += 1;
      } else if (m.includes('card')) {
        pGroups.card.amount += o.totals.total;
        pGroups.card.count += 1;
      } else if (m.includes('net')) {
        pGroups.netbanking.amount += o.totals.total;
        pGroups.netbanking.count += 1;
      } else if (m.includes('wallet')) {
        pGroups.wallets.amount += o.totals.total;
        pGroups.wallets.count += 1;
      } else if (m.includes('cod')) {
        pGroups.cod.amount += o.totals.total;
        pGroups.cod.count += 1;
      } else {
        pGroups.other.amount += o.totals.total;
        pGroups.other.count += 1;
      }
    });

    let pList = Object.values(pGroups).filter((p) => p.count > 0);
    if (pList.length === 0) {
      pList = [
        { key: 'upi', label: 'UPI / Instant VPA', amount: 0, count: 0 },
        { key: 'card', label: 'Credit & Debit Cards', amount: 0, count: 0 },
        { key: 'netbanking', label: 'Net Banking', amount: 0, count: 0 },
      ];
    }
    pList.sort((a, b) => b.amount - a.amount);

    let finalPList = pList;
    if (pList.length > 3) {
      const top3 = pList.slice(0, 3);
      const rest = pList.slice(3);
      const otherAmount = rest.reduce((s, r) => s + r.amount, 0);
      const otherCount = rest.reduce((s, r) => s + r.count, 0);
      if (otherAmount > 0) {
        top3.push({
          key: 'other',
          label: 'Other Gateways',
          amount: otherAmount,
          count: otherCount,
        });
      }
      finalPList = top3;
    }

    // 2. Group Traffic Sources
    const sGroups: Record<string, { key: string; label: string; amount: number; count: number }> = {
      organic: { key: 'organic', label: 'Organic Search', amount: 0, count: 0 },
      direct: { key: 'direct', label: 'Direct / Atelier', amount: 0, count: 0 },
      social: { key: 'social', label: 'Curated Social', amount: 0, count: 0 },
      email: { key: 'email', label: 'VIP Email Campaigns', amount: 0, count: 0 },
      referral: { key: 'referral', label: 'Concierge Referral', amount: 0, count: 0 },
      paid: { key: 'paid', label: 'Performance Media', amount: 0, count: 0 },
      other: { key: 'other', label: 'Direct / Unknown', amount: 0, count: 0 },
    };

    baseCurrentOrders.forEach((o) => {
      const s = (o.attribution?.source || '').toLowerCase();
      if (s === 'organic') {
        sGroups.organic.amount += o.totals.total;
        sGroups.organic.count += 1;
      } else if (s === 'social') {
        sGroups.social.amount += o.totals.total;
        sGroups.social.count += 1;
      } else if (s === 'email') {
        sGroups.email.amount += o.totals.total;
        sGroups.email.count += 1;
      } else if (s === 'referral') {
        sGroups.referral.amount += o.totals.total;
        sGroups.referral.count += 1;
      } else if (s === 'paid') {
        sGroups.paid.amount += o.totals.total;
        sGroups.paid.count += 1;
      } else {
        sGroups.direct.amount += o.totals.total;
        sGroups.direct.count += 1;
      }
    });

    let sList = Object.values(sGroups).filter((s) => s.count > 0);
    if (sList.length === 0) {
      sList = [
        { key: 'organic', label: 'Organic Search', amount: 0, count: 0 },
        { key: 'direct', label: 'Direct / Atelier', amount: 0, count: 0 },
        { key: 'social', label: 'Curated Social', amount: 0, count: 0 },
      ];
    }
    sList.sort((a, b) => b.amount - a.amount);

    let finalSList = sList;
    if (sList.length > 3) {
      const top3 = sList.slice(0, 3);
      const rest = sList.slice(3);
      const otherAmount = rest.reduce((s, r) => s + r.amount, 0);
      const otherCount = rest.reduce((s, r) => s + r.count, 0);
      if (otherAmount > 0) {
        top3.push({
          key: 'other',
          label: 'Other Sources',
          amount: otherAmount,
          count: otherCount,
        });
      }
      finalSList = top3;
    }

    // Largest Remainder Method: ensures exact 100% sum
    const calculateLargestRemainder = (items: { key: string; label: string; amount: number; count: number }[]) => {
      const sumAmount = items.reduce((s, i) => s + i.amount, 0);
      if (sumAmount === 0 || items.length === 0) {
        return items.map((i) => ({
          ...i,
          sharePct: 0,
          aov: 0,
          successRate: 98,
          failedRate: 2,
        }));
      }
      const exactPcts = items.map((i) => (i.amount / sumAmount) * 100);
      const floored = exactPcts.map((p) => Math.floor(p));
      const remainders = exactPcts.map((p, idx) => ({ remainder: p - floored[idx], idx }));
      const diff = 100 - floored.reduce((s, v) => s + v, 0);
      remainders.sort((a, b) => b.remainder - a.remainder);
      for (let i = 0; i < diff && i < remainders.length; i++) {
        floored[remainders[i].idx] += 1;
      }

      return items.map((item, idx) => {
        const aov = item.count > 0 ? Math.round(item.amount / item.count) : 0;
        let successRate = 96;
        let failedRate = 4;
        const k = item.key.toLowerCase();
        if (k.includes('card')) {
          successRate = 92;
          failedRate = 8;
        } else if (k.includes('upi')) {
          successRate = 96;
          failedRate = 4;
        } else if (k.includes('netbank')) {
          successRate = 95;
          failedRate = 5;
        } else if (k.includes('cod')) {
          successRate = 98;
          failedRate = 2;
        }
        return {
          ...item,
          sharePct: floored[idx],
          aov,
          successRate,
          failedRate,
        };
      });
    };

    return {
      paymentMethods: calculateLargestRemainder(finalPList),
      trafficSources: calculateLargestRemainder(finalSList),
      totalBaseRevenue: totalRevenue,
    };
  }, [baseCurrentOrders]);

  // Backward compatibility object for CSV reports
  const settlementStats = React.useMemo(() => {
    const upi = settlementData.paymentMethods.find((p) => p.key === 'upi') || { amount: 0, sharePct: 0 };
    const card = settlementData.paymentMethods.find((p) => p.key === 'card') || { amount: 0, sharePct: 0 };
    const net = settlementData.paymentMethods.find((p) => p.key === 'netbanking') || { amount: 0, sharePct: 0 };
    return {
      upi: { amount: upi.amount, pct: upi.sharePct },
      card: { amount: card.amount, pct: card.sharePct },
      netBanking: { amount: net.amount, pct: net.sharePct },
    };
  }, [settlementData]);

  // Orders filtered by active clicked channel column
  const { currentFilteredOrders, prevFilteredOrders } = React.useMemo(() => {
    if (!activeChannelFilter) {
      return {
        currentFilteredOrders: baseCurrentOrders,
        prevFilteredOrders: basePrevOrders,
      };
    }

    const filterFn = (o: Order) => {
      if (activeChannelFilter.type === 'payments') {
        const m = (o.paymentMethod || o.payment?.method || '').toLowerCase();
        if (activeChannelFilter.key === 'upi') return m.includes('upi');
        if (activeChannelFilter.key === 'card') return m.includes('card');
        if (activeChannelFilter.key === 'netbanking') return m.includes('net');
        if (activeChannelFilter.key === 'wallets') return m.includes('wallet');
        if (activeChannelFilter.key === 'cod') return m.includes('cod');
        return !m.includes('upi') && !m.includes('card') && !m.includes('net');
      } else {
        const s = (o.attribution?.source || 'direct').toLowerCase();
        if (activeChannelFilter.key === 'organic') return s === 'organic';
        if (activeChannelFilter.key === 'social') return s === 'social';
        if (activeChannelFilter.key === 'email') return s === 'email';
        if (activeChannelFilter.key === 'referral') return s === 'referral';
        if (activeChannelFilter.key === 'paid') return s === 'paid';
        return s === 'direct' || !['organic', 'social', 'email', 'referral', 'paid'].includes(s);
      }
    };

    return {
      currentFilteredOrders: baseCurrentOrders.filter(filterFn),
      prevFilteredOrders: basePrevOrders.filter(filterFn),
    };
  }, [baseCurrentOrders, basePrevOrders, activeChannelFilter]);

  // Comparison KPI values & trend badge calculation
  const kpiMetrics = React.useMemo(() => {
    const curRev = currentFilteredOrders.reduce((sum, o) => sum + o.totals.total, 0);
    const curOrders = currentFilteredOrders.length;
    const curAov = curOrders > 0 ? Math.round(curRev / curOrders) : 0;

    const prevRev = prevFilteredOrders.reduce((sum, o) => sum + o.totals.total, 0);
    const prevOrders = prevFilteredOrders.length;
    const prevAov = prevOrders > 0 ? Math.round(prevRev / prevOrders) : 0;

    const curVal = revenueMetric === 'revenue' ? curRev : revenueMetric === 'orders' ? curOrders : curAov;
    const prevVal = revenueMetric === 'revenue' ? prevRev : revenueMetric === 'orders' ? prevOrders : prevAov;

    let trendPct = 0;
    if (prevVal > 0) {
      trendPct = Number((((curVal - prevVal) / prevVal) * 100).toFixed(1));
    } else if (curVal > 0) {
      trendPct = 100;
    }

    return {
      curRev,
      curOrders,
      curAov,
      prevRev,
      prevOrders,
      prevAov,
      curVal,
      prevVal,
      trendPct,
    };
  }, [currentFilteredOrders, prevFilteredOrders, revenueMetric]);

  // Count-up animation for total KPI
  const [displayTotal, setDisplayTotal] = useState(kpiMetrics.curVal);

  useEffect(() => {
    const target = kpiMetrics.curVal;
    const start = displayTotal;
    if (start === target) return;

    const startTime = performance.now();
    const duration = 400;

    let rafId: number;
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayTotal(Math.round(start + (target - start) * ease));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [kpiMetrics.curVal]);

  // Dynamic Revenue Chart Timeline with Granularity, Comparison Dotted Line, and Hover Points
  const chartData = React.useMemo(() => {
    const activeCur = currentFilteredOrders;
    const activePrev = prevFilteredOrders;

    const padX = 16;
    const usableW = 368;

    let bucketCount = 6;
    const dayMs = 86400000;
    const totalDays = Math.max(1, Math.round(durationMs / dayMs));

    if (granularity === 'daily') {
      bucketCount = Math.min(Math.max(2, totalDays), 28);
    } else if (granularity === 'weekly') {
      bucketCount = Math.max(2, Math.min(10, Math.round(totalDays / 7)));
    } else {
      bucketCount = Math.max(2, Math.min(12, Math.round(totalDays / 30)));
    }

    const stepMs = durationMs / bucketCount;

    const rawBuckets: {
      id: string;
      x: number;
      revenue: number;
      orders: number;
      aov: number;
      prevRevenue: number;
      prevOrders: number;
      prevAov: number;
      curVal: number;
      prevVal: number;
      label: string;
      fullDate: string;
    }[] = [];

    let peakVal = 1000;

    for (let i = 0; i < bucketCount; i++) {
      const bStart = startMs + i * stepMs;
      const bEnd = i === bucketCount - 1 ? endMs : startMs + (i + 1) * stepMs;
      const pbStart = prevStartMs + i * stepMs;
      const pbEnd = i === bucketCount - 1 ? prevEndMs : prevStartMs + (i + 1) * stepMs;

      const cOrders = activeCur.filter((o) => {
        const t = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getTime();
        return t >= bStart && t <= bEnd;
      });

      const pOrders = activePrev.filter((o) => {
        const t = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getTime();
        return t >= pbStart && t <= pbEnd;
      });

      const bRev = cOrders.reduce((s, o) => s + o.totals.total, 0);
      const bCount = cOrders.length;
      const bAov = bCount > 0 ? Math.round(bRev / bCount) : 0;

      const pbRev = pOrders.reduce((s, o) => s + o.totals.total, 0);
      const pbCount = pOrders.length;
      const pbAov = pbCount > 0 ? Math.round(pbRev / pbCount) : 0;

      const curMetricVal = revenueMetric === 'revenue' ? bRev : revenueMetric === 'orders' ? bCount : bAov;
      const prevMetricVal = revenueMetric === 'revenue' ? pbRev : revenueMetric === 'orders' ? pbCount : pbAov;

      if (curMetricVal > peakVal) peakVal = curMetricVal;
      if (showCompareLine && prevMetricVal > peakVal) peakVal = prevMetricVal;

      const x = Math.round(padX + (i / Math.max(1, bucketCount - 1)) * usableW);

      const dStart = new Date(bStart);
      const dEnd = new Date(bEnd);
      let label = '';
      let fullDate = '';

      if (granularity === 'daily') {
        label = dStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        fullDate = dStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      } else if (granularity === 'weekly') {
        label = `W${i + 1}`;
        fullDate = `Week ${i + 1} (${dStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${dEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      } else {
        label = dStart.toLocaleDateString('en-US', { month: 'short' });
        fullDate = dStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      }

      rawBuckets.push({
        id: `bucket_${i}`,
        x,
        revenue: bRev,
        orders: bCount,
        aov: bAov,
        prevRevenue: pbRev,
        prevOrders: pbCount,
        prevAov: pbAov,
        curVal: curMetricVal,
        prevVal: prevMetricVal,
        label,
        fullDate,
      });
    }

    // Scale Y values (15 top padding to 88 baseline)
    const points = rawBuckets.map((pt) => {
      const y = Math.round(88 - (pt.curVal / peakVal) * 72);
      const prevY = Math.round(88 - (pt.prevVal / peakVal) * 72);
      return {
        ...pt,
        y,
        prevY,
      };
    });

    const linePath = points.reduce((acc, p, i) => (i === 0 ? `M${p.x},${p.y}` : `${acc} L${p.x},${p.y}`), '');
    const areaPath =
      points.length > 0
        ? `${linePath} L${points[points.length - 1].x},90 L${points[0].x},90 Z`
        : 'M0,90 L400,90 Z';

    const compareLinePath = points.reduce(
      (acc, p, i) => (i === 0 ? `M${p.x},${p.prevY}` : `${acc} L${p.x},${p.prevY}`),
      ''
    );

    return {
      points,
      linePath,
      areaPath,
      compareLinePath,
      maxVal: peakVal,
    };
  }, [
    currentFilteredOrders,
    prevFilteredOrders,
    granularity,
    durationMs,
    startMs,
    endMs,
    prevStartMs,
    prevEndMs,
    revenueMetric,
    showCompareLine,
  ]);

  // Clean, non-overlapping X-axis milestone labels
  const axisLabels = React.useMemo(() => {
    if (chartData.points.length === 0) return [];
    const result: { id: string; label: string; xPct: number }[] = [];
    let lastXPct = -100;
    let lastLabel = '';

    chartData.points.forEach((pt, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === chartData.points.length - 1;
      const xPct = (pt.x / 400) * 100;

      if (pt.label === lastLabel) return;

      if (isFirst || (xPct - lastXPct >= 14 && (!isLast || xPct - lastXPct >= 12))) {
        if (!isLast && 96 - xPct < 12 && chartData.points.length > 2) {
          return;
        }
        result.push({ id: pt.id, label: pt.label, xPct });
        lastXPct = xPct;
        lastLabel = pt.label;
      } else if (isLast && xPct - lastXPct >= 10) {
        result.push({ id: pt.id, label: pt.label, xPct });
      }
    });

    const lastPt = chartData.points[chartData.points.length - 1];
    if (lastPt && !result.some((r) => r.id === lastPt.id)) {
      const lastXPct = (lastPt.x / 400) * 100;
      const prev = result[result.length - 1];
      if (prev && lastXPct - prev.xPct < 12) {
        result.pop();
      }
      result.push({ id: lastPt.id, label: lastPt.label, xPct: lastXPct });
    }

    return result;
  }, [chartData.points]);

  // Peak Sales Day by Weekday aggregated over shared date range
  const weeklyActivity = React.useMemo(() => {
    const dayStats = WEEKDAY_NAMES.map((label, dayIdx) => {
      const matches = dateFilteredOrders.filter((o) => {
        const d = new Date(o.createdAt || o.statusHistory[0]?.timestamp || o.id).getDay();
        return d === dayIdx;
      });
      const rev = matches.reduce((acc, o) => acc + o.totals.total, 0);
      return {
        dayIdx,
        label,
        fullName: WEEKDAY_FULL_NAMES[dayIdx],
        count: matches.length,
        revenue: rev,
      };
    });

    const totalWeeklyRevenue = dayStats.reduce((sum, d) => sum + d.revenue, 0);
    const totalWeeklyOrders = dayStats.reduce((sum, d) => sum + d.count, 0);

    const maxVal = Math.max(
      ...dayStats.map((d) => (salesDayMetric === 'revenue' ? d.revenue : d.count)),
      1
    );

    // Identify peak day
    let peakIdx = -1;
    let peakVal = 0;
    dayStats.forEach((d) => {
      const val = salesDayMetric === 'revenue' ? d.revenue : d.count;
      if (val > peakVal) {
        peakVal = val;
        peakIdx = d.dayIdx;
      }
    });

    const days = dayStats.map((d) => {
      const val = salesDayMetric === 'revenue' ? d.revenue : d.count;
      const isPeak = d.dayIdx === peakIdx && val > 0;
      const pctShare = salesDayMetric === 'revenue'
        ? (totalWeeklyRevenue > 0 ? Math.round((d.revenue / totalWeeklyRevenue) * 100) : 0)
        : (totalWeeklyOrders > 0 ? Math.round((d.count / totalWeeklyOrders) * 100) : 0);

      const valueLabel = salesDayMetric === 'revenue'
        ? formatPrice(d.revenue).replace(/\D000$/, 'K')
        : `${d.count} ord`;

      // Scale to chart area: each bar height = (value / max) * 100%, min 3%
      const heightPct = val > 0 ? Math.max(3, Math.min(100, Math.round((val / maxVal) * 100))) : 3;

      return {
        ...d,
        isPeak,
        valueLabel,
        heightPct,
        pctShare,
      };
    });

    // Quietest day calculation
    let quietestDay = days[0];
    let minMetricVal = salesDayMetric === 'revenue' ? quietestDay.revenue : quietestDay.count;
    days.forEach((d) => {
      const v = salesDayMetric === 'revenue' ? d.revenue : d.count;
      if (v < minMetricVal) {
        minMetricVal = v;
        quietestDay = d;
      }
    });

    return {
      days,
      totalWeeklyRevenue,
      totalWeeklyOrders,
      peakDay: peakIdx !== -1 ? days[peakIdx] : null,
      peakVal,
      quietestDay,
      minMetricVal,
    };
  }, [dateFilteredOrders, salesDayMetric]);

  // Calculated summary line under the card title
  const salesDaySummary = React.useMemo(() => {
    if (!weeklyActivity.peakDay || weeklyActivity.peakVal === 0) {
      return 'No commission activity recorded for this period.';
    }
    const peak = weeklyActivity.peakDay;
    if (salesDayMetric === 'revenue') {
      return `${peak.fullName}s drive ${peak.pctShare}% of weekly revenue.`;
    } else {
      return `${peak.fullName}s drive ${peak.pctShare}% of weekly commissions.`;
    }
  }, [weeklyActivity, salesDayMetric]);

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
                {['Today', '7D', '30D', '90D', 'This Year', 'Custom'].map((p) => (
                  <div
                    key={p}
                    onClick={() => {
                      setPreset(p);
                      setIsPresetOpen(false);
                      setIsUserGranularity(false);
                      const today = new Date();
                      let start = new Date();
                      if (p === 'Today') {
                        start = today;
                      } else if (p === '7D') {
                        start.setDate(today.getDate() - 7);
                      } else if (p === '30D') {
                        start.setDate(today.getDate() - 30);
                      } else if (p === '90D') {
                        start.setDate(today.getDate() - 90);
                      } else if (p === 'This Year') {
                        start = new Date(today.getFullYear(), 0, 1);
                      }

                      if (p !== 'Custom') {
                        setDateRange({
                          start: start.toISOString().split('T')[0],
                          end: today.toISOString().split('T')[0],
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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = p === preset ? 'var(--bg-subtle)' : 'transparent')
                    }
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
      <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'var(--space-4)' }}>
        {/* Left Column (8 cols) */}
        <div className="admin-grid-col-8" style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Overall Revenue Card */}
          <div className="admin-table-wrapper" style={{ padding: 'var(--space-6)', position: 'relative' }}>
            {/* Top Toolbar: Title row + Controls row (Two stacked rows that never share width) */}
            <div className="revenue-card__header">
              <div className="revenue-card__title-row">
                <h3 className="revenue-card__title">
                  {revenueMetric === 'revenue' ? 'Overall Revenue' : revenueMetric === 'orders' ? 'Overall Commissions & Orders' : 'Average Order Value'}
                </h3>
                <span className="revenue-card__badge">
                  {preset} • {granularity.toUpperCase()}
                </span>
                {/* Active Channel Filter Chip */}
                {activeChannelFilter && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#996515',
                    backgroundColor: 'rgba(212, 175, 55, 0.12)',
                    border: '1px solid #D4AF37',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-pill)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>
                    <Filter size={12} style={{ color: '#B8860B' }} />
                    <span>Filtered: {activeChannelFilter.label}</span>
                    <button
                      type="button"
                      onClick={() => setActiveChannelFilter(null)}
                      title="Clear filter"
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#996515',
                      }}
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>

              {/* Controls Row: Metric pills | Granularity pills | Compare | "..." menu */}
              <div className="revenue-card__controls">
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '3px 4px',
                    border: '1px solid var(--admin-border-light)',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    gap: '1px',
                  }}
                >
                {/* 1. Metric Switcher */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                  {(['revenue', 'orders', 'aov'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setRevenueMetric(m)}
                      style={{
                        padding: '3px 9px',
                        fontSize: '0.72rem',
                        fontWeight: revenueMetric === m ? 600 : 500,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: revenueMetric === m ? 'var(--admin-surface)' : 'transparent',
                        color: revenueMetric === m ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                        boxShadow: revenueMetric === m ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        lineHeight: 1.2,
                      }}
                    >
                      {m === 'aov' ? 'AOV' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Subtle Divider */}
                <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--admin-border)', margin: '0 4px', opacity: 0.7 }} />

                {/* 2. Granularity Toggle (Daily / Weekly / Monthly) */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                  {(['daily', 'weekly', 'monthly'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGranularity(g);
                        setIsUserGranularity(true);
                      }}
                      title={`${g.charAt(0).toUpperCase() + g.slice(1)} aggregation`}
                      style={{
                        padding: '3px 8px',
                        fontSize: '0.72rem',
                        fontWeight: granularity === g ? 600 : 500,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: granularity === g ? 'var(--admin-surface)' : 'transparent',
                        color: granularity === g ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                        boxShadow: granularity === g ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        lineHeight: 1.2,
                      }}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Subtle Divider */}
                <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--admin-border)', margin: '0 4px', opacity: 0.7 }} />

                {/* 3. Compare Previous Period Toggle */}
                <button
                  type="button"
                  onClick={() => setShowCompareLine(!showCompareLine)}
                  title={showCompareLine ? 'Hide previous period comparison line' : 'Show previous period comparison line'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 8px',
                    fontSize: '0.72rem',
                    fontWeight: showCompareLine ? 600 : 500,
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    backgroundColor: showCompareLine ? 'var(--admin-surface)' : 'transparent',
                    color: showCompareLine ? 'var(--color-sapphire-700)' : 'var(--text-muted)',
                    boxShadow: showCompareLine ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    lineHeight: 1.2,
                  }}
                >
                  {showCompareLine ? <Eye size={12} style={{ color: 'var(--color-sapphire-700)' }} /> : <EyeOff size={12} />}
                  <span>Compare</span>
                </button>

                {/* Subtle Divider */}
                <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--admin-border)', margin: '0 4px', opacity: 0.7 }} />

                {/* 4. Card "..." Menu */}
                <div ref={revenueMenuRef} style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setIsRevenueMenuOpen(!isRevenueMenuOpen)}
                    title="Revenue options"
                    style={{
                      border: 'none',
                      backgroundColor: isRevenueMenuOpen ? 'var(--admin-surface)' : 'transparent',
                      cursor: 'pointer',
                      padding: '3px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isRevenueMenuOpen ? 'var(--admin-text-primary)' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-pill)',
                      transition: 'all 0.15s ease',
                      boxShadow: isRevenueMenuOpen ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    <MoreHorizontal size={15} />
                  </button>

                  {isRevenueMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-md)',
                      zIndex: 30,
                      minWidth: '260px',
                      padding: '6px 0',
                    }}>
                      {/* Counted Statuses Note */}
                      <div style={{
                        padding: 'var(--space-2) var(--space-4)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-subtle)',
                        borderBottom: '1px solid var(--admin-border-light)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '6px',
                        lineHeight: 1.4,
                      }}>
                        <Info size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-sapphire-700)' }} />
                        <span>Counted: Paid & confirmed orders only (excludes cancelled & refunded).</span>
                      </div>

                      {/* Export CSV */}
                      <div
                        onClick={() => {
                          setIsRevenueMenuOpen(false);
                          const isPay = channelView === 'payments';
                          const channels = isPay ? settlementData.paymentMethods : settlementData.trafficSources;
                          const lines = [
                            'AURELIA ATELIER - SETTLEMENT & REVENUE REPORT',
                            `Reporting Period: ${dateRange.start} to ${dateRange.end} (${preset})`,
                            `Active Metric: ${revenueMetric.toUpperCase()}`,
                            `Total Settled: ${formatPrice(settlementData.totalBaseRevenue)}`,
                            `Active Channel Filter: ${activeChannelFilter ? activeChannelFilter.label : 'All Channels'}`,
                            '',
                            `--- ${isPay ? 'PAYMENT METHODS' : 'TRAFFIC SOURCES'} ---`,
                            isPay
                              ? 'Gateway,Amount (INR),Share %,Orders,AOV (INR),Success Rate,Failed Rate'
                              : 'Source,Revenue (INR),Share %,Orders,AOV (INR)',
                            ...channels.map((c) =>
                              isPay
                                ? `"${c.label}",${c.amount},${c.sharePct}%,${c.count},${c.aov},${c.successRate}%,${c.failedRate}%`
                                : `"${c.label}",${c.amount},${c.sharePct}%,${c.count},${c.aov}`
                            ),
                            '',
                            '--- TIMELINE MILESTONES ---',
                            'Milestone,Full Date,Revenue (INR),Orders,AOV (INR),Previous Period (INR)',
                            ...chartData.points.map(
                              (pt) => `"${pt.label}","${pt.fullDate}",${pt.revenue},${pt.orders},${pt.aov},${pt.prevVal}`
                            ),
                          ];
                          triggerCsvDownload(lines.join('\n'), `aurelia_revenue_${channelView}_${dateRange.start}_to_${dateRange.end}`);
                          showToast('Settlement & timeline report exported to CSV.', 'success');
                        }}
                        style={{
                          padding: 'var(--space-2) var(--space-4)',
                          fontSize: '0.82rem',
                          color: 'var(--admin-text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Download size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>Export Revenue & Settlement (CSV)</span>
                      </div>

                      {/* Switch to Table View */}
                      <div
                        onClick={() => {
                          setIsChannelTableView(!isChannelTableView);
                          setIsRevenueMenuOpen(false);
                        }}
                        style={{
                          padding: 'var(--space-2) var(--space-4)',
                          fontSize: '0.82rem',
                          color: 'var(--admin-text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          borderTop: '1px solid var(--admin-border-light)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <TableIcon size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{isChannelTableView ? 'Switch to 3-Column View' : 'Switch to Table View'}</span>
                      </div>

                      {/* Go to Payments Report */}
                      <div
                        onClick={() => {
                          setIsRevenueMenuOpen(false);
                          router.push('/admin/orders');
                        }}
                        style={{
                          padding: 'var(--space-2) var(--space-4)',
                          fontSize: '0.82rem',
                          color: 'var(--admin-text-primary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-2)',
                          borderTop: '1px solid var(--admin-border-light)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>Go to Orders & Payments Log</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

            {/* Main KPI + Timeline SVG Chart */}
            <div style={{
              display: 'flex',
              gap: 'var(--space-8)',
              alignItems: 'center',
              marginBottom: 'var(--space-6)',
              flexWrap: 'wrap',
            }}>
              {/* Left KPI Callout */}
              <div className="revenue-card__kpi" style={{ flexShrink: 0, minWidth: '190px', minHeight: '96px' }}>
                <h3
                  className="revenue-card__kpi-number"
                  style={{
                    fontSize: '2.1rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    margin: 0,
                    whiteSpace: 'nowrap',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {revenueMetric === 'revenue'
                    ? formatPrice(displayTotal)
                    : revenueMetric === 'orders'
                    ? `${displayTotal.toLocaleString()} Orders`
                    : formatPrice(displayTotal)}
                </h3>

                {/* Comparison KPI Badge vs equal-length previous period */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <span
                    title={`Previous equal-length period: ${revenueMetric === 'orders' ? `${kpiMetrics.prevVal} orders` : formatPrice(kpiMetrics.prevVal)}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: kpiMetrics.trendPct >= 0 ? 'var(--color-sapphire-700)' : '#dc2626',
                      backgroundColor: kpiMetrics.trendPct >= 0 ? 'var(--overlay-sapphire-10)' : 'rgba(220, 38, 38, 0.08)',
                      padding: '2px var(--space-2)',
                      borderRadius: 'var(--radius-pill)',
                      cursor: 'help',
                    }}
                  >
                    {kpiMetrics.trendPct >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{kpiMetrics.trendPct >= 0 ? `+${kpiMetrics.trendPct}%` : `${kpiMetrics.trendPct}%`}</span>
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>vs. last period</span>
                </div>

                {/* Compare Line Legend if enabled */}
                {showCompareLine && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '12px', height: '2.5px', backgroundColor: 'var(--color-sapphire-700)', borderRadius: '1px' }} />
                      <span>Current</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '12px', height: '2px', borderTop: '2px dashed #8EAFB8' }} />
                      <span>Prior Period</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Revenue Trend Chart Graphic */}
              <div className="revenue-card__chart-container" style={{ flex: '1 1 360px', minWidth: '280px', height: '180px', display: 'flex', gap: '8px', position: 'relative' }}>
                {/* Y-axis Labels */}
                <div style={{
                  position: 'relative',
                  width: '48px',
                  flexShrink: 0,
                  height: 'calc(100% - 24px)',
                  userSelect: 'none',
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '15%',
                    right: '8px',
                    transform: 'translateY(-50%)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>
                    {revenueMetric === 'orders' ? chartData.maxVal : formatPrice(chartData.maxVal).replace(/\D000$/, 'K')}
                  </span>
                  <span style={{
                    position: 'absolute',
                    top: '52.5%',
                    right: '8px',
                    transform: 'translateY(-50%)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>
                    {revenueMetric === 'orders' ? Math.round(chartData.maxVal / 2) : formatPrice(Math.round(chartData.maxVal / 2)).replace(/\D000$/, 'K')}
                  </span>
                  <span style={{
                    position: 'absolute',
                    top: '90%',
                    right: '8px',
                    transform: 'translateY(-50%)',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    lineHeight: 1,
                  }}>
                    {revenueMetric === 'orders' ? '0' : '₹0'}
                  </span>
                </div>

                {/* Chart Graphic + X-axis Dates */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                  {/* Floating Point Tooltip */}
                  {hoveredPoint && (
                    <div style={{
                      position: 'absolute',
                      left: `${(hoveredPoint.x / 400) * 100}%`,
                      top: '0px',
                      transform: 'translate(-50%, -105%)',
                      backgroundColor: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      boxShadow: 'var(--shadow-md)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      pointerEvents: 'none',
                      zIndex: 25,
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                        {hoveredPoint.fullDate}
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-sapphire-700)' }}>
                        {formatPrice(hoveredPoint.revenue)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {hoveredPoint.orders} {hoveredPoint.orders === 1 ? 'commission' : 'commissions'} • {formatPrice(hoveredPoint.aov)} AOV
                      </div>
                      {showCompareLine && hoveredPoint.prevVal !== undefined && (
                        <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid var(--admin-border-light)', paddingTop: '2px', marginTop: '2px' }}>
                          Prior period: {formatPrice(hoveredPoint.prevVal)}
                        </div>
                      )}
                    </div>
                  )}

                  {/* SVG Canvas for Grid & Lines */}
                  <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
                    <svg
                      viewBox="0 0 400 100"
                      preserveAspectRatio="none"
                      style={{ width: '100%', height: '100%', overflow: 'visible' }}
                    >
                      <defs>
                        <linearGradient id="revenueChartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-sapphire-700)" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="var(--color-sapphire-700)" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line x1="0" y1="15" x2="400" y2="15" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="0" y1="52.5" x2="400" y2="52.5" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                      <line x1="0" y1="90" x2="400" y2="90" stroke="var(--border-color)" strokeWidth="1" opacity="0.6" />

                      {/* Area Fill */}
                      <path d={chartData.areaPath} fill="url(#revenueChartGradient)" />

                      {/* Comparison Dotted Line for previous period */}
                      {showCompareLine && (
                        <path
                          d={chartData.compareLinePath}
                          fill="none"
                          stroke="#8EAFB8"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.85"
                        />
                      )}

                      {/* Main Solid Line */}
                      <path
                        d={chartData.linePath}
                        fill="none"
                        stroke="var(--color-sapphire-700)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Interactive Hoverable Points */}
                      {chartData.points.map((pt) => {
                        const isHovered = hoveredPoint?.id === pt.id;
                        return (
                          <g key={pt.id}>
                            {/* Hover hit area */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              fill="transparent"
                              style={{ cursor: 'pointer' }}
                              onMouseEnter={() => setHoveredPoint(pt)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                            {/* Visual Point */}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered ? 5.5 : 3.5}
                              fill="var(--color-sapphire-700)"
                              stroke="var(--admin-surface)"
                              strokeWidth="2"
                              style={{
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                filter: isHovered ? 'drop-shadow(0 0 4px rgba(26, 59, 71, 0.4))' : 'none',
                              }}
                              onMouseEnter={() => setHoveredPoint(pt)}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Clean X-axis Date Labels */}
                  <div style={{ height: '22px', position: 'relative', marginTop: '6px' }}>
                    {axisLabels.map((lbl) => (
                      <span
                        key={lbl.id}
                        style={{
                          position: 'absolute',
                          left: `${lbl.xPct}%`,
                          transform: 'translateX(-50%)',
                          fontSize: '0.72rem',
                          fontWeight: 500,
                          color: 'var(--text-muted)',
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                          lineHeight: 1,
                        }}
                      >
                        {lbl.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Settlement Channels Section */}
            <div style={{ borderTop: '1px solid var(--admin-border-light)', paddingTop: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--admin-text-primary)', margin: 0 }}>
                    Settlement Channels
                  </h3>

                  {/* Tab Toggle: Payment Methods / Traffic Sources with Golden Accent */}
                  <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-pill)', padding: '2px' }}>
                    <button
                      type="button"
                      onClick={() => handleChannelTabChange('payments')}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: channelView === 'payments' ? 'var(--admin-surface)' : 'transparent',
                        color: channelView === 'payments' ? '#996515' : 'var(--text-muted)',
                        boxShadow: channelView === 'payments' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        borderBottom: channelView === 'payments' ? '2px solid #D4AF37' : '2px solid transparent',
                      }}
                    >
                      Payment Methods
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChannelTabChange('sources')}
                      style={{
                        padding: '3px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-pill)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        backgroundColor: channelView === 'sources' ? 'var(--admin-surface)' : 'transparent',
                        color: channelView === 'sources' ? '#996515' : 'var(--text-muted)',
                        boxShadow: channelView === 'sources' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        borderBottom: channelView === 'sources' ? '2px solid #D4AF37' : '2px solid transparent',
                      }}
                    >
                      Traffic Sources
                    </button>
                  </div>
                </div>

                {/* Total Channel Summary note: verifies rule that channels add to total */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Settled: <strong style={{ color: 'var(--admin-text-primary)' }}>{formatPrice(settlementData.totalBaseRevenue)}</strong>
                </div>
              </div>

              {/* Channels Display: Empty State or Active View */}
              {baseCurrentOrders.length === 0 ? (
                <div style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                }}>
                  No settled payments in this period.
                </div>
              ) : isChannelTableView ? (
                /* Tabular View */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--admin-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '8px 12px' }}>{channelView === 'payments' ? 'Payment Method' : 'Traffic Source'}</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Share</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>Orders</th>
                        <th style={{ padding: '8px 12px', textAlign: 'right' }}>AOV</th>
                        {channelView === 'payments' && <th style={{ padding: '8px 12px', textAlign: 'right' }}>Health</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(channelView === 'payments' ? settlementData.paymentMethods : settlementData.trafficSources).map((ch) => {
                        const isFiltered = activeChannelFilter?.key === ch.key;
                        return (
                          <tr
                            key={ch.key}
                            onClick={() => {
                              if (activeChannelFilter?.key === ch.key) {
                                setActiveChannelFilter(null);
                              } else {
                                setActiveChannelFilter({ type: channelView, key: ch.key, label: ch.label });
                              }
                            }}
                            style={{
                              borderBottom: '1px solid var(--admin-border-light)',
                              cursor: 'pointer',
                              backgroundColor: isFiltered ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                            }}
                          >
                            <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                              {ch.label}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>
                              {formatPrice(ch.amount)}
                            </td>
                            <td style={{ padding: '8px 12px', textAlign: 'right' }}>{ch.sharePct}%</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right' }}>{ch.count}</td>
                            <td style={{ padding: '8px 12px', textAlign: 'right' }}>{formatPrice(ch.aov)}</td>
                            {channelView === 'payments' && (
                              <td style={{ padding: '8px 12px', textAlign: 'right', color: (ch as any).failedRate > 5 ? '#dc2626' : 'var(--color-sapphire-700)' }}>
                                {(ch as any).successRate}% ok ({(ch as any).failedRate}% loss)
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* 3-Column View with Largest Channel Darkest */
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--space-4)',
                }}>
                  {(channelView === 'payments' ? settlementData.paymentMethods : settlementData.trafficSources).map((ch, idx) => {
                    // 3 Sapphire/Icy Lake Tones: biggest channel darkest
                    const tones = [
                      '#1A3B47', // Darkest Sapphire
                      '#2F5E6E', // Medium Sapphire
                      '#5A8B9C', // Icy Lake tone
                      '#8EAFB8', // Muted tone for Other
                    ];
                    const colorTone = tones[Math.min(idx, tones.length - 1)];
                    const isFiltered = activeChannelFilter?.key === ch.key;

                    return (
                      <div
                        key={ch.key}
                        onClick={() => {
                          if (activeChannelFilter?.key === ch.key) {
                            setActiveChannelFilter(null);
                          } else {
                            setActiveChannelFilter({ type: channelView, key: ch.key, label: ch.label });
                          }
                        }}
                        onMouseEnter={() => setHoveredChannelKey(ch.key)}
                        onMouseLeave={() => setHoveredChannelKey(null)}
                        style={{
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isFiltered
                            ? 'rgba(212, 175, 55, 0.08)'
                            : hoveredChannelKey === ch.key
                            ? 'var(--bg-subtle)'
                            : 'transparent',
                          border: isFiltered ? '1.5px solid #D4AF37' : '1px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          position: 'relative',
                        }}
                        title={
                          channelView === 'payments'
                            ? `${ch.label}: ${ch.count} orders, ${formatPrice(ch.aov)} AOV • ${(ch as any).successRate}% success, ${(ch as any).failedRate}% failed at checkout`
                            : `${ch.label}: ${ch.count} orders, ${formatPrice(ch.aov)} AOV`
                        }
                      >
                        {/* Top: Square Tone + Amount */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <div style={{
                              width: '9px',
                              height: '9px',
                              borderRadius: '2px',
                              backgroundColor: colorTone,
                              flexShrink: 0,
                            }} />
                            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                              {formatPrice(ch.amount)}
                            </span>
                          </div>
                          {isFiltered && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#B8860B' }}>
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Middle: Label + Share % + Tooltip Health details */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginBottom: 'var(--space-2)',
                        }}>
                          <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ch.label}
                          </span>
                          <span style={{ fontWeight: 700, color: 'var(--admin-text-primary)', marginLeft: '6px' }}>
                            {ch.sharePct}%
                          </span>
                        </div>

                        {/* Progress Bar with Hamilton-Hare rounded share % */}
                        <div style={{
                          height: '4px',
                          backgroundColor: 'var(--overlay-sapphire-10)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          marginBottom: '6px',
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${ch.sharePct}%`,
                            backgroundColor: colorTone,
                            transition: 'width 0.3s ease',
                          }} />
                        </div>

                        {/* Channel Sub-details: Orders, AOV, and Failed Rate */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <span>{ch.count} {ch.count === 1 ? 'order' : 'orders'}</span>
                          {channelView === 'payments' ? (
                            <span style={{ color: (ch as any).failedRate > 5 ? '#b91c1c' : 'inherit' }}>
                              {(ch as any).failedRate}% failed
                            </span>
                          ) : (
                            <span>{formatPrice(ch.aov)} AOV</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols) */}
        <div className="admin-grid-col-4" style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

          {/* Peak Sales Day (Weekday Bar Chart) */}
          <div className="admin-glass-card peak-sales-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', gap: 'var(--space-2)' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', margin: 0 }}>
                  Peak Sales Day
                </h2>
                <span className="peak-sales-subtitle">
                  {salesDaySummary}
                </span>
              </div>

              {/* Toggle: Revenue vs Orders */}
              <div style={{
                display: 'flex',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '2px',
                border: '1px solid var(--admin-border-light)',
                flexShrink: 0,
              }}>
                <button
                  type="button"
                  onClick={() => setSalesDayMetric('revenue')}
                  style={{
                    padding: '2px 9px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    backgroundColor: salesDayMetric === 'revenue' ? 'var(--admin-surface)' : 'transparent',
                    color: salesDayMetric === 'revenue' ? 'var(--color-sapphire-700)' : 'var(--text-muted)',
                    boxShadow: salesDayMetric === 'revenue' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Revenue
                </button>
                <button
                  type="button"
                  onClick={() => setSalesDayMetric('orders')}
                  style={{
                    padding: '2px 9px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                    backgroundColor: salesDayMetric === 'orders' ? 'var(--admin-surface)' : 'transparent',
                    color: salesDayMetric === 'orders' ? 'var(--color-sapphire-700)' : 'var(--text-muted)',
                    boxShadow: salesDayMetric === 'orders' ? 'var(--shadow-sm)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Orders
                </button>
              </div>
            </div>

            {/* Filter Active Notice */}
            {selectedWeekday !== null && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '4px 10px',
                backgroundColor: 'var(--overlay-sapphire-10)',
                borderRadius: 'var(--radius-sm)',
                marginBottom: 'var(--space-3)',
                fontSize: '0.73rem',
                color: 'var(--color-sapphire-700)',
                fontWeight: 500,
              }}>
                <span>Filtering table by: <strong>{WEEKDAY_FULL_NAMES[selectedWeekday]}</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedWeekday(null)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--color-sapphire-700)',
                    textDecoration: 'underline',
                    padding: 0,
                  }}
                >
                  Clear filter
                </button>
              </div>
            )}

            {/* Scaling Chart Container with Faint Gridlines */}
            <div className="peak-sales-chart-container">
              {/* 3 Faint Dashed Gridlines behind bars */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '32px',
                  bottom: '26px',
                  pointerEvents: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  zIndex: 0,
                }}
              >
                <div style={{ width: '100%', borderTop: '1px dashed var(--color-neutral-200, #E0E0E0)', opacity: 0.7 }} />
                <div style={{ width: '100%', borderTop: '1px dashed var(--color-neutral-200, #E0E0E0)', opacity: 0.7 }} />
                <div style={{ width: '100%', borderTop: '1px solid var(--color-neutral-200, #E0E0E0)', opacity: 0.9 }} />
              </div>

              {weeklyActivity.days.map((day) => {
                const isSelected = selectedWeekday === day.dayIdx;
                const isHovered = hoveredDay === day.dayIdx;

                return (
                  <div
                    key={day.label}
                    className="peak-sales-day-col"
                    onMouseEnter={() => setHoveredDay(day.dayIdx)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Track: Definite parent flex basis for percentage bar height */}
                    <div className="peak-sales-track">
                      {/* Bar with percentage height & min 3% */}
                      <div
                        className={`peak-sales-bar ${day.isPeak ? 'peak-sales-bar--peak' : ''}`}
                        onClick={() => setSelectedWeekday(isSelected ? null : day.dayIdx)}
                        style={{
                          height: `${day.heightPct}%`,
                          backgroundColor: day.isPeak
                            ? 'var(--color-sapphire-700, #244B57)'
                            : isHovered
                            ? 'var(--color-sapphire-300, #7DA1AB)'
                            : 'var(--color-icy-lake-300, #CAD4D6)',
                          boxShadow: isSelected
                            ? '0 0 0 2px var(--admin-surface), 0 0 0 4px var(--color-sapphire-700), 0 4px 12px rgba(36, 75, 87, 0.25)'
                            : isHovered
                            ? '0 4px 10px rgba(0,0,0,0.12)'
                            : 'none',
                          transform: isSelected || isHovered ? 'translateY(-2px)' : 'none',
                        }}
                      >
                        {/* Value Pill pinned above the bar */}
                        {(day.isPeak || isHovered || isSelected) && (
                          <div style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 5px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            pointerEvents: 'none',
                          }}>
                            <span style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              color: day.isPeak || isSelected ? 'var(--color-sapphire-700, #244B57)' : 'var(--text-primary)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: day.isPeak ? 'var(--overlay-sapphire-10)' : 'var(--admin-surface)',
                              border: day.isPeak ? '1px solid rgba(36, 75, 87, 0.25)' : '1px solid var(--admin-border)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            }}>
                              {day.valueLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Day Name */}
                    <span
                      onClick={() => setSelectedWeekday(isSelected ? null : day.dayIdx)}
                      style={{
                        marginTop: '8px',
                        fontSize: '0.74rem',
                        color: day.isPeak || isSelected
                          ? 'var(--color-sapphire-700)'
                          : isHovered
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                        fontWeight: day.isPeak || isSelected ? 700 : 500,
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      {day.label}
                    </span>

                    {/* Interactive Hover Tooltip */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: 'calc(100% + 8px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--color-black-tie)',
                        color: 'var(--color-diamond)',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
                        fontSize: '0.72rem',
                        whiteSpace: 'nowrap',
                        zIndex: 30,
                        pointerEvents: 'none',
                        minWidth: '130px',
                      }}>
                        <div style={{ fontWeight: 700, fontSize: '0.78rem', borderBottom: '1px solid rgba(255,255,255,0.18)', paddingBottom: '3px', marginBottom: '4px' }}>
                          {day.fullName} {day.isPeak && '👑 (Peak Day)'}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '2px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.65)' }}>{salesDayMetric === 'revenue' ? 'Revenue:' : 'Orders:'}</span>
                          <span style={{ fontWeight: 600 }}>
                            {salesDayMetric === 'revenue' ? formatPrice(day.revenue) : `${day.count} orders`}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ color: 'rgba(255,255,255,0.65)' }}>Weekly Share:</span>
                          <span style={{ fontWeight: 700, color: 'var(--color-golden-300)' }}>{day.pctShare}%</span>
                        </div>
                        <div style={{
                          fontSize: '0.64rem',
                          color: 'var(--color-sapphire-300)',
                          borderTop: '1px solid rgba(255,255,255,0.12)',
                          paddingTop: '3px',
                          textAlign: 'center',
                          fontWeight: 500,
                        }}>
                          {isSelected ? 'Click to clear filter' : 'Click to filter Top Items'}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Stats Row Under the Chart (Peak Day / Daily Average / Quietest Day) */}
            <div className="peak-sales-stats">
              {/* 1. Peak Day */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Peak Day
                </span>
                <span className="peak-sales-stat-val" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-sapphire-700)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {(salesDayMetric === 'revenue' ? weeklyActivity.totalWeeklyRevenue : weeklyActivity.totalWeeklyOrders) > 0 && weeklyActivity.peakDay
                    ? `${weeklyActivity.peakDay.label} · ${salesDayMetric === 'revenue' ? formatPrice(weeklyActivity.peakDay.revenue) : weeklyActivity.peakDay.count}`
                    : '-'}
                </span>
              </div>

              {/* 2. Daily Average */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Daily Average
                </span>
                <span className="peak-sales-stat-val" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--admin-text-primary)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {(salesDayMetric === 'revenue' ? weeklyActivity.totalWeeklyRevenue : weeklyActivity.totalWeeklyOrders) > 0
                    ? (salesDayMetric === 'revenue' ? formatPrice(Math.round(weeklyActivity.totalWeeklyRevenue / 7)) : (weeklyActivity.totalWeeklyOrders / 7).toFixed(1))
                    : '-'}
                </span>
              </div>

              {/* 3. Quietest Day */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Quietest Day
                </span>
                <span className="peak-sales-stat-val" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '2px', fontVariantNumeric: 'tabular-nums' }}>
                  {(salesDayMetric === 'revenue' ? weeklyActivity.totalWeeklyRevenue : weeklyActivity.totalWeeklyOrders) > 0 && weeklyActivity.quietestDay
                    ? `${weeklyActivity.quietestDay.label} · ${salesDayMetric === 'revenue' ? formatPrice(weeklyActivity.quietestDay.revenue) : weeklyActivity.quietestDay.count}`
                    : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Row (12 cols) – Top Performing Items Table */}
        <div className="admin-grid-col-12" style={{ gridColumn: 'span 12' }}>
          {/* Top Performing Items Table */}
          <div className="admin-table-wrapper" style={{ padding: 'var(--space-6)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--admin-text-primary)', margin: 0 }}>
                    Top Performing Items
                  </h2>
                  {selectedWeekday !== null && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--color-sapphire-700)',
                      backgroundColor: 'var(--overlay-sapphire-10)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                    }}>
                      <span>{WEEKDAY_FULL_NAMES[selectedWeekday]}s</span>
                      <button
                        type="button"
                        onClick={() => setSelectedWeekday(null)}
                        style={{
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          padding: 0,
                          fontSize: '0.75rem',
                          color: 'var(--color-sapphire-700)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Clear weekday filter"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedWeekday !== null
                    ? `Pieces ordered on ${WEEKDAY_FULL_NAMES[selectedWeekday]}s (${topItems.length} found)`
                    : 'Highest revenue pieces from client commissions in selected period'}
                </span>
              </div>

              {/* Controls: Top N Selector + View All + More Menu */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                {/* Top N Selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Show:</span>
                  <div style={{
                    display: 'flex',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-pill)',
                    padding: '2px',
                    border: '1px solid var(--admin-border-light)',
                  }}>
                    {[5, 10, 20].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setTopLimit(n)}
                        style={{
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          border: 'none',
                          borderRadius: 'var(--radius-pill)',
                          cursor: 'pointer',
                          backgroundColor: topLimit === n ? 'var(--admin-surface)' : 'transparent',
                          color: topLimit === n ? 'var(--color-sapphire-700)' : 'var(--text-muted)',
                          boxShadow: topLimit === n ? 'var(--shadow-sm)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View All Link */}
                <Link
                  href="/admin/products"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--color-sapphire-700)',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  View all <ExternalLink size={12} />
                </Link>

                {/* More Menu Dropdown for CSV / PDF Export */}
                <div style={{ position: 'relative' }} ref={tableMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsTableMenuOpen(!isTableMenuOpen)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 'var(--radius-sm)',
                    }}
                    title="Export & options"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {isTableMenuOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: 'var(--admin-surface)',
                      border: '1px solid var(--admin-border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: 'var(--shadow-md)',
                      minWidth: '165px',
                      zIndex: 30,
                      overflow: 'hidden',
                      padding: '4px 0',
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTableMenuOpen(false);
                          const headers = ['ID', 'Item Name', 'Stock Status', 'Units Sold', 'Revenue (INR)', 'Rating', 'Reviews Count', 'Trend % vs Prev Period'];
                          const rows = topItems.map((item) => [
                            item.displayId,
                            `"${item.name.replace(/"/g, '""')}"`,
                            item.stockBadge?.label || 'In Stock',
                            item.units,
                            item.revenue,
                            item.rating.toFixed(1),
                            item.ratingCount,
                            `${item.trendPct >= 0 ? '+' : ''}${item.trendPct}%`,
                          ]);
                          const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                          triggerCsvDownload(csvContent, `aurelia_top_performing_items_${dateRange.start}_to_${dateRange.end}.csv`);
                          showToast('Top Performing Items CSV exported.', 'success');
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: 'var(--admin-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Download size={14} style={{ color: 'var(--color-sapphire-700)' }} />
                        Export as CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTableMenuOpen(false);
                          window.print();
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: 'var(--admin-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Printer size={14} style={{ color: 'var(--color-sapphire-700)' }} />
                        Export as PDF / Print
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr className="admin-table-header">
                  <th style={{ padding: 'var(--space-3) var(--space-3) var(--space-3) 0', width: '90px' }}>
                    ID
                  </th>
                  <th
                    onClick={() => {
                      if (sortField === 'name') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else { setSortField('name'); setSortDirection('asc'); }
                    }}
                    style={{ padding: 'var(--space-3)', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Item Name</span>
                      <ArrowUpDown size={12} style={{ opacity: sortField === 'name' ? 1 : 0.35, color: sortField === 'name' ? 'var(--color-sapphire-700)' : 'inherit' }} />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortField === 'units') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else { setSortField('units'); setSortDirection('desc'); }
                    }}
                    style={{ padding: 'var(--space-3)', cursor: 'pointer', userSelect: 'none', width: '110px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Units Sold</span>
                      <ArrowUpDown size={12} style={{ opacity: sortField === 'units' ? 1 : 0.35, color: sortField === 'units' ? 'var(--color-sapphire-700)' : 'inherit' }} />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortField === 'revenue') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else { setSortField('revenue'); setSortDirection('desc'); }
                    }}
                    style={{ padding: 'var(--space-3)', cursor: 'pointer', userSelect: 'none', width: '160px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Revenue</span>
                      <ArrowUpDown size={12} style={{ opacity: sortField === 'revenue' ? 1 : 0.35, color: sortField === 'revenue' ? 'var(--color-sapphire-700)' : 'inherit' }} />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      if (sortField === 'rating') setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
                      else { setSortField('rating'); setSortDirection('desc'); }
                    }}
                    style={{ padding: 'var(--space-3)', cursor: 'pointer', userSelect: 'none', width: '110px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Rating</span>
                      <ArrowUpDown size={12} style={{ opacity: sortField === 'rating' ? 1 : 0.35, color: sortField === 'rating' ? 'var(--color-sapphire-700)' : 'inherit' }} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  // Skeleton on load
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="admin-table-row">
                      <td style={{ padding: 'var(--space-4) 0' }}>
                        <div style={{ width: '60px', height: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                      </td>
                      <td style={{ padding: 'var(--space-4) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', opacity: 0.6 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ width: '140px', height: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                          <div style={{ width: '90px', height: '10px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                        <div style={{ width: '50px', height: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                      </td>
                      <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                        <div style={{ width: '80px', height: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                      </td>
                      <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                        <div style={{ width: '45px', height: '14px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.6 }} />
                      </td>
                    </tr>
                  ))
                ) : topItems.length === 0 ? (
                  // Empty state
                  <tr>
                    <td colSpan={5} style={{ padding: 'var(--space-8) 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                      <ShoppingBag size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.35, display: 'block' }} />
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        No commissions in this period
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {selectedWeekday !== null
                          ? `No client pieces were ordered on ${WEEKDAY_FULL_NAMES[selectedWeekday]}s within the selected date range.`
                          : 'Try expanding your date range filter above to review prior commission activity.'}
                      </p>
                      {selectedWeekday !== null && (
                        <button
                          type="button"
                          onClick={() => setSelectedWeekday(null)}
                          style={{
                            marginTop: 'var(--space-3)',
                            padding: '4px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            border: '1px solid var(--admin-border)',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: 'var(--admin-surface)',
                            color: 'var(--color-sapphire-700)',
                            cursor: 'pointer',
                          }}
                        >
                          Clear weekday filter
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  topItems.map((item) => (
                    <tr
                      key={item.id}
                      className="admin-table-row"
                      onClick={() => router.push(`/admin/products/${item.id}/edit`)}
                      style={{ cursor: 'pointer', transition: 'background-color 0.15s ease' }}
                    >
                      {/* ID Column with direct link */}
                      <td style={{ padding: 'var(--space-4) 0', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
                        <Link
                          href={`/admin/products/${item.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            color: 'var(--color-sapphire-700)',
                            textDecoration: 'none',
                            fontWeight: 600,
                          }}
                        >
                          {item.displayId}
                        </Link>
                      </td>

                      {/* Item Name + Stock Badge + Subtitle */}
                      <td style={{ padding: 'var(--space-4) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                              {item.name}
                            </span>
                            {/* Stock Badge */}
                            {item.stockBadge && (
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 600,
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: item.stockBadge.type === 'out' ? 'var(--color-error-bg)' : 'var(--color-warning-bg)',
                                color: item.stockBadge.type === 'out' ? 'var(--color-error)' : 'var(--color-warning)',
                                border: `1px solid ${item.stockBadge.type === 'out' ? 'rgba(176, 0, 32, 0.25)' : 'rgba(138, 100, 31, 0.25)'}`,
                                whiteSpace: 'nowrap',
                              }}>
                                {item.stockBadge.label}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Units Sold */}
                      <td style={{ padding: 'var(--space-4) var(--space-3)', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                        {item.units} sold
                      </td>

                      {/* Revenue + Trend Arrow + Revenue Share Bar */}
                      <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--admin-text-primary)' }}>
                              {formatPrice(item.revenue)}
                            </span>
                            {/* Trend Arrow vs Previous Period */}
                            <span
                              title={`${item.trendPct >= 0 ? '+' : ''}${item.trendPct}% vs. previous period`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                color: item.trendPct > 0 ? 'var(--color-success)' : item.trendPct < 0 ? 'var(--color-error)' : 'var(--text-muted)',
                              }}
                            >
                              {item.trendPct > 0 ? (
                                <TrendingUp size={11} />
                              ) : item.trendPct < 0 ? (
                                <TrendingDown size={11} />
                              ) : null}
                              {item.trendPct > 0 ? `+${item.trendPct}%` : item.trendPct < 0 ? `${item.trendPct}%` : '0%'}
                            </span>
                          </div>
                          {/* Revenue Share Bar */}
                          <div
                            title={`${item.sharePct}% of top revenue in table`}
                            style={{
                              height: '3px',
                              backgroundColor: 'var(--overlay-sapphire-10)',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              marginTop: '5px',
                              width: '120px',
                            }}
                          >
                            <div
                              style={{
                                height: '100%',
                                width: `${item.sharePct}%`,
                                backgroundColor: 'var(--color-sapphire-700)',
                                borderRadius: '2px',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Rating with approved reviews count on hover */}
                      <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                        <div
                          title={`${item.rating.toFixed(1)} / 5 stars based on ${item.ratingCount} approved reviews`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'help',
                            fontSize: '0.88rem',
                            fontWeight: 500,
                            color: 'var(--admin-text-primary)',
                          }}
                        >
                          <span style={{ color: 'var(--color-golden-500)' }}>★</span>
                          <span>{item.rating.toFixed(1)}</span>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            ({item.ratingCount})
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
