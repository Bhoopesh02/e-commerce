'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export interface FilterDropdownSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}

export const FilterDropdownSection: React.FC<FilterDropdownSectionProps> = ({
  title,
  isOpen,
  onToggle,
  badge,
  id,
  children,
}) => {
  const sectionId = id || title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const headerId = `filter-header-${sectionId}`;
  const panelId = `filter-panel-${sectionId}`;

  return (
    <div
      style={{
        borderBottom: '1px solid var(--overlay-black-5, rgba(0,0,0,0.06))',
      }}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 6px',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          userSelect: 'none',
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: 0,
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              letterSpacing: '0.06em',
              color: 'var(--text-primary)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {title}
          </span>

          {badge && (
            <span
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.03em',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                backgroundColor: 'var(--color-black-tie)',
                color: 'var(--color-diamond)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '140px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <ChevronDown
          size={18}
          style={{
            color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        />
      </button>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <div style={{ paddingTop: '2px', paddingBottom: '18px', paddingLeft: '4px', paddingRight: '4px' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
