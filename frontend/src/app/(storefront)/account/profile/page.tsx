'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfilePage() {
  const { user } = useAuthStore();

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

      <style jsx>{`
        .settings-group {
          max-width: 600px;
        }
        
        .settings-header {
          margin-bottom: 24px;
        }
        
        .settings-subtitle {
          font-size: 0.9rem;
          color: var(--color-black-tie);
          font-weight: bold;
        }
        
        .settings-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 0;
          border-bottom: 1px solid rgba(20, 20, 20, 0.1);
        }
        
        .settings-row:first-of-type {
          border-top: 1px solid rgba(20, 20, 20, 0.1);
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
          color: rgba(20, 20, 20, 0.6);
        }
        
        .settings-value {
          font-size: 1.05rem;
          color: var(--color-black-tie);
        }
        
        .text-action-sm {
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 4px;
          color: rgba(20, 20, 20, 0.7);
          text-decoration: none;
          transition: opacity 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .text-action-sm:hover {
          opacity: 1;
          color: var(--color-black-tie);
        }
      `}</style>
    </div>
  );
}
