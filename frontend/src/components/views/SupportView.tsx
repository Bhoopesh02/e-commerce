'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupportTickets, createSupportTicket } from '@/lib/mockApi';
import { SupportTicket } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FaqView } from '@/components/views/FaqView';
import {
  ArrowLeft,
  MessageSquare,
  Send,
  Shield,
  HelpCircle,
  FileQuestion,
  Headphones,
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<'faqs' | 'concierge'>('faqs');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'tickets' || tabParam === 'concierge') {
        setActiveTab('concierge');
      } else if (tabParam === 'faq' || tabParam === 'faqs') {
        setActiveTab('faqs');
      }
    }
  }, []);

  useEffect(() => {
    async function load() {
      const data = await getSupportTickets(user?.id || 'usr_001');
      setTickets(data);
      if (data.length > 0) setSelectedTicket(data[0]);
    }
    load();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      const newTkt = await createSupportTicket({
        userId: user?.id || 'usr_001',
        userName: user?.name || 'Ayesha Rahman',
        userEmail: user?.email || 'ayesha@example.com',
        subject: subject.trim(),
        message: message.trim(),
      });
      setTickets([newTkt, ...tickets]);
      setSelectedTicket(newTkt);
      setSubject('');
      setMessage('');
      showToast('Concierge inquiry dispatched. Expect email response within 4 hours.', 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="account-section support-view-section fade-in">
      <div style={{ maxWidth: '1080px', width: '100%' }}>
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--brand-primary)',
            marginBottom: '20px',
            fontWeight: 500,
            minHeight: '2.75rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>

        {/* Tab Selection Row */}
        <div className="support-nav-tabs" role="tablist" aria-label="Support sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'faqs'}
            className={`support-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
            onClick={() => setActiveTab('faqs')}
          >
            <HelpCircle size={17} />
            <span>Help Centre & FAQs</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'concierge'}
            className={`support-tab-btn ${activeTab === 'concierge' ? 'active' : ''}`}
            onClick={() => setActiveTab('concierge')}
          >
            <Headphones size={17} />
            <span>Concierge Ticket Desk</span>
            {tickets.length > 0 && (
              <span className="tab-count-badge">{tickets.length}</span>
            )}
          </button>
        </div>

        {/* TAB 1: FAQS & HELP CENTRE */}
        {activeTab === 'faqs' && (
          <div className="tab-pane fade-in">
            <FaqView />
          </div>
        )}

        {/* TAB 2: CONCIERGE TICKET DESK */}
        {activeTab === 'concierge' && (
          <div className="tab-pane fade-in">
            <div style={{ marginBottom: '28px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand-primary)' }}>
                Client Relations Desk
              </span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', marginTop: '4px' }}>
                Atelier Concierge Inquiries
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
                Direct correspondence regarding custom tailoring sizing, delivery scheduling, and fabric provenance.
              </p>
            </div>

            <div className="support-grid">
              {/* Left: New Inquiry Form */}
              <div className="support-card inquiry-form-card">
                <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
                  Dispatch New Inquiry
                </h2>

                <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Input
                    label="Subject / Topic"
                    placeholder="e.g. Size advice for Double-Breasted Blazer"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                      Message to Concierge
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Detail your request or fitting inquiry..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="support-textarea"
                    />
                  </div>

                  <div className="support-btn-wrap">
                    <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Send size={15} />}>
                      Send Inquiry
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right: Existing Threads */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Previous Threads</h2>

                {tickets.length === 0 ? (
                  <div
                    style={{
                      padding: '32px 20px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                      No prior inquiries filed. Your correspondence with our atelier will appear here.
                    </p>
                  </div>
                ) : (
                  tickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="ticket-card"
                      style={{
                        border: selectedTicket?.id === t.id ? '2px solid var(--brand-primary)' : '1px solid var(--border-color)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ticket #{t.id}</span>
                        <Badge variant={t.status === 'Resolved' ? 'success' : 'warning'}>{t.status}</Badge>
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>{t.subject}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                        {t.message}
                      </p>

                      {/* Admin Responses */}
                      {t.responses.length > 0 ? (
                        <div style={{ backgroundColor: 'var(--overlay-golden-10)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--overlay-golden-35)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <Shield size={13} style={{ color: 'var(--brand-primary)' }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-primary)' }}>
                              {t.responses[0].authorName}
                            </span>
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                            {t.responses[0].message}
                          </p>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          Awaiting response from atelier operations...
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .support-nav-tabs {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 4px;
        }

        .support-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 44px;
          box-sizing: border-box;
          padding: 10px 18px;
          background: none;
          border: none;
          font-size: 0.92rem;
          color: var(--text-secondary);
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
          margin-bottom: -5px;
        }

        .support-tab-btn:hover {
          color: var(--text-primary);
        }

        .support-tab-btn.active {
          color: var(--brand-primary);
          font-weight: 600;
          border-bottom-color: var(--brand-primary);
        }

        .tab-count-badge {
          font-size: 0.72rem;
          background-color: var(--brand-primary);
          color: var(--color-diamond);
          padding: 2px 7px;
          border-radius: 100px;
          font-weight: 600;
        }

        .support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
          gap: 32px;
          align-items: flex-start;
        }

        .support-card {
          background-color: var(--bg-surface);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          padding: 28px;
          box-shadow: var(--shadow-sm);
        }

        .ticket-card {
          padding: 20px;
          min-height: 44px;
          box-sizing: border-box;
          background-color: var(--bg-surface);
          border-radius: var(--radius-sm);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s ease;
        }

        .support-textarea {
          padding: 12px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-surface);
          font-size: 1rem;
          color: var(--text-primary);
          resize: none;
          width: 100%;
        }

        @media (max-width: 600px) {
          .support-nav-tabs {
            flex-direction: column;
            gap: 8px;
            border-bottom: none;
          }

          .support-tab-btn {
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            width: 100%;
            justify-content: center;
          }

          .support-tab-btn.active {
            background-color: var(--brand-primary);
            color: var(--color-diamond);
            border-color: var(--brand-primary);
          }

          .support-tab-btn.active .tab-count-badge {
            background-color: var(--color-diamond);
            color: var(--brand-primary);
          }

          .support-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .support-card {
            padding: clamp(14px, 4vw, 28px);
          }

          .ticket-card {
            padding: clamp(14px, 4vw, 20px);
          }

          .support-textarea {
            font-size: 16px;
          }

          .support-btn-wrap {
            width: 100%;
            min-width: 0;
            overflow: visible;
          }

          .support-btn-wrap :global(button) {
            width: 100% !important;
            max-width: 100% !important;
            justify-content: center !important;
            min-height: 2.75rem !important;
            padding-inline: clamp(14px, 4vw, 24px) !important;
            font-size: clamp(0.72rem, 3.4vw, 0.85rem) !important;
            letter-spacing: 0.06em !important;
            white-space: normal !important;
            line-height: 1.3 !important;
            text-align: center !important;
            overflow: visible !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};
