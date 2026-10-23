'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '@/hooks/useScrollLock';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: string;
  ariaLabel?: string;
  contentStyle?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
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
  bodyStyle,
}) => {
  const [mounted, setMounted] = useState(false);
  const generatedId = React.useId();
  const titleId = `drawer-title-${generatedId.replace(/:/g, '')}`;

  useScrollLock(isOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-label={ariaLabel || (!title ? 'Drawer' : undefined)}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100dvh',
            backgroundColor: 'var(--overlay-black-50)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            justifyContent: position === 'right' ? 'flex-end' : 'flex-start',
            overscrollBehavior: 'contain',
            touchAction: 'none',
          }}
          onClick={onClose}
        >
          <motion.div
            key="drawer-panel"
            data-lenis-prevent
            initial={{ x: position === 'right' ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ 
              x: position === 'right' ? '100%' : '-100%',
              transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } 
            }}
            transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              maxWidth: width,
              height: '100%',
              maxHeight: '100dvh',
              backgroundColor: 'var(--bg-surface)',
              borderLeft: position === 'right' ? '1px solid var(--border-color)' : 'none',
              borderRight: position === 'left' ? '1px solid var(--border-color)' : 'none',
              boxShadow: position === 'right'
                ? '-16px 0 48px -8px rgba(0, 0, 0, 0.28), -4px 0 16px rgba(0, 0, 0, 0.12)'
                : '16px 0 48px -8px rgba(0, 0, 0, 0.28), 4px 0 16px rgba(0, 0, 0, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              boxSizing: 'border-box',
              color: 'var(--text-primary)',
              willChange: 'transform',
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
                typeof title === 'string' ? (
                  <h3 id={titleId} style={{ fontSize: '1.25rem', color: 'var(--text-primary)', margin: 0, ...titleStyle }}>
                    {title}
                  </h3>
                ) : (
                  <div id={titleId} style={{ display: 'flex', alignItems: 'center', ...titleStyle }}>
                    {title}
                  </div>
                )
              )}
              <motion.button
                onClick={onClose}
                aria-label="Close drawer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1 
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
                  width: 44,
                  height: 44,
                  minWidth: 44,
                  minHeight: 44,
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
              data-lenis-prevent
              className="drawer-content-container"
              style={{
                flex: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                overscrollBehaviorY: 'contain',
                touchAction: 'pan-y',
                padding: '24px',
                paddingBottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
                paddingLeft: 'max(24px, env(safe-area-inset-left, 24px))',
                paddingRight: 'max(24px, env(safe-area-inset-right, 24px))',
                ...bodyStyle,
              }}
            >
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
