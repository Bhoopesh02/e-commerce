'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
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
    // Standardized luxury button dimensions: identical heights, vertical padding, and font scales
    const sizeConfig = {
      sm: {
        height: '36px',
        padding: '0 18px',
        fontSize: '0.75rem',
      },
      md: {
        height: '44px',
        padding: '0 24px',
        fontSize: '0.85rem',
      },
      lg: {
        height: '52px',
        padding: '0 32px',
        fontSize: '0.95rem',
      },
    };

    const currentSize = sizeConfig[size] || sizeConfig.md;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      borderRadius: 'var(--radius-pill)',
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      fontSize: currentSize.fontSize,
      height: currentSize.height,
      minHeight: currentSize.height,
      padding: currentSize.padding,
      lineHeight: 1,
      boxSizing: 'border-box',
      whiteSpace: 'nowrap',
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
          borderColor: 'transparent',
          boxShadow: 'var(--shadow-sm)',
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: 'var(--surface-brand-dark)',
          color: 'var(--text-inverse)',
          borderColor: 'transparent',
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
          borderColor: 'transparent',
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: 'var(--color-error)',
          color: 'var(--color-white)',
          borderColor: 'transparent',
        };
        break;
      case 'white':
        variantStyle = {
          backgroundColor: 'var(--bg-primary)',
          color: "var(--text-primary)",
          borderColor: 'var(--color-diamond)',
          boxShadow: 'var(--shadow-sm)',
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
            {leftIcon && <span className="luxury-btn-icon luxury-btn-icon-left">{leftIcon}</span>}
            <span className="luxury-btn-label">{children}</span>
            {rightIcon && <span className="luxury-btn-icon luxury-btn-icon-right">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
