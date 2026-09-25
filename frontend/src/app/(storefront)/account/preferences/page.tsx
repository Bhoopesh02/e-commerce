'use client';

import React, { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';

export default function PreferencesPage() {
  const { showToast } = useToastStore();
  
  const [emailOrderUpdates, setEmailOrderUpdates] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);
  const [emailJournal, setEmailJournal] = useState(true);

  return (
    <div className="account-section fade-in">
      <div className="content-header">
        <h1 className="page-heading">Email Preferences</h1>
        <p className="page-subheading">Choose the types of emails you'd like to receive from Aurelia.</p>
      </div>
      
      <div className="toggle-list">
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Order updates</span>
            <span className="toggle-desc">Shipping and delivery updates</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={emailOrderUpdates} onChange={(e) => setEmailOrderUpdates(e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Promotions</span>
            <span className="toggle-desc">Exclusive offers and promotions</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={emailPromotions} onChange={(e) => setEmailPromotions(e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">New collections</span>
            <span className="toggle-desc">Updates about new arrivals and collections</span>
          </div>
          <label className="switch">
            <input type="checkbox" checked={emailJournal} onChange={(e) => setEmailJournal(e.target.checked)} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      
      <div style={{ marginTop: '32px' }}>
        <button 
          className="btn-primary"
          onClick={() => showToast('Preferences updated', 'success')}
        >
          Save Preferences
        </button>
      </div>

      <style jsx>{`
        .toggle-list {
          display: flex;
          flex-direction: column;
          max-width: 600px;
        }
        
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 32px 0;
          border-bottom: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .toggle-row:first-child {
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        
        .toggle-title {
          font-weight: 500;
          color: #1D1A39;
          font-size: 1.05rem;
        }
        
        .toggle-desc {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
        }

        /* Toggle Switch Styles */
        .switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(29, 26, 57, 0.2);
          transition: .3s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
        }

        input:checked + .slider {
          background-color: #1D1A39;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #1D1A39;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }

        .slider.round {
          border-radius: 24px;
        }

        .slider.round:before {
          border-radius: 50%;
        }

        .btn-primary {
          background-color: #1D1A39;
          color: #fff;
          border: none;
          padding: 12px 24px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
