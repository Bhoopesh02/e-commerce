'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'outline' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  style,
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-pill)',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: size === 'sm' ? 'var(--badge-font-size-sm, 0.68rem)' : 'var(--badge-font-size-md, 0.78rem)',
    padding: size === 'sm' ? 'var(--badge-padding-sm, 3px 10px)' : 'var(--badge-padding-md, 5px 14px)',
    letterSpacing: 'var(--badge-letter-spacing, 0.06em)',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    wordBreak: 'keep-all',
    flexShrink: 0,
    ...style,
  };

  let variantStyle: React.CSSProperties = {};

  switch (variant) {
    case 'default':
      variantStyle = {
        backgroundColor: 'var(--bg-subtle)',
        color: 'var(--brand-primary)',
      };
      break;
    case 'gold':
      variantStyle = {
        backgroundColor: 'var(--border-accent)',
        color: 'var(--brand-accent-hover)',
        border: '1px solid var(--border-accent)',
      };
      break;
    case 'outline':
      variantStyle = {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-color)',
      };
      break;
    case 'success':
      variantStyle = {
        backgroundColor: 'var(--color-success-bg)',
        color: 'var(--color-success)',
      };
      break;
    case 'warning':
      variantStyle = {
        backgroundColor: 'var(--color-warning-bg)',
        color: 'var(--color-warning)',
      };
      break;
    case 'danger':
      variantStyle = {
        backgroundColor: 'var(--color-error-bg)',
        color: 'var(--color-error)',
      };
      break;
  }

  return (
    <>
      <span style={{ ...baseStyle, ...variantStyle }} className={`badge badge-${size} ${className}`}>
        {children}
      </span>
      <style jsx global>{`
        :root {
          --badge-font-size-sm: 0.68rem;
          --badge-padding-sm: 3px 10px;
          --badge-font-size-md: 0.78rem;
          --badge-padding-md: 5px 14px;
          --badge-letter-spacing: 0.06em;
        }

        @media (max-width: 1024px) {
          :root {
            --badge-font-size-sm: 0.62rem;
            --badge-padding-sm: 2.5px 8px;
            --badge-font-size-md: 0.72rem;
            --badge-padding-md: 4px 12px;
            --badge-letter-spacing: 0.05em;
          }
          .badge {
            white-space: nowrap !important;
            word-break: keep-all !important;
            flex-shrink: 0 !important;
          }
          .badge-sm {
            font-size: var(--badge-font-size-sm) !important;
            padding: var(--badge-padding-sm) !important;
          }
          .badge-md {
            font-size: var(--badge-font-size-md) !important;
            padding: var(--badge-padding-md) !important;
          }
        }

        @media (max-width: 768px) {
          :root {
            --badge-font-size-sm: 0.58rem;
            --badge-padding-sm: 2px 7px;
            --badge-font-size-md: 0.66rem;
            --badge-padding-md: 3px 10px;
            --badge-letter-spacing: 0.04em;
          }
          .badge {
            white-space: nowrap !important;
            word-break: keep-all !important;
            flex-shrink: 0 !important;
          }
          .badge-sm {
            font-size: var(--badge-font-size-sm) !important;
            padding: var(--badge-padding-sm) !important;
          }
          .badge-md {
            font-size: var(--badge-font-size-md) !important;
            padding: var(--badge-padding-md) !important;
          }
        }

        @media (max-width: 480px) {
          :root {
            --badge-font-size-sm: 0.52rem;
            --badge-padding-sm: 2px 5.5px;
            --badge-font-size-md: 0.60rem;
            --badge-padding-md: 2.5px 8px;
            --badge-letter-spacing: 0.03em;
          }
          .badge {
            white-space: nowrap !important;
            word-break: keep-all !important;
            flex-shrink: 0 !important;
          }
          .badge-sm {
            font-size: var(--badge-font-size-sm) !important;
            padding: var(--badge-padding-sm) !important;
          }
          .badge-md {
            font-size: var(--badge-font-size-md) !important;
            padding: var(--badge-padding-md) !important;
          }
        }
      `}</style>
    </>
  );
};
