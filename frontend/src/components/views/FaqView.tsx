'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FAQ_CATEGORIES,
  FAQ_ITEMS,
  HELP_GUIDES,
  FaqItem,
} from '@/data/faqsData';
import {
  Search,
  X,
  ChevronDown,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface FaqViewProps {
  initialCategory?: string;
  showBackToAccount?: boolean;
}

export const FaqView: React.FC<FaqViewProps> = ({
  initialCategory = 'all',
  showBackToAccount = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Set<string>>(
    new Set(['faq-01', 'faq-05', 'faq-09'])
  );
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);

  // Filter FAQs based on search and selected category
  const filteredFaqs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return inQuestion || inAnswer || inTags;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setExpandedFaqIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    const allIds = new Set(filteredFaqs.map((f) => f.id));
    setExpandedFaqIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedFaqIds(new Set());
  };

  const toggleGuide = (id: string) => {
    setExpandedGuideId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="faq-page-wrapper">
      {showBackToAccount && (
        <div style={{ marginBottom: '20px' }}>
          <Link
            href="/account"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--brand-primary)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            &larr; Back to Account Dashboard
          </Link>
        </div>
      )}

      {/* Hero Header */}
      <div className="faq-header-section">
        <span className="faq-badge">
          Client Relations & Knowledge Desk
        </span>
        <h1 className="faq-title">
          Help Centre & Frequently Asked Questions
        </h1>
        <p className="faq-subtitle">
          Comprehensive guidance on bespoke commissions, white-glove delivery, our 7-day return privilege, and fine textile preservation.
        </p>
      </div>

      {/* Search Bar */}
      <div className="faq-search-wrapper">
        <div className="faq-search-input-box">
          <Search size={18} className="faq-search-icon" aria-hidden="true" />
          <input
            type="text"
            className="faq-search-input"
            placeholder="Search questions by topic (e.g. sizing, returns, courier, silk care, payments)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search help articles and questions"
          />
          {searchQuery && (
            <button
              type="button"
              className="faq-search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search inquiry"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="faq-category-pills-row" role="tablist" aria-label="FAQ categories">
        {FAQ_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const count =
            cat.id === 'all'
              ? FAQ_ITEMS.length
              : FAQ_ITEMS.filter((f) => f.category === cat.id).length;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              className={`faq-cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span>{cat.label}</span>
              <span className="faq-cat-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="faq-controls-bar">
        <span className="faq-results-summary">
          Showing {filteredFaqs.length} of {FAQ_ITEMS.length} inquiries
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <div className="faq-expand-actions">
          <button
            type="button"
            className="faq-action-link"
            onClick={handleExpandAll}
          >
            Expand All
          </button>
          <span style={{ color: 'var(--border-color)' }}>|</span>
          <button
            type="button"
            className="faq-action-link"
            onClick={handleCollapseAll}
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="faq-accordion-list">
        {filteredFaqs.length === 0 ? (
          <div className="faq-empty-state">
            <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
              No Direct Inquiries Found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              We could not find answers matching &ldquo;{searchQuery}&rdquo;. Our dedicated concierge desk is available to assist personally.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
              <Link href="/account/support">
                <Button variant="primary" size="sm">
                  Contact Concierge Desk
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          filteredFaqs.map((item) => {
            const isExpanded = expandedFaqIds.has(item.id);
            return (
              <div
                key={item.id}
                className={`faq-accordion-item ${isExpanded ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isExpanded}
                >
                  <div className="faq-question-content">
                    <span className="faq-item-category-tag">
                      {item.categoryLabel}
                    </span>
                    <h3 className="faq-question-title">{item.question}</h3>
                  </div>
                  <div
                    className={`faq-chevron-icon ${isExpanded ? 'rotated' : ''}`}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="faq-answer-panel">
                    <p className="faq-answer-text">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Featured Atelier Guides & Protocols */}
      <section className="faq-guides-section">
        <div style={{ marginBottom: '28px' }}>
          <span className="faq-badge">
            Step-by-Step Instructions
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', marginTop: '4px' }}>
            Atelier Protocols & Guides
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
            Detailed procedures prepared by our master tailoring and logistics teams.
          </p>
        </div>

        <div className="faq-guides-grid">
          {HELP_GUIDES.map((guide) => {
            const isGuideOpen = expandedGuideId === guide.id;
            return (
              <div key={guide.id} className="faq-guide-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="guide-category-badge">{guide.category}</span>
                  <span className="guide-time-text">
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {guide.readingTime}
                  </span>
                </div>

                <h3 className="guide-card-title">{guide.title}</h3>
                <p className="guide-card-summary">{guide.summary}</p>

                <button
                  type="button"
                  className="guide-expand-btn"
                  onClick={() => toggleGuide(guide.id)}
                >
                  <span>{isGuideOpen ? 'Hide Procedure Steps' : 'View Procedure Steps'}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isGuideOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                </button>

                {isGuideOpen && (
                  <div className="guide-steps-list">
                    <ol style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {guide.steps.map((st, idx) => (
                        <li key={idx} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                          {st}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Concierge Desk Direct Contact Banner */}
      <section className="faq-concierge-contact-card">
        <div className="faq-concierge-left">
          <div className="faq-concierge-icon-box">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="faq-badge" style={{ color: 'var(--brand-accent)' }}>
              Private Client Concierge
            </span>
            <h3 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', margin: '4px 0 6px 0' }}>
              Require Personal Consultation?
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '520px', margin: 0 }}>
              Our senior client relations team is on standby to coordinate customized fitting appointments, fabric reserves, and urgent dispatch requests.
            </p>
          </div>
        </div>

        <div className="faq-concierge-actions">
          <Link href="/account/support">
            <Button variant="primary" leftIcon={<MessageSquare size={16} />}>
              Dispatch Atelier Ticket
            </Button>
          </Link>
          <a href="tel:+919800011223" style={{ textDecoration: 'none' }}>
            <Button variant="outline" leftIcon={<Phone size={15} />}>
              +91 98000 11223
            </Button>
          </a>
        </div>
      </section>

      {/* Salon Details Row */}
      <div className="faq-salon-channels-grid">
        <div className="faq-channel-card">
          <MapPin size={20} className="channel-icon" />
          <h4 className="channel-title">Atelier Salons</h4>
          <p className="channel-text">
            Penthouse 9, UB City, Vittal Mallya Road, Bengaluru 560001
          </p>
          <span className="channel-meta">By Private Appointment</span>
        </div>

        <div className="faq-channel-card">
          <Clock size={20} className="channel-icon" />
          <h4 className="channel-title">Operating Hours</h4>
          <p className="channel-text">
            Monday through Saturday: 10:00 AM – 7:30 PM IST
          </p>
          <span className="channel-meta">Complimentary Weekend Appointments</span>
        </div>

        <div className="faq-channel-card">
          <Mail size={20} className="channel-icon" />
          <h4 className="channel-title">Written Correspondence</h4>
          <p className="channel-text">
            concierge@aurelia-atelier.com
          </p>
          <span className="channel-meta">Guaranteed response within 4 hours</span>
        </div>
      </div>

      <style jsx>{`
        .faq-page-wrapper {
          width: 100%;
          max-width: 1080px;
          margin: 0 auto;
          color: var(--text-primary);
        }

        .faq-header-section {
          margin-bottom: 32px;
        }

        .faq-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brand-primary);
          margin-bottom: 8px;
        }

        .faq-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 2.8rem);
          line-height: 1.15;
          margin: 0 0 10px 0;
          color: var(--text-primary);
        }

        .faq-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 720px;
          margin: 0;
        }

        .faq-search-wrapper {
          margin-bottom: 24px;
        }

        .faq-search-input-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 14px 18px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-search-input-box:focus-within {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(102, 37, 73, 0.12);
        }

        :global(.faq-search-icon) {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .faq-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          width: 100%;
        }

        .faq-search-input::placeholder {
          color: var(--text-muted);
        }

        .faq-search-clear-btn {
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.2s ease;
        }

        .faq-search-clear-btn:hover {
          color: var(--text-primary);
        }

        .faq-category-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .faq-cat-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.03em;
          border-radius: 100px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .faq-cat-pill:hover {
          border-color: var(--brand-primary);
          color: var(--text-primary);
        }

        .faq-cat-pill.active {
          background-color: var(--brand-primary);
          border-color: var(--brand-primary);
          color: #ffffff;
        }

        .faq-cat-count {
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 100px;
          background-color: rgba(0, 0, 0, 0.06);
          color: inherit;
        }

        .faq-cat-pill.active .faq-cat-count {
          background-color: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }

        .faq-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-light);
          flex-wrap: wrap;
          gap: 12px;
        }

        .faq-results-summary {
          font-size: 0.82rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .faq-expand-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .faq-action-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.8rem;
          color: var(--brand-primary);
          cursor: pointer;
          text-decoration: underline;
          letter-spacing: 0.02em;
        }

        .faq-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 56px;
        }

        .faq-accordion-item {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-accordion-item.open {
          border-color: var(--brand-accent);
          box-shadow: var(--shadow-sm);
        }

        .faq-question-btn {
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          padding: 20px 24px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          color: inherit;
        }

        .faq-question-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .faq-item-category-tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--brand-primary);
        }

        .faq-question-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.4;
          margin: 0;
        }

        .faq-chevron-icon {
          color: var(--text-muted);
          transition: transform 0.25s ease, color 0.2s ease;
          padding-top: 4px;
          flex-shrink: 0;
        }

        .faq-chevron-icon.rotated {
          transform: rotate(180deg);
          color: var(--brand-primary);
        }

        .faq-answer-panel {
          padding: 0 24px 24px 24px;
          border-top: 1px solid var(--border-light);
          margin-top: -4px;
          padding-top: 16px;
        }

        .faq-answer-text {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin: 0;
        }

        .faq-empty-state {
          text-align: center;
          padding: 48px 24px;
          background-color: var(--bg-surface);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-sm);
        }

        .faq-guides-section {
          margin-bottom: 56px;
          padding-top: 16px;
        }

        .faq-guides-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
          gap: 20px;
        }

        .faq-guide-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-sm);
        }

        .guide-category-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--brand-accent);
        }

        .guide-time-text {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .guide-card-title {
          font-size: 1.1rem;
          font-family: var(--font-display);
          color: var(--text-primary);
          margin: 0 0 8px 0;
        }

        .guide-card-summary {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0 0 16px 0;
          flex: 1;
        }

        .guide-expand-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--brand-primary);
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          margin-top: auto;
        }

        .guide-steps-list {
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid var(--border-light);
        }

        .faq-concierge-contact-card {
          background: linear-gradient(135deg, var(--bg-surface) 0%, var(--overlay-golden-10) 100%);
          border: 1px solid var(--overlay-golden-35);
          border-radius: var(--radius-md);
          padding: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 40px;
          box-shadow: var(--shadow-sm);
        }

        .faq-concierge-left {
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .faq-concierge-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background-color: var(--overlay-golden-15, rgba(194, 155, 76, 0.15));
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-accent);
          flex-shrink: 0;
        }

        .faq-concierge-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .faq-salon-channels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .faq-channel-card {
          background-color: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        :global(.channel-icon) {
          color: var(--brand-primary);
          margin-bottom: 4px;
        }

        .channel-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .channel-text {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .channel-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-style: italic;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .faq-concierge-contact-card {
            padding: 20px;
          }
          .faq-concierge-actions {
            width: 100%;
          }
          .faq-concierge-actions :global(button),
          .faq-concierge-actions :global(a) {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};
