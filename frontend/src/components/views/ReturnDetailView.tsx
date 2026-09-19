'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getReturnById } from '@/lib/mockApi';
import { ReturnRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

interface ReturnDetailViewProps {
  returnId: string;
}

export const ReturnDetailView: React.FC<ReturnDetailViewProps> = ({ returnId }) => {
  const [returnReq, setReturnReq] = useState<ReturnRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getReturnById(returnId);
        setReturnReq(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [returnId]);

  if (loading) return <div style={{ paddingTop: '140px', textAlign: 'center' }}>Loading Return Dossier...</div>;

  if (!returnReq) {
    return (
      <div style={{ paddingTop: '140px', textAlign: 'center' }}>
        <h2>Return Request Not Found</h2>
        <Link href="/account">
          <Button variant="outline" style={{ marginTop: '16px' }}>Return to Account</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        <Link
          href="/account"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: 'var(--color-sunset-600)',
            marginBottom: '24px',
            fontWeight: 500,
          }}
        >
          <ArrowLeft size={16} /> Back to Account
        </Link>

        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            padding: '36px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-sunset-600)' }}>
                Return Authorization Dossier
              </span>
              <h1 style={{ fontSize: '1.8rem', marginTop: '4px' }}>Request #{returnReq.id}</h1>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Linked to Commission #{returnReq.orderId}
              </span>
            </div>
            <Badge variant="warning">{returnReq.status}</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Reason</span>
              <p style={{ fontWeight: 600, marginTop: '2px' }}>{returnReq.reason}</p>
            </div>

            {returnReq.comments && (
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Client Notes</span>
                <p style={{ marginTop: '2px', color: 'var(--text-secondary)' }}>{returnReq.comments}</p>
              </div>
            )}

            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Refund Settlement Status</span>
              <p style={{ fontWeight: 600, color: 'var(--color-sunset-700)', marginTop: '2px', textTransform: 'capitalize' }}>
                {returnReq.refundStatus} (Credited to original Adyen payment method upon physical inspection)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
