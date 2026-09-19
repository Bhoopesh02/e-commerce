'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, style, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {label}
          </label>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            border: `1px solid ${error ? 'var(--color-error)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            transition: 'border-color var(--duration-fast) var(--ease-editorial)',
          }}
        >
          {leftIcon && <span style={{ marginRight: '8px', color: 'var(--text-muted)' }}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            style={{
              width: '100%',
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              ...style,
            }}
            className={className}
            {...props}
          />
          {rightIcon && <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>{rightIcon}</span>}
        </div>

        {error && (
          <span style={{ fontSize: '0.78rem', color: 'var(--color-error)', marginTop: '2px' }}>
            {error}
          </span>
        )}

        {helperText && !error && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
