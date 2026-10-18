import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ProductLoading() {
  return (
    <div style={{ paddingTop: '110px', paddingBottom: '96px', backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="container">
        {/* Back navigation skeleton */}
        <div style={{ marginBottom: '32px' }}>
          <Skeleton width="120px" height="18px" borderRadius="4px" />
        </div>

        {/* 2-column PDP layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '48px',
          }}
        >
          {/* Gallery Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '100%', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: '12px' }}>
              <Skeleton width="100%" height="100%" borderRadius="12px" />
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} style={{ width: '80px', height: '106px', borderRadius: '8px', overflow: 'hidden' }}>
                  <Skeleton width="100%" height="100%" borderRadius="8px" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Skeleton width="140px" height="14px" />
            <Skeleton width="85%" height="36px" />
            <Skeleton width="120px" height="26px" />
            
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Skeleton width="100%" height="16px" />
              <Skeleton width="92%" height="16px" />
              <Skeleton width="75%" height="16px" />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
              {['S', 'M', 'L', 'XL'].map((s) => (
                <Skeleton key={s} width="48px" height="42px" borderRadius="6px" />
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <Skeleton width="100%" height="52px" borderRadius="var(--radius-sm)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
