'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, style, className = '', id, type, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [showPassword, setShowPassword] = useState(false);
    
    const isPasswordType = type === 'password';
    const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

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
            type={inputType}
            style={{
              width: '100%',
              fontSize: '0.92rem',
              color: 'var(--text-primary)',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              ...style,
            }}
            className={className}
            {...props}
          />
          {rightIcon && !isPasswordType && <span style={{ marginLeft: '8px', color: 'var(--text-muted)' }}>{rightIcon}</span>}
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                marginLeft: '8px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                outline: 'none',
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
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

