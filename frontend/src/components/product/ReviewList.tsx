'use client';

import React from 'react';
import { Review } from '@/types';
import { RatingStars } from '@/components/ui/RatingStars';
import { CheckCircle2 } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-light)',
        }}
      >
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: '8px' }}>
          No client reflections yet for this silhouette.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Be the first to share your notes on fit, drape, and material quality.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {review.userName || 'Private Client'}
                </span>
                {review.verifiedPurchase && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: 'var(--color-success)',
                      backgroundColor: 'var(--color-success-bg)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    <CheckCircle2 size={11} /> Verified Owner
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {new Date(review.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>

            <RatingStars rating={review.rating} size={15} showScore />
          </div>

          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            {review.title}
          </h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {review.body}
          </p>
        </div>
      ))}
    </div>
  );
};
