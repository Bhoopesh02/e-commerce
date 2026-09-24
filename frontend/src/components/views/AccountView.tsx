'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { getOrders, getReturns } from '@/lib/mockApi';
import { Order, ReturnRequest } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import {
  ArrowRight
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { showToast } = useToastStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'returns' | 'preferences' | 'profile'>('overview');

  // Email notifications
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
    router.push('/signout');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return { bg: 'rgba(102, 37, 73, 0.08)', text: '#662549' };
      case 'Shipped':
      case 'Out for Delivery':
        return { bg: 'rgba(243, 159, 90, 0.1)', text: '#B2621C' };
      case 'Placed':
      case 'Confirmed':
      case 'Packed':
        return { bg: '#F8F9FA', text: '#1D1A39' };
      case 'Cancelled':
        return { bg: 'rgba(174, 68, 90, 0.08)', text: '#AE445A' };
      default:
        return { bg: '#F8F9FA', text: '#1D1A39' };
    }
  };

  const activeOrdersCount = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="account-section fade-in">
            <h2 className="section-title">Overview</h2>
            <div className="overview-grid">
              <div className="overview-block" onClick={() => setActiveTab('orders')}>
                <span className="overview-label">ORDERS</span>
                <span className="overview-number">{orders.length}</span>
                <div className="overview-action">View order history <ArrowRight size={14} /></div>
              </div>
              <div className="overview-block" onClick={() => setActiveTab('orders')}>
                <span className="overview-label">ACTIVE ORDERS</span>
                <span className="overview-number">{activeOrdersCount}</span>
                <div className="overview-action">Track current orders <ArrowRight size={14} /></div>
              </div>
              <div className="overview-block" onClick={() => setActiveTab('returns')}>
                <span className="overview-label">RETURNS</span>
                <span className="overview-number">{returns.length}</span>
                <div className="overview-action">View returns <ArrowRight size={14} /></div>
              </div>
              <div className="overview-block" onClick={() => setActiveTab('addresses')}>
                <span className="overview-label">ADDRESSES</span>
                <span className="overview-number">{user?.addresses?.length || 0}</span>
                <div className="overview-action">Manage addresses <ArrowRight size={14} /></div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="account-section fade-in">
            <h2 className="section-title">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="empty-text">You have no orders yet.</p>
            ) : (
              <div className="list-container">
                {orders.map((order) => {
                  const statusColors = getStatusColor(order.status);
                  const firstItem = order.items[0];
                  const additionalItems = order.items.length - 1;

                  return (
                    <div key={order.id} className="list-row">
                      <div className="row-col col-left">
                        <span className="row-title">ORDER #{order.id}</span>
                        <span className="row-meta">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="status-pill" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                          {order.status}
                        </span>
                      </div>
                      <div className="row-col col-center">
                        <span className="product-title">{firstItem?.productName || 'Garment'}</span>
                        <span className="product-meta">Size {firstItem?.size || 'Standard'}</span>
                        {additionalItems > 0 && (
                          <span className="product-meta">+{additionalItems} more item{additionalItems > 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <div className="row-col col-right">
                        <span className="amount">{formatPrice(order.totals.total)}</span>
                        <Link href={`/account/orders/${order.id}`} className="text-action">
                          View details <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      case 'addresses':
        return (
          <div className="account-section fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: '8px' }}>Addresses</h2>
                <p className="section-subtitle">Manage your saved delivery addresses.</p>
              </div>
            </div>
            
            <div className="addresses-grid">
              {user?.addresses?.map((addr) => (
                <div key={addr.id} className="address-card">
                  {addr.isDefault && <span className="default-label">DEFAULT ADDRESS</span>}
                  <div className="address-content">
                    <span className="address-name">{addr.name || user.name}</span>
                    <span className="address-line">{addr.line1}</span>
                    <span className="address-line">{addr.city}, {addr.state}</span>
                    <span className="address-line">{addr.pincode}</span>
                  </div>
                  <div className="address-actions">
                    <button className="text-action-sm">Edit <ArrowRight size={12}/></button>
                    <button className="text-action-sm">Remove <ArrowRight size={12}/></button>
                  </div>
                </div>
              ))}
              <div className="address-card new-address-card">
                <button className="text-action">Add New Address +</button>
              </div>
            </div>
          </div>
        );
      case 'returns':
        return (
          <div className="account-section fade-in">
            <h2 className="section-title">Returns & Exchanges</h2>
            {returns.length === 0 ? (
              <p className="empty-text">No returns or exchanges at the moment.</p>
            ) : (
              <div className="list-container">
                {returns.map((ret) => {
                   const order = orders.find(o => o.id === ret.orderId);
                   const firstItem = order?.items[0];
                   return (
                     <div key={ret.id} className="list-row">
                       <div className="row-col col-left">
                         <span className="row-title">Return #{ret.id}</span>
                         <span className="row-meta">Order #{ret.orderId}</span>
                         <span className="row-meta">
                           {new Date(ret.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                         </span>
                       </div>
                       <div className="row-col col-center">
                         <span className="product-title">{firstItem?.productName || 'Item'}</span>
                         <span className="product-meta">Reason: {ret.reason}</span>
                       </div>
                       <div className="row-col col-right">
                         <span className="status-meta">Status: <br/>{ret.status}</span>
                         <Link href={`/account/returns/${ret.id}`} className="text-action">
                           View Details <ArrowRight size={14} />
                         </Link>
                       </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        );
      case 'preferences':
        return (
          <div className="account-section fade-in">
            <h2 className="section-title" style={{ marginBottom: '8px' }}>Email Preferences</h2>
            <p className="section-subtitle">Choose the types of emails you'd like to receive from Aurelia.</p>
            
            <div className="toggle-list">
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Order updates</span>
                  <span className="toggle-desc">Shipping and delivery updates</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={emailOrderUpdates} onChange={(e) => setEmailOrderUpdates(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">Promotions</span>
                  <span className="toggle-desc">Exclusive offers and promotions</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={emailPromotions} onChange={(e) => setEmailPromotions(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <div className="toggle-info">
                  <span className="toggle-title">New collections</span>
                  <span className="toggle-desc">Updates about new arrivals and collections</span>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={emailJournal} onChange={(e) => setEmailJournal(e.target.checked)} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <div style={{ marginTop: '32px' }}>
              <button 
                className="btn-primary"
                onClick={() => showToast('Preferences updated', 'success')}
              >
                Save Preferences
              </button>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="account-section fade-in">
            <h2 className="section-title">Profile Settings</h2>
            
            <div className="settings-group">
              <div className="settings-header">
                <h3 className="settings-subtitle">Personal Information</h3>
              </div>
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Full Name</span>
                  <span className="settings-value">{user?.name || 'Ayesha Rahman'}</span>
                </div>
                <button className="text-action-sm">Edit</button>
              </div>
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Email Address</span>
                  <span className="settings-value">{user?.email || 'ayesha@example.com'}</span>
                </div>
                <button className="text-action-sm">Edit</button>
              </div>
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Phone Number</span>
                  <span className="settings-value">{user?.phone || '+91 98765 43210'}</span>
                </div>
                <button className="text-action-sm">Edit</button>
              </div>
            </div>

            <div className="settings-group" style={{ marginTop: '48px' }}>
              <div className="settings-header">
                <h3 className="settings-subtitle">Password</h3>
              </div>
              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Password</span>
                  <span className="settings-value">••••••••</span>
                </div>
                <button className="text-action-sm">Change Password</button>
              </div>
            </div>
          </div>
        );
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'returns', label: 'Returns & Exchanges' },
    { id: 'preferences', label: 'Email Preferences' },
    { id: 'profile', label: 'Profile Settings' },
  ] as const;

  return (
    <div className="account-page">
      <div className="container account-container">
        {/* Left Sidebar */}
        <aside className="account-sidebar">
          <div className="sidebar-profile">
            <h1 className="profile-name">{user?.name || 'Ayesha Rahman'}</h1>
            <p className="profile-email">{user?.email || 'ayesha@example.com'}</p>
          </div>
          
          <nav className="account-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
          
          <div className="sidebar-footer">
            <button className="signout-link" onClick={handleLogout}>
              Sign Out <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        {/* Right Content */}
        <main className="account-content">
          <div className="content-header">
            <h1 className="page-heading">My Account</h1>
            <p className="page-subheading">Manage your orders, addresses and account preferences.</p>
          </div>
          
          {renderContent()}

          <div className="mobile-signout">
             <button className="signout-link" onClick={handleLogout}>
              Sign Out <ArrowRight size={14} />
            </button>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .account-page {
          padding-top: 80px;
          padding-bottom: 80px;
          min-height: 100vh;
          background-color: #fff;
          color: #1D1A39;
        }
        
        .account-container {
          max-width: 1024px;
          margin: 0 auto;
          display: flex;
          gap: 48px;
        }

        /* Sidebar Styles */
        .account-sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        
        .sidebar-profile {
          margin-bottom: 48px;
        }
        
        .profile-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 400;
          margin-bottom: 4px;
          color: #1D1A39;
        }
        
        .profile-email {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .account-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        .nav-item {
          text-align: left;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          color: #1D1A39;
          opacity: 0.6;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
          width: fit-content;
        }
        
        .nav-item:hover {
          opacity: 1;
        }
        
        .nav-item.active {
          opacity: 1;
          font-weight: 500;
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #1D1A39;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-item.active::after,
        .nav-item:hover::after {
          transform: scaleX(1);
        }
        
        .sidebar-footer {
          padding-top: 32px;
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .signout-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          color: #1D1A39;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        
        .signout-link:hover {
          opacity: 1;
        }
        
        .signout-link svg {
          transition: transform 0.2s ease;
        }
        
        .signout-link:hover svg {
          transform: translateX(4px);
        }

        /* Content Styles */
        .account-content {
          flex: 1;
          min-width: 0;
        }
        
        .content-header {
          margin-bottom: 32px;
          display: none;
        }
        
        @media (min-width: 769px) {
          .content-header {
            display: block;
          }
        }
        
        .page-heading {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 400;
          margin-bottom: 8px;
          color: #1D1A39;
        }
        
        .page-subheading {
          font-size: 0.95rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          margin-bottom: 24px;
          color: #1D1A39;
        }
        
        .section-subtitle {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
          margin-bottom: 32px;
        }

        /* Overview Grid */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }
        
        .overview-block {
          padding: 32px 24px;
          border: 1px solid rgba(29, 26, 57, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .overview-block:hover {
          border-color: rgba(29, 26, 57, 0.3);
        }
        
        .overview-block:hover .overview-action {
          opacity: 1;
        }
        
        .overview-block:hover .overview-action svg {
          transform: translateX(4px);
        }
        
        .overview-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(29, 26, 57, 0.6);
          margin-bottom: 16px;
        }
        
        .overview-number {
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin-bottom: 24px;
          color: #1D1A39;
        }
        
        .overview-action {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
          transition: all 0.3s ease;
          margin-top: auto;
        }
        
        .overview-action svg {
          transition: transform 0.3s ease;
        }

        /* List Rows (Orders, Returns) */
        .list-container {
          display: flex;
          flex-direction: column;
        }
        
        .list-row {
          display: flex;
          justify-content: space-between;
          padding: 32px 0;
          border-bottom: 1px solid rgba(29, 26, 57, 0.1);
          transition: background-color 0.3s ease;
        }
        
        .list-row:first-child {
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .row-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .col-left {
          flex: 1;
        }
        
        .col-center {
          flex: 1.5;
        }
        
        .col-right {
          flex: 1;
          align-items: flex-end;
          text-align: right;
        }
        
        .row-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        .row-meta {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .status-pill {
          display: inline-block;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 10px;
          border-radius: 100px;
          width: fit-content;
          margin-top: 8px;
          font-weight: 500;
        }
        
        .product-title {
          font-size: 1rem;
          color: #1D1A39;
        }
        
        .product-meta {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .amount {
          font-size: 1.05rem;
          margin-bottom: auto;
        }
        
        .status-meta {
          font-size: 0.85rem;
          color: rgba(29, 26, 57, 0.6);
          margin-bottom: auto;
        }
        
        .text-action {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          color: #1D1A39;
          text-decoration: none;
          transition: opacity 0.2s ease;
          opacity: 0.8;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .text-action:hover {
          opacity: 1;
        }
        
        .text-action svg {
          transition: transform 0.2s ease;
        }
        
        .text-action:hover svg {
          transform: translateX(4px);
        }
        
        .text-action-sm {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(29, 26, 57, 0.7);
          text-decoration: none;
          transition: opacity 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .text-action-sm:hover {
          opacity: 1;
          color: #1D1A39;
        }

        /* Addresses */
        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        
        .address-card {
          padding: 32px 24px;
          border: 1px solid rgba(29, 26, 57, 0.1);
          display: flex;
          flex-direction: column;
          position: relative;
        }
        
        .default-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #662549;
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .address-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }
        
        .address-name {
          font-weight: 500;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        
        .address-line {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.7);
        }
        
        .address-actions {
          margin-top: auto;
          display: flex;
          gap: 16px;
        }
        
        .new-address-card {
          border: 1px dashed rgba(29, 26, 57, 0.2);
          align-items: center;
          justify-content: center;
          background-color: rgba(29, 26, 57, 0.01);
          transition: background-color 0.2s ease;
        }
        
        .new-address-card:hover {
          background-color: rgba(29, 26, 57, 0.03);
        }

        /* Toggles */
        .toggle-list {
          display: flex;
          flex-direction: column;
        }
        
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .toggle-row:first-child {
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .toggle-title {
          font-size: 1rem;
        }
        
        .toggle-desc {
          font-size: 0.85rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        /* Switch */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }
        
        .switch input { 
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(29, 26, 57, 0.2);
          transition: .3s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }
        
        input:checked + .slider {
          background-color: #1D1A39;
        }
        
        input:focus + .slider {
          box-shadow: 0 0 1px #1D1A39;
        }
        
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }

        /* Profile Settings */
        .settings-group {
          margin-bottom: 32px;
        }
        
        .settings-header {
          margin-bottom: 16px;
        }
        
        .settings-subtitle {
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .settings-row:first-of-type {
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .settings-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .settings-label {
          font-size: 0.8rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .settings-value {
          font-size: 1rem;
        }

        .btn-primary {
          background-color: #1D1A39;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          border-radius: var(--radius-sm, 4px);
        }
        
        .btn-primary:hover {
          background-color: #451952;
        }

        .empty-text {
          font-size: 0.95rem;
          color: rgba(29, 26, 57, 0.6);
          padding: 32px 0;
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .mobile-signout {
          display: none;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(29, 26, 57, 0.1);
          justify-content: flex-start;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
          .account-container {
            flex-direction: column;
            gap: 32px;
          }
          
          .account-sidebar {
            width: 100%;
          }
          
          .sidebar-profile {
            margin-bottom: 24px;
            text-align: left;
          }
          
          .account-nav {
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 16px;
            margin-bottom: 16px;
            gap: 24px;
            border-bottom: 1px solid rgba(29, 26, 57, 0.1);
            scrollbar-width: none;
          }
          
          .account-nav::-webkit-scrollbar {
            display: none;
          }
          
          .nav-item {
            white-space: nowrap;
          }
          
          .sidebar-footer {
            display: none;
          }
          
          .mobile-signout {
            display: flex;
          }
          
          .list-row {
            flex-direction: column;
            gap: 16px;
          }
          
          .col-center, .col-right {
            text-align: left;
            align-items: flex-start;
          }
          
          .col-right {
            margin-top: 8px;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }
          
          .amount {
            margin-bottom: 0;
          }
          
          .content-header {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
