'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: string;
  ariaLabel?: string;
  contentStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = '440px',
  ariaLabel,
  contentStyle,
  headerStyle,
  titleStyle,
}) => {
  const generatedId = React.useId();
  const titleId = `drawer-title-${generatedId.replace(/:/g, '')}`;

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
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
        backgroundColor: 'var(--overlay-black-50)',
        backdropFilter: 'blur(6px)',
        zIndex: 9998,
        display: 'flex',
        justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        visibility: isOpen ? 'visible' : 'hidden',
        overscrollBehavior: 'contain',
        touchAction: 'none',
        transition: isOpen
          ? 'opacity 500ms var(--ease-luxury) 50ms, visibility 0s linear 0s'
          : 'opacity 500ms var(--ease-luxury), visibility 0s linear 500ms',
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
          touchAction: 'pan-y',
          overscrollBehavior: 'contain',
          transform: isOpen ? 'translateX(0)' : `translateX(${position === 'right' ? '100%' : '-100%'})`,
          transition: 'transform 500ms var(--ease-luxury)',
          boxSizing: 'border-box',
          ...contentStyle,
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
            ...headerStyle,
          }}
        >
          {title && (
            <h3 id={titleId} style={{ fontSize: '1.25rem', color: 'var(--text-primary)', ...titleStyle }}>
              {title}
            </h3>
          )}
          <motion.button
            onClick={onClose}
            aria-label="Close drawer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isOpen ? 1 : 0, 
              scale: isOpen ? 1 : 0.8 
            }}
            whileHover={{ 
              rotate: 90, 
              scale: 1.05,
              backgroundColor: 'var(--bg-muted)',
              borderColor: 'var(--overlay-black-30)'
            }}
            whileTap={{ scale: 0.92 }}
            transition={{ 
              rotate: { ease: [0.16, 1, 0.3, 1], duration: 0.3 },
              scale: { type: 'spring', stiffness: 400, damping: 25 },
              default: { duration: 0.3 }
            }}
            style={{
              marginLeft: 'auto',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              borderRadius: '50%',
              border: '1.5px solid var(--overlay-black-15)',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
              cursor: 'pointer',
              background: 'var(--color-diamond)',
              outline: 'none',
            }}
          >
            <X size={18} strokeWidth={2} />
          </motion.button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            overscrollBehaviorY: 'contain',
            touchAction: 'pan-y',
            padding: '24px',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
