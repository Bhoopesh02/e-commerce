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
import { ArrowLeft, MessageSquare, Send, CheckCircle2, Shield } from 'lucide-react';

export const SupportView: React.FC = () => {
  const { user } = useAuthStore();
  const { showToast } = useToastStore();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

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
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '1080px' }}>
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--color-sapphire)',
            marginBottom: '24px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-sapphire)' }}>
            Client Relations Desk
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginTop: '4px' }}>
            Atelier Concierge Inquiries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '6px' }}>
            Direct correspondence regarding custom tailoring sizing, delivery scheduling, and fabric provenance.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left: New Inquiry Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
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
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-surface)',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    resize: 'none',
                  }}
                />
              </div>

              <Button type="submit" variant="primary" isLoading={isSubmitting} leftIcon={<Send size={15} />}>
                Send Inquiry
              </Button>
            </form>
          </div>

          {/* Right: Existing Threads */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)' }}>Previous Threads</h2>

            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                style={{
                  padding: '20px',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedTicket?.id === t.id ? '2px solid var(--color-sapphire)' : '1px solid var(--border-color)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
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
                  <div style={{ backgroundColor: 'rgba(194, 155, 76, 0.08)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(194, 155, 76, 0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <Shield size={13} style={{ color: 'var(--color-sapphire)' }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-sapphire)' }}>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
