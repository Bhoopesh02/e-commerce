'use client';

import React from 'react';
import { Star } from 'lucide-react';

export interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showScore?: boolean;
  totalReviews?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  interactive = false,
  onChange,
  showScore = false,
  totalReviews,
}) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          gap: '2px',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(rating);

          if (!interactive) {
            return (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  color: isFilled ? 'var(--brand-accent)' : 'var(--border-color)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                <Star
                  size={size}
                  fill={isFilled ? 'currentColor' : 'transparent'}
                  stroke="currentColor"
                  strokeWidth={1.5}
                />
              </span>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange && onChange(starValue)}
              aria-label={`${starValue} stars`}
              style={{
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: isFilled ? 'var(--brand-accent)' : 'var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '-12px -10px',
                flexShrink: 0,
              }}
            >
              <Star
                size={size}
                fill={isFilled ? 'currentColor' : 'transparent'}
                stroke="currentColor"
                strokeWidth={1.5}
              />
            </button>
          );
        })}
      </div>

      {showScore && (
        <span
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginLeft: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: 1,
            display: 'inline-block',
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {totalReviews !== undefined && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginLeft: '2px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: 1,
            display: 'inline-block',
          }}
        >
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
// Trigger rebuild
