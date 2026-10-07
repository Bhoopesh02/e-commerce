'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = 'The Private Ledger',
  subtitle = 'Receive invitations to private salon previews, new editions, and styling consultations. Dispatched exclusively via email.',
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please provide a valid client email address.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Welcome to the Aurelia Private Ledger.', 'success');
    }, 400);
  };

  return (
    <section
      style={{
        padding: '80px 0',
        background: 'var(--gradient-aurelia)',
        color: 'var(--bg-subtle)',
        position: 'relative',
      }}
    >
      <div className="container" style={{ maxWidth: '680px', textAlign: 'center' }}>
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--border-color)',
            display: 'block',
            marginBottom: '12px',
          }}
        >
          Atelier Correspondence
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            color: 'var(--bg-subtle)',
            marginBottom: '16px',
          }}
        >
          {title}
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: 'var(--border-color)',
            lineHeight: 1.6,
            marginBottom: '32px',
          }}
        >
          {subtitle}
        </p>

        {isSubmitted ? (
          <div
            style={{
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(224, 224, 224, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle2 size={22} style={{ color: "var(--text-inverse)" }} />
            <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>
              Your email ({email}) is inscribed. We honor your privacy with email-only correspondence.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '12px',
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-pill)',
                padding: '12px 20px',
                border: '1px solid rgba(224, 224, 224, 0.35)',
              }}
            >
              <Mail size={18} style={{ color: 'var(--border-color)', marginRight: '10px', flexShrink: 0 }} />
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  color: "var(--text-inverse)",
                  fontSize: '0.92rem',
                }}
              />
            </div>
            <Button
              type="submit"
              variant="white"
              size="md"
              isLoading={isLoading}
              style={{
                flexShrink: 0,
              }}
            >
              Inscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};
