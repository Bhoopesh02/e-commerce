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
        <Link href="/account/orders" style={{ textDecoration: 'none', display: 'block' }}>
          <div className="overview-block">
            <span className="overview-label">ORDERS</span>
            <span className="overview-number">{orders.length}</span>
            <div className="overview-action"><span className="action-text">View order history</span> <span className="arrow-icon"><ArrowRight size={14} /></span></div>
          </div>
        </Link>
        <Link href="/account/orders/tracking" style={{ textDecoration: 'none', display: 'block' }}>
          <div className="overview-block">
            <span className="overview-label">ACTIVE ORDERS</span>
            <span className="overview-number">{activeOrdersCount}</span>
            <div className="overview-action"><span className="action-text">Track current orders</span> <span className="arrow-icon"><ArrowRight size={14} /></span></div>
          </div>
        </Link>
        <Link href="/account/returns" style={{ textDecoration: 'none', display: 'block' }}>
          <div className="overview-block">
            <span className="overview-label">RETURNS</span>
            <span className="overview-number">{returns.length}</span>
            <div className="overview-action"><span className="action-text">View returns</span> <span className="arrow-icon"><ArrowRight size={14} /></span></div>
          </div>
        </Link>
        <Link href="/account/addresses" style={{ textDecoration: 'none', display: 'block' }}>
          <div className="overview-block">
            <span className="overview-label">ADDRESSES</span>
            <span className="overview-number">{user?.addresses?.length || 0}</span>
            <div className="overview-action"><span className="action-text">Manage addresses</span> <span className="arrow-icon"><ArrowRight size={14} /></span></div>
          </div>
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
          border: 1px solid rgba(20, 20, 20, 0.1);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          text-decoration: none;
        }
        
        .overview-block:hover {
          border-color: rgba(20, 20, 20, 0.3);
          background-color: rgba(20, 20, 20, 0.01);
        }
        
        .overview-block:hover .overview-action {
          opacity: 1;
        }
        
        .overview-block:hover .arrow-icon {
          transform: translateX(6px);
        }

        .overview-block:hover .action-text::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }
        
        .overview-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(20, 20, 20, 0.6);
          margin-bottom: 16px;
        }
        
        .overview-number {
          font-family: var(--font-display);
          font-size: 2.5rem;
          margin-bottom: 24px;
          color: var(--color-black-tie);
        }
        
        .overview-action {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
          transition: all 0.3s ease;
          margin-top: auto;
          color: var(--color-black-tie);
        }

        .action-text {
          position: relative;
        }

        .action-text::after {
          content: '';
          position: absolute;
          width: 100%;
          transform: scaleX(0);
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: currentColor;
          transform-origin: bottom right;
          transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
        }
        
        .arrow-icon {
          display: inline-flex;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
