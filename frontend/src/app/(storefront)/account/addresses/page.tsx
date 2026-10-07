'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight } from 'lucide-react';

export default function AddressesPage() {
  const { user } = useAuthStore();
  
  // Basic mockup state for form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleForm = (id?: string) => {
    if (id) {
      setEditingId(id);
    } else {
      setEditingId(null);
    }
    setShowForm(!showForm);
  };

  return (
    <div className="account-section fade-in">
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-heading">Addresses</h1>
          <p className="page-subheading">Manage your saved delivery addresses.</p>
        </div>
        {!showForm && (
          <button className="text-action add-btn" onClick={() => toggleForm()}>
            + Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <div className="address-form-container">
          <h3 className="form-title">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
          <form className="address-form" onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="e.g. Ayesha Rahman" defaultValue={editingId ? user?.name : ''} required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+91" defaultValue={editingId ? user?.phone : ''} required />
              </div>
            </div>
            
            <div className="form-group">
              <label>Address Line 1</label>
              <input type="text" placeholder="Street address, company name, c/o" required />
            </div>
            
            <div className="form-group">
              <label>Address Line 2 (Optional)</label>
              <input type="text" placeholder="Apartment, suite, unit, building, floor, etc." />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>State</label>
                <input type="text" required />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Postal Code</label>
                <input type="text" required />
              </div>
              <div className="form-group">
                <label>Country</label>
                <select required defaultValue="India">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
            </div>

            <div className="form-checkbox">
              <label>
                <input type="checkbox" /> Set as default address
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Save Address</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="addresses-list">
          {(!user?.addresses || user.addresses.length === 0) ? (
            <div className="empty-state">
              <h3 className="empty-state-title">NO SAVED ADDRESSES</h3>
              <p className="empty-state-text">Add an address to make checkout faster.</p>
              <button className="btn-primary" onClick={() => toggleForm()}>
                + Add Address
              </button>
            </div>
          ) : (
            <div className="addresses-grid">
              {user.addresses.map((addr) => (
                <div key={addr.id} className="address-card">
                  {addr.isDefault && <span className="default-label">DEFAULT</span>}
                  <div className="address-content">
                    <span className="address-name">{addr.name || user.name}</span>
                    <span className="address-line">{addr.line1}</span>
                    <span className="address-line">{addr.city}, {addr.state}</span>
                    <span className="address-line">{addr.pincode}</span>
                  </div>
                  <div className="address-actions">
                    <button className="text-action-sm" onClick={() => toggleForm(addr.id)}>
                      Edit <ArrowRight size={12}/>
                    </button>
                    <button className="text-action-sm" onClick={() => {
                      if (window.confirm('Are you sure you want to remove this address?')) {
                        // Mock remove
                      }
                    }}>
                      Remove <ArrowRight size={12}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .add-btn {
          margin-top: 12px;
        }

        .addresses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
          gap: 24px;
        }
        
        .address-card {
          padding: 32px 24px;
          border: 1px solid var(--overlay-black-10);
          display: flex;
          flex-direction: column;
          position: relative;
          background: var(--bg-primary);
          transition: border-color 0.2s ease;
        }

        .address-card:hover {
          border-color: var(--overlay-black-30);
        }
        
        .default-label {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 16px;
          font-weight: 500;
        }
        
        .address-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 32px;
        }
        
        .address-name {
          font-weight: 500;
          font-size: 1.05rem;
          margin-bottom: 8px;
        }
        
        .address-line {
          font-size: 0.9rem;
          color: var(--overlay-black-70);
          line-height: 1.4;
        }
        
        .address-actions {
          margin-top: auto;
          display: flex;
          gap: 16px;
        }

        .text-action {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
          text-decoration: none;
          transition: opacity 0.2s ease;
          opacity: 0.8;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
        }
        
        .text-action:hover {
          opacity: 1;
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

        /* Form Styles */
        .address-form-container {
          max-width: 600px;
          border: 1px solid var(--overlay-black-10);
          padding: 40px;
          background: var(--color-neutral-50);
        }

        .form-title {
          font-size: 1.1rem;
          font-family: var(--font-display);
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .address-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-row > .form-group {
          flex: 1;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-group input,
        .form-group select {
          padding: 12px 16px;
          border: 1px solid var(--overlay-black-20);
          border-radius: 0;
          background: var(--bg-primary);
          font-size: 0.95rem;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--text-primary);
        }

        .form-checkbox {
          margin-top: 8px;
        }

        .form-checkbox label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--text-primary);
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .btn-primary {
          background-color: var(--text-primary);
          color: var(--text-inverse);
          border: none;
          padding: 12px 24px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-outline {
          background-color: transparent;
          color: var(--text-primary);
          border: 1px solid var(--overlay-black-20);
          padding: 12px 24px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }

        .btn-outline:hover {
          border-color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
