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
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              aria-label={`${starValue} stars`}
              style={{
                background: 'transparent',
                border: 'none',
                padding: interactive ? '2px' : '0',
                cursor: interactive ? 'pointer' : 'default',
                color: isFilled ? 'var(--color-golden)' : 'var(--border-color)',
                display: 'flex',
                alignItems: 'center',
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
          }}
        >
          {rating.toFixed(1)}
        </span>
      )}

      {totalReviews !== undefined && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '2px' }}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
