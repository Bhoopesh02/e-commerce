'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: string;
  ariaLabel?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '440px',
  ariaLabel,
}) => {
  const generatedId = React.useId();
  const titleId = `drawer-title-${generatedId.replace(/:/g, '')}`;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <div
      role="dialog"
      aria-modal={isOpen}
      aria-hidden={!isOpen}
      aria-labelledby={title ? titleId : undefined}
      aria-label={ariaLabel || (!title ? 'Drawer' : undefined)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(29, 26, 57, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 9998,
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: isOpen
          ? 'opacity 500ms var(--ease-luxury) 50ms'
          : 'opacity 500ms var(--ease-luxury)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: width,
          height: '100%',
          backgroundColor: 'var(--bg-surface)',
          borderLeft: position === 'right' ? '1px solid var(--border-color)' : 'none',
          borderRight: position === 'left' ? '1px solid var(--border-color)' : 'none',
          boxShadow: 'var(--shadow-editorial)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
          transition: 'transform 500ms var(--ease-luxury)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {title && (
            <h3 id={titleId} style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close drawer"
            style={{
              marginLeft: 'auto',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              minWidth: 44,
              minHeight: 44,
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-light)',
              cursor: 'pointer',
              background: 'transparent',
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
