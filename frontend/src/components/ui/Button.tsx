'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      style,
      ...props
    },
    ref
  ) => {
    // Luxury styled button styles using CSS variables
    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      borderRadius: 'var(--radius-pill)',
      fontWeight: 500,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '0.95rem' : '0.85rem',
      padding:
        size === 'sm'
          ? '8px 16px'
          : size === 'lg'
          ? '16px 36px'
          : '12px 26px',
      transition: 'all var(--duration-normal) var(--ease-editorial)',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid transparent',
    };

    let variantStyle: React.CSSProperties = {};

    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: 'var(--cta-primary)',
          color: 'var(--cta-text)',
          boxShadow: 'var(--shadow-sm)',
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: 'var(--color-sunset-900)',
          color: 'var(--color-white)',
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)',
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: 'var(--color-error)',
          color: 'var(--color-white)',
        };
        break;
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={{ ...baseStyle, ...variantStyle, ...style }}
        className={`luxury-btn luxury-btn-${variant} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            {leftIcon && <span>{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
