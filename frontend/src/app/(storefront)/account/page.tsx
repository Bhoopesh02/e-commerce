'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { getOrders, getReturns } from '@/lib/mockApi';
import { Order, ReturnRequest } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function AccountOverviewPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccountData() {
      setLoading(true);
      const [orderList, returnList] = await Promise.all([
        getOrders(user?.id || 'usr_001'),
        getReturns(user?.id || 'usr_001'),
      ]);
      setOrders(orderList);
      setReturns(returnList);
      setLoading(false);
    }
    loadAccountData();
  }, [user]);

  const activeOrdersCount = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;

  if (loading) {
    return <div className="account-section fade-in"><p>Loading...</p></div>;
  }

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">My Account</h1>
        <p className="page-subheading">Manage your orders, addresses and account preferences.</p>
      </div>
      
      <h2 className="section-title">Overview</h2>
      <div className="overview-grid">
        <Link href="/account/orders" className="overview-block">
          <span className="overview-label">ORDERS</span>
          <span className="overview-number">{orders.length}</span>
          <div className="overview-action">View order history <ArrowRight size={14} /></div>
        </Link>
        <Link href="/account/orders/tracking" className="overview-block">
          <span className="overview-label">ACTIVE ORDERS</span>
          <span className="overview-number">{activeOrdersCount}</span>
          <div className="overview-action">Track current orders <ArrowRight size={14} /></div>
        </Link>
        <Link href="/account/returns" className="overview-block">
          <span className="overview-label">RETURNS</span>
          <span className="overview-number">{returns.length}</span>
          <div className="overview-action">View returns <ArrowRight size={14} /></div>
        </Link>
        <Link href="/account/addresses" className="overview-block">
          <span className="overview-label">ADDRESSES</span>
          <span className="overview-number">{user?.addresses?.length || 0}</span>
          <div className="overview-action">Manage addresses <ArrowRight size={14} /></div>
        </Link>
      </div>

      <style jsx>{`
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
          text-decoration: none;
        }
        
        .overview-block:hover {
          border-color: rgba(29, 26, 57, 0.3);
          background-color: rgba(29, 26, 57, 0.01);
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
          color: #1D1A39;
        }
        
        .overview-action svg {
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>
  );
}
