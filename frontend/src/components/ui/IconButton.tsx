'use client';

import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'filled';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, label, size = 'md', variant = 'ghost', style, className = '', ...props }, ref) => {
    const dim = size === 'sm' ? 36 : size === 'lg' ? 48 : 42;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dim,
      height: dim,
      borderRadius: 'var(--radius-pill)',
      color: 'var(--text-primary)',
      transition: 'all var(--duration-fast) var(--ease-editorial)',
      cursor: 'pointer',
      border: variant === 'outline' ? '1px solid var(--border-color)' : 'none',
      backgroundColor: variant === 'filled' ? 'var(--bg-surface)' : 'transparent',
      ...style,
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        style={baseStyle}
        className={`icon-btn ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
