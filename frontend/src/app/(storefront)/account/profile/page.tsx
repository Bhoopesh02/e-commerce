'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/signout');
  };

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">Profile Settings</h1>
        <p className="page-subheading">Manage your personal information and security settings.</p>
      </div>
      
      <div className="settings-group">
        <div className="settings-header">
          <h3 className="settings-subtitle">Personal Information</h3>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Full Name</span>
            <span className="settings-value">{user?.name || 'Ayesha Rahman'}</span>
          </div>
          <button className="text-action-sm">Edit</button>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Email Address</span>
            <span className="settings-value">{user?.email || 'ayesha@example.com'}</span>
          </div>
          <button className="text-action-sm">Edit</button>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Phone Number</span>
            <span className="settings-value">{user?.phone || '+91 98765 43210'}</span>
          </div>
          <button className="text-action-sm">Edit</button>
        </div>
      </div>

      <div className="settings-group" style={{ marginTop: '48px' }}>
        <div className="settings-header">
          <h3 className="settings-subtitle">Password</h3>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Password</span>
            <span className="settings-value">••••••••</span>
          </div>
          <button className="text-action-sm">Change Password</button>
        </div>
      </div>

      <div className="settings-group" style={{ marginTop: '48px' }}>
        <div className="settings-header">
          <h3 className="settings-subtitle">Session & Account</h3>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <span className="settings-label">Active Session</span>
            <span className="settings-value" style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
              Signed in as {user?.email || 'ayesha@example.com'}
            </span>
          </div>
          <button className="signout-btn" onClick={handleLogout}>
            Sign Out <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .settings-group {
          max-width: 600px;
        }
        
        .settings-header {
          margin-bottom: 24px;
        }
        
        .settings-subtitle {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: bold;
        }
        
        .settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid var(--overlay-black-10);
        }
        
        .settings-row:first-of-type {
          border-top: 1px solid var(--overlay-black-10);
        }
        
        .settings-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .settings-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--overlay-black-70);
        }
        
        .settings-value {
          font-size: 1.05rem;
          color: var(--text-primary);
        }
        
        .text-action-sm {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--overlay-black-70);
          text-decoration: none;
          transition: opacity 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .text-action-sm:hover {
          opacity: 1;
          color: var(--text-primary);
        }

        .signout-btn {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.75;
          transition: opacity 0.2s ease;
          min-height: 2.75rem;
        }

        .signout-btn:hover {
          opacity: 1;
        }

        .signout-btn svg {
          transition: transform 0.2s ease;
        }

        .signout-btn:hover svg {
          transform: translateX(4px);
        }

        @media (max-width: 600px) {
          .settings-row {
            padding: 16px 0;
          }
          .text-action-sm {
            min-height: 2.75rem;
          }
        }
      `}</style>
    </div>
  );
}
