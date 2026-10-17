'use client';

import React, { useState } from 'react';
import { PeekRating } from '@/components/ui/PeekRating';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { addReview } from '@/lib/mockApi';
import { ShieldCheck } from 'lucide-react';
import { Review } from '@/types';

interface ReviewFormProps {
  productId: string;
  productName?: string;
  isVerifiedBuyer?: boolean;
  initialExpanded?: boolean;
  onReviewAdded: (review: Review) => void;
  onCancel?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  isVerifiedBuyer = false,
  initialExpanded = false,
  onReviewAdded,
  onCancel,
}) => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [rating, setRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const handleDismiss = () => {
    setIsExpanded(false);
    setRating(0);
    setTitle('');
    setBody('');
    if (onCancel) {
      onCancel();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      showToast('Please select a star rating (1-5) for your reflection.', 'error');
      return;
    }
    if (!title.trim() || !body.trim()) {
      showToast('Please provide both a reflection title and detailed notes.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newRev = await addReview({
        productId,
        userId: user?.id || 'usr_guest',
        userName: user?.name || 'Private Client',
        rating,
        title: title.trim(),
        body: body.trim(),
        verifiedPurchase: isVerifiedBuyer,
      });

      onReviewAdded(newRev);
      setTitle('');
      setBody('');
      setRating(0);
      setIsExpanded(false);
      showToast('Your garment reflection has been inscribed and published.', 'success');
    } catch {
      showToast('Failed to post reflection. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <Button variant="outline" onClick={() => setIsExpanded(true)}>
          Write a Client Reflection
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: '28px',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '24px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: isVerifiedBuyer ? 'var(--color-success)' : 'var(--brand-primary)',
              marginBottom: '4px',
            }}
          >
            <ShieldCheck size={14} />
            <span>{isVerifiedBuyer ? 'Verified Atelier Purchase' : 'Atelier Client Reflection'}</span>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', margin: 0 }}>
            {productName ? `Reflect on ${productName}` : 'Record Your Impression'}
          </h3>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          Cancel
        </button>
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
            marginBottom: '8px',
          }}
        >
          Rating
        </label>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
          <PeekRating
            value={rating}
            onChange={setRating}
            size={22}
            labels={['Poor', 'Fair', 'Good', 'Great', 'Exceptional']}
            allowClear={false}
            activeColor="var(--brand-accent)"
            idleColor="var(--border-color)"
            tipColor="var(--color-black-tie)"
            tipTextColor="var(--bg-subtle)"
          />
          {rating > 0 ? (
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {rating}.0
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              Select your rating
            </span>
          )}
        </div>
      </div>

      <Input
        label="Summary Impression"
        placeholder="e.g. Impeccable tailoring, fluid drape"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-secondary)',
          }}
        >
          Detailed Reflection (Fit, Fabric, Craft)
        </label>
        <textarea
          rows={4}
          required
          placeholder="Describe how the silhouette sits, fabric weight, tactile feel, and finishing details..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <Button
          type="button"
          variant="ghost"
          onClick={handleDismiss}
          disabled={isSubmitting}
        >
          Dismiss
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          Publish Reflection
        </Button>
      </div>
    </form>
  );
};
