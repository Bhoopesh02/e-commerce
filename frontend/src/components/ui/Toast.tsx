'use client';

import React from 'react';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '420px',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--bg-surface-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'toastSlideUp 400ms var(--ease-luxury)',
          }}
        >
          {toast.type === 'success' && (
            <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
          )}
          {toast.type === 'error' && (
            <AlertCircle size={18} style={{ color: 'var(--color-error)', flexShrink: 0 }} />
          )}
          {toast.type === 'info' && (
            <Info size={18} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
          )}

          <span style={{ fontSize: '0.88rem', fontWeight: 500, flex: 1 }}>
            {toast.message}
          </span>

          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            aria-label="Dismiss toast"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
};
