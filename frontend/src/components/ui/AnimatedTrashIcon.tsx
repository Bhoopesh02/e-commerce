'use client';

import React from 'react';

interface AnimatedTrashIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const AnimatedTrashIcon: React.FC<AnimatedTrashIconProps> = ({ size = 24, className = '', ...props }) => {
  return (
    <>
      <style>{`
        .animated-trash-icon {
          transition: color 0.3s ease;
        }
        
        .animated-trash-lid {
          transform-origin: 4px 5px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        button:hover .animated-trash-icon,
        .animated-trash-icon:hover {
          color: var(--color-error, #B00020) !important;
        }
        
        button:hover .animated-trash-lid,
        .animated-trash-icon:hover .animated-trash-lid {
          transform: rotate(-30deg) translateY(-2px);
        }
      `}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`animated-trash-icon ${className}`}
        style={{ overflow: 'visible' }}
        {...props}
      >
        <g className="animated-trash-lid">
          <path d="M3 6h18" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </g>
        <g className="animated-trash-body">
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </g>
      </svg>
    </>
  );
};
