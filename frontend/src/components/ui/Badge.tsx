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
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontSize: size === 'sm' ? '0.68rem' : '0.78rem',
    padding: size === 'sm' ? '3px 10px' : '5px 14px',
    lineHeight: 1.2,
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
    <span style={{ ...baseStyle, ...variantStyle }} className={`badge ${className}`}>
      {children}
    </span>
  );
};
