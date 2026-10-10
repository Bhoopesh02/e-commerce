'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { getOrders } from '@/lib/mockApi';
import { Order } from '@/types';
import { OrderRow } from '@/components/account/OrderRow';

export default function OrdersPage() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      const data = await getOrders(user?.id || 'usr_001');
      setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  const filteredOrders = orders.filter((order) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return !['Delivered', 'Cancelled'].includes(order.status);
    if (filter === 'DELIVERED') return order.status === 'Delivered';
    if (filter === 'CANCELLED') return order.status === 'Cancelled';
    return true;
  });

  if (loading) {
    return <div className="account-section fade-in"><p>Loading...</p></div>;
  }

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">Orders</h1>
        <p className="page-subheading">View and manage all your Aurelia purchases.</p>
      </div>
      
      <div className="orders-filter">
        {(['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'] as const).map(f => (
          <button 
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">NO ORDER HISTORY</h3>
            <p className="empty-state-text">You haven't completed any purchases yet.</p>
            <Link href="/shop" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              Continue Shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className="list-container">
            {filteredOrders.map(order => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .orders-filter {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--overlay-black-10);
        }
        
        .filter-btn {
          background: none;
          border: none;
          padding: 0 0 12px 0;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--overlay-black-50);
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
        }
        
        .filter-btn:hover {
          color: var(--text-primary);
        }
        
        .filter-btn.active {
          color: var(--text-primary);
          font-weight: 500;
        }
        
        .filter-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--text-primary);
        }
        
        .list-container {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 767px) {
          .orders-filter {
            flex-wrap: wrap;
            row-gap: 8px;
            gap: 16px;
          }
          .filter-btn {
            min-width: 0;
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
