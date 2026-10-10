'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { getOrders, getReturns } from '@/lib/mockApi';
import { Order, ReturnRequest } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function ReturnsPage() {
  const { user } = useAuthStore();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReturns() {
      setLoading(true);
      const [orderList, returnList] = await Promise.all([
        getOrders(user?.id || 'usr_001'),
        getReturns(user?.id || 'usr_001'),
      ]);
      setOrders(orderList);
      setReturns(returnList);
      setLoading(false);
    }
    fetchReturns();
  }, [user]);

  if (loading) {
    return <div className="account-section fade-in"><p>Loading...</p></div>;
  }

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">Returns & Exchanges</h1>
        <p className="page-subheading">Manage your return and exchange requests.</p>
      </div>

      <div className="returns-list">
        {returns.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">NO RETURNS OR EXCHANGES</h3>
            <p className="empty-state-text">You don't have any active return or exchange requests.</p>
            <Link href="/account/orders" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
              View Order History &rarr;
            </Link>
          </div>
        ) : (
          <div className="list-container">
            {returns.map((ret) => {
              const order = orders.find(o => o.id === ret.orderId);
              const firstItem = order?.items[0];
              
              return (
                <div key={ret.id} className="list-row">
                  <div className="row-col col-left">
                    <span className="row-title">RETURN REQUEST</span>
                    <span className="status-meta" style={{ marginTop: '4px' }}>
                      REQUESTED<br/>
                      {new Date(ret.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="row-col col-center">
                    <span className="product-title">{firstItem?.productName || 'Garment'}</span>
                    <span className="product-meta">Reason: {ret.reason}</span>
                  </div>
                  <div className="row-col col-right">
                    <span className="status-label">STATUS</span>
                    <span className="status-value">{ret.status}</span>
                    
                    <Link href={`/account/orders/${ret.orderId}`} style={{ textDecoration: 'none', marginTop: 'auto' }}>
                      <div className="text-action">
                        <span className="action-text">View Details</span> <span className="arrow-icon"><ArrowRight size={14} /></span>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .list-container {
          display: flex;
          flex-direction: column;
        }
        
        .list-row {
          display: flex;
          justify-content: space-between;
          padding: 32px 0;
          border-bottom: 1px solid var(--overlay-black-10);
          transition: background-color 0.3s ease;
        }
        
        .list-row:first-child {
          border-top: 1px solid var(--overlay-black-10);
        }

        @media (max-width: 640px) {
          .list-row {
            flex-direction: column;
            gap: 16px;
            padding: 20px 0;
          }
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

        @media (max-width: 640px) {
          .col-right {
            align-items: flex-start;
            text-align: left;
            margin-top: 4px;
          }
        }
        
        .row-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
        }
        
        .row-meta {
          font-size: 0.85rem;
          color: var(--overlay-black-70);
        }
        
        .status-meta {
          font-size: 0.75rem;
          color: var(--overlay-black-70);
          line-height: 1.5;
        }
        
        .product-title {
          font-size: 1rem;
          color: var(--text-primary);
        }
        
        .product-meta {
          font-size: 0.9rem;
          color: var(--overlay-black-70);
        }
        
        .status-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--overlay-black-50);
        }
        
        .status-value {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .text-action {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
          text-decoration: none;
          transition: opacity 0.2s ease;
          opacity: 0.8;
          cursor: pointer;
        }
        
        .text-action:hover {
          opacity: 1;
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

        .text-action:hover .action-text::after {
          transform: scaleX(1);
          transform-origin: bottom left;
        }

        .arrow-icon {
          display: inline-flex;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .text-action:hover .arrow-icon {
          transform: translateX(6px);
        }
      `}</style>
    </div>
  );
}
