'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { getOrders, getReturns } from '@/lib/mockApi';
import { Order, ReturnRequest } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User,
  Package,
  MapPin,
  Bell,
  LogOut,
  Shield,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const router = useRouter();
  const { user, role, logout, loginAsAdmin } = useAuthStore();
  const { showToast } = useToastStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'returns' | 'notifications'>('orders');

  // Email notifications strictly only per specification
  const [emailOrderUpdates, setEmailOrderUpdates] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);
  const [emailJournal, setEmailJournal] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      const [orderList, returnList] = await Promise.all([
        getOrders(user?.id || 'usr_001'),
        getReturns(user?.id || 'usr_001'),
      ]);
      setOrders(orderList);
      setReturns(returnList);
    }
    loadAccountData();
  }, [user]);

  const handleLogout = () => {
    logout();
    showToast('Signed out of Aurelia Atelier.', 'info');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'Shipped':
        return <Badge variant="gold">Shipped</Badge>;
      case 'Packed':
      case 'Confirmed':
      case 'Placed':
        return <Badge variant="warning">{status}</Badge>;
      case 'Cancelled':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Account Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '40px',
            paddingBottom: '28px',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sunset-600)' }}>
              Private Client Portfolio
            </span>
            <h1 style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)' }}>
              {user?.name || 'Ayesha Rahman'}
            </h1>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Client ID: {user?.id || 'usr_001'} · {user?.email || 'ayesha@example.com'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                loginAsAdmin();
                showToast('Authorized as Operations Admin (Demo Shortcut)', 'success');
                router.push('/admin/dashboard');
              }}
              leftIcon={<Shield size={14} />}
            >
              Switch to Admin Portal
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} leftIcon={<LogOut size={14} />}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '32px',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'orders' ? 'var(--color-sunset-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'orders' ? '2px solid var(--color-sunset-700)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Package size={16} /> Commission History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            style={{
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'addresses' ? 'var(--color-sunset-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'addresses' ? '2px solid var(--color-sunset-700)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <MapPin size={16} /> Residences & Addresses
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            style={{
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'returns' ? 'var(--color-sunset-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'returns' ? '2px solid var(--color-sunset-700)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Clock size={16} /> Returns & Exchanges ({returns.length})
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            style={{
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: activeTab === 'notifications' ? 'var(--color-sunset-700)' : 'var(--text-muted)',
              borderBottom: activeTab === 'notifications' ? '2px solid var(--color-sunset-700)' : '2px solid transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Bell size={16} /> Email Dispatches
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    borderBottom: '1px solid var(--border-light)',
                    paddingBottom: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                      Commission #{order.id}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Registered on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                {/* Items preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.92rem' }}>
                        {item.quantity}x {item.productName || 'Garment'} ({item.size})
                      </span>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Footer */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount</span>
                    <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--color-sunset-700)' }}>
                      {formatPrice(order.totals.total)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href={`/account/orders/${order.id}`}>
                      <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
                        View Order Details & Timeline
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Addresses */}
        {activeTab === 'addresses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {user?.addresses?.map((addr) => (
              <div
                key={addr.id}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  position: 'relative',
                }}
              >
                {addr.isDefault && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <Badge variant="gold">Primary Residence</Badge>
                  </div>
                )}
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>
                  {addr.name || user.name}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {addr.line1}
                  <br />
                  {addr.city}, {addr.state} — {addr.pincode}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {addr.phone || user.phone}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Returns */}
        {activeTab === 'returns' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {returns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                <p style={{ color: 'var(--text-muted)' }}>No return requests initiated.</p>
              </div>
            ) : (
              returns.map((ret) => (
                <div
                  key={ret.id}
                  style={{
                    padding: '20px 24px',
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reference: #{ret.id}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Commission #{ret.orderId}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Reason: {ret.reason}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Badge variant="warning">{ret.status}</Badge>
                    <Link href={`/account/returns/${ret.id}`}>
                      <Button variant="outline" size="sm">
                        View Status
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Email Notifications (Strictly email only per specification) */}
        {activeTab === 'notifications' && (
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              padding: '32px',
              maxWidth: '680px',
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              Atelier Correspondence Channels
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              In accordance with house privacy tenets, all communications are dispatched exclusively to your registered Gmail / Email address. We never dispatch SMS, WhatsApp, or unsolicited push alerts.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                    Commission & Delivery Dossiers
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Tracking updates, status changes, and physical delivery signatures.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailOrderUpdates}
                  onChange={(e) => setEmailOrderUpdates(e.target.checked)}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                    Private Client Privileges
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Seasonal courtesy codes and private preview invitations.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailPromotions}
                  onChange={(e) => setEmailPromotions(e.target.checked)}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
                <div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                    The Aurelia Journal
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Quarterly essays on tailoring provenance and material science.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailJournal}
                  onChange={(e) => setEmailJournal(e.target.checked)}
                />
              </label>
            </div>

            <Button
              variant="primary"
              size="sm"
              style={{ marginTop: '24px' }}
              onClick={() => showToast('Email correspondence preferences updated.', 'success')}
            >
              Save Preferences
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
