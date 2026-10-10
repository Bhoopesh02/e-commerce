'use client';

import React from 'react';
import { StatusHistoryItem, OrderStatus } from '@/types';
import { CheckCircle2, Clock, Package, Truck, Home, XCircle } from 'lucide-react';

export interface StatusTimelineProps {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryItem[];
}

const ORDER_STEPS: OrderStatus[] = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

export const StatusTimeline: React.FC<StatusTimelineProps> = ({
  currentStatus,
  statusHistory,
}) => {
  const isCancelled = currentStatus === 'Cancelled';

  const getIcon = (status: OrderStatus) => {
    switch (status) {
      case 'Placed':
        return <Clock size={16} />;
      case 'Confirmed':
        return <CheckCircle2 size={16} />;
      case 'Packed':
        return <Package size={16} />;
      case 'Shipped':
        return <Truck size={16} />;
      case 'Delivered':
        return <Home size={16} />;
      case 'Cancelled':
        return <XCircle size={16} />;
    }
  };

  const getStepTimestamp = (status: OrderStatus) => {
    const entry = statusHistory.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCancelled) {
    const cancelEntry = statusHistory.find((h) => h.status === 'Cancelled');
    return (
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--color-error-bg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-error)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--color-error)',
        }}
      >
        <XCircle size={24} />
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-error)' }}>
            Order Cancelled
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-error)', opacity: 0.85 }}>
            {cancelEntry?.note || 'This order has been cancelled.'}{' '}
            {cancelEntry && `on ${getStepTimestamp('Cancelled')}`}
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(currentStatus);

  return (
    <div className="status-timeline-wrapper" style={{ width: '100%', padding: '16px 0' }}>
      {/* Desktop Horizontal Stepper (>600px) */}
      <div
        className="timeline-desktop"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background track line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            right: '20px',
            height: '2px',
            backgroundColor: 'var(--border-color)',
            zIndex: 1,
          }}
        />

        {/* Completed active progress line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '20px',
            width: `${Math.min(100, (Math.max(0, currentStepIndex) / (ORDER_STEPS.length - 1)) * 100)}%`,
            height: '2px',
            backgroundColor: 'var(--cta-primary)',
            zIndex: 2,
            transition: 'width var(--duration-medium) var(--ease-editorial)',
          }}
        />

        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const timestamp = getStepTimestamp(step);

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
                width: '70px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isCompleted
                    ? 'var(--cta-primary)'
                    : 'var(--bg-surface)',
                  color: isCompleted ? 'var(--cta-text)' : 'var(--text-muted)',
                  border: `2px solid ${
                    isCompleted ? 'var(--cta-primary)' : 'var(--border-color)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all var(--duration-normal) var(--ease-editorial)',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(194, 155, 76, 0.25)' : 'none',
                }}
              >
                {getIcon(step)}
              </div>

              <span
                style={{
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  fontWeight: isCurrent ? 600 : 500,
                  color: isCompleted ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {step}
              </span>

              {timestamp && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    lineHeight: 1.1,
                  }}
                >
                  {timestamp}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper (<=600px) */}
      <div className="timeline-mobile">
        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          const isLast = idx === ORDER_STEPS.length - 1;
          const isNextCompleted = idx + 1 <= currentStepIndex;
          const timestamp = getStepTimestamp(step);

          return (
            <div key={step} className="timeline-mobile-step">
              <div className="timeline-mobile-indicator">
                <div
                  className="timeline-mobile-icon"
                  style={{
                    backgroundColor: isCompleted ? 'var(--cta-primary)' : 'var(--bg-surface)',
                    color: isCompleted ? 'var(--cta-text)' : 'var(--text-muted)',
                    border: `2px solid ${isCompleted ? 'var(--cta-primary)' : 'var(--border-color)'}`,
                    boxShadow: isCurrent ? '0 0 0 4px rgba(194, 155, 76, 0.25)' : 'none',
                  }}
                >
                  {getIcon(step)}
                </div>
                {!isLast && (
                  <div
                    className={`timeline-mobile-line ${isNextCompleted ? 'completed' : ''}`}
                  />
                )}
              </div>

              <div className="timeline-mobile-content">
                <span className={`timeline-mobile-label ${!isCompleted ? 'pending' : ''}`}>
                  {step}
                </span>
                {timestamp ? (
                  <span className="timeline-mobile-time">{timestamp}</span>
                ) : (
                  <span className="timeline-mobile-time" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                    Pending atelier update
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @media (max-width: 600px) {
          .timeline-desktop {
            display: none !important;
          }
          .timeline-mobile {
            display: flex !important;
            flex-direction: column;
            position: relative;
            padding: 8px 0;
          }
          .timeline-mobile-step {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            position: relative;
            padding-bottom: 24px;
          }
          .timeline-mobile-step:last-child {
            padding-bottom: 4px;
          }
          .timeline-mobile-indicator {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            flex-shrink: 0;
            width: 32px;
          }
          .timeline-mobile-icon {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-pill);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
          }
          .timeline-mobile-line {
            position: absolute;
            top: 32px;
            bottom: -24px;
            width: 2px;
            background-color: var(--border-color);
            z-index: 1;
          }
          .timeline-mobile-line.completed {
            background-color: var(--cta-primary);
          }
          .timeline-mobile-content {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding-top: 3px;
          }
          .timeline-mobile-label {
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
            line-height: 1.2;
          }
          .timeline-mobile-label.pending {
            color: var(--text-muted);
            font-weight: 500;
          }
          .timeline-mobile-time {
            font-size: 0.8rem;
            color: var(--text-muted);
            line-height: 1.3;
          }
        }
        @media (min-width: 601px) {
          .timeline-desktop {
            display: flex !important;
          }
          .timeline-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
