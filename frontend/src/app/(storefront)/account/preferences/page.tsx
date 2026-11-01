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
          width: 100%;
          max-width: 600px;
        }
        
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          width: 100%;
          padding: 28px 0;
          border-bottom: 1px solid var(--overlay-black-10);
        }
        
        .toggle-row:first-child {
          border-top: 1px solid var(--overlay-black-10);
        }
        
        .toggle-info {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 0;
        }
        
        .toggle-title {
          font-weight: 500;
          color: var(--text-primary);
          font-size: 1.05rem;
        }
        
        .toggle-desc {
          font-size: 0.9rem;
          color: var(--overlay-black-70);
          line-height: 1.45;
        }

        /* Toggle Switch Styles */
        .switch {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 44px;
          min-height: 44px;
          flex-shrink: 0;
          cursor: pointer;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 10px;
          left: 4px;
          right: 4px;
          bottom: 10px;
          background-color: var(--overlay-black-20);
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
          background-color: var(--text-primary);
        }

        input:focus + .slider {
          box-shadow: 0 0 1px var(--color-black-tie);
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
          background-color: var(--text-primary);
          color: var(--text-inverse);
          border: none;
          padding: 0 24px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        @media (max-width: 600px) {
          .toggle-row {
            padding: clamp(18px, 4vw, 24px) 0;
            gap: 16px;
          }

          .toggle-title {
            font-size: 1rem;
          }

          .toggle-desc {
            font-size: 0.85rem;
          }

          .btn-primary {
            width: 100%;
            min-height: 2.75rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
