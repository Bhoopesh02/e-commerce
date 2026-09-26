import React from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { formatPrice } from '@/lib/formatPrice';
import { ArrowRight } from 'lucide-react';

export const getStatusColor = (status: string) => {
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

interface OrderRowProps {
  order: Order;
}

export const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const statusColors = getStatusColor(order.status);
  const firstItem = order.items[0];
  const additionalItems = order.items.length - 1;

  return (
    <div className="list-row">
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
        <span className="product-meta">
          Size {firstItem?.size || 'Standard'} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
        </span>
        {additionalItems > 0 && (
          <span className="product-meta">+{additionalItems} more item{additionalItems > 1 ? 's' : ''}</span>
        )}
      </div>
      <div className="row-col col-right">
        <span className="amount">{formatPrice(order.totals.total)}</span>
        <Link href={`/account/orders/${order.id}`} style={{ textDecoration: 'none' }}>
          <div className="text-action">
            <span className="action-text">View details</span> <span className="arrow-icon"><ArrowRight size={14} /></span>
          </div>
        </Link>
      </div>

      <style jsx>{`
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
        
        @media (max-width: 640px) {
          .list-row {
            flex-direction: column;
            gap: 16px;
            padding: 24px 0;
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
            flex-direction: row;
            justify-content: space-between;
            margin-top: 8px;
          }
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
        
        @media (max-width: 640px) {
          .amount {
            margin-bottom: 0;
          }
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
};
