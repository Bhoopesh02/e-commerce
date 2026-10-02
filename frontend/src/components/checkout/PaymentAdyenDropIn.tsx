'use client';

import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Banknote, ShieldCheck, Check } from 'lucide-react';
import { formatPrice } from '@/lib/formatPrice';

export type PaymentMethodType = 'UPI' | 'Card' | 'NetBanking' | 'Wallet' | 'COD';

export interface PaymentDetails {
  method: PaymentMethodType;
  upiVpa?: string;
  cardLast4?: string;
  bankName?: string;
  walletName?: string;
}

interface PaymentAdyenDropInProps {
  amount: number;
  onSelectPayment: (details: PaymentDetails) => void;
  selectedMethod: PaymentMethodType;
}

export const PaymentAdyenDropIn: React.FC<PaymentAdyenDropInProps> = ({
  amount,
  onSelectPayment,
  selectedMethod,
}) => {
  const [upiVpa, setUpiVpa] = useState('client@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8921 7734 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardName, setCardName] = useState('AYESHA RAHMAN');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, _setSelectedWallet] = useState('Apple Pay / PhonePe Wallet');

  const handleMethodChange = (method: PaymentMethodType) => {
    const details: PaymentDetails = { method };
    if (method === 'UPI') details.upiVpa = upiVpa;
    if (method === 'Card') details.cardLast4 = cardNumber.slice(-4);
    if (method === 'NetBanking') details.bankName = selectedBank;
    if (method === 'Wallet') details.walletName = selectedWallet;
    onSelectPayment(details);
  };

  return (
    <div
      style={{
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Adyen Drop-In Style Header */}
      <div
        style={{
          padding: '14px 20px',
          backgroundColor: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.04em' }}>
            Adyen Drop-In Secure Payment Engine
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          256-Bit TLS Encryption
        </span>
      </div>

      {/* Payment Options List */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 1. UPI (Instant Indian Bank Transfer) */}
        <div style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div
            onClick={() => handleMethodChange('UPI')}
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedMethod === 'UPI' ? 'rgba(194, 155, 76, 0.06)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="radio"
                name="payment"
                checked={selectedMethod === 'UPI'}
                onChange={() => handleMethodChange('UPI')}
              />
              <Smartphone size={20} style={{ color: 'var(--color-sapphire)' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  UPI (Google Pay, PhonePe, Paytm, BHIM)
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Zero-fee instant settlement via Virtual Payment Address
                </span>
              </div>
            </div>
            {selectedMethod === 'UPI' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
          </div>

          {selectedMethod === 'UPI' && (
            <div style={{ padding: '0 20px 20px 48px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Enter UPI ID / VPA
              </label>
              <input
                type="text"
                value={upiVpa}
                onChange={(e) => {
                  setUpiVpa(e.target.value);
                  onSelectPayment({ method: 'UPI', upiVpa: e.target.value });
                }}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          )}
        </div>

        {/* 2. Credit / Debit Cards (Visa, Mastercard, Amex) */}
        <div style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div
            onClick={() => handleMethodChange('Card')}
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedMethod === 'Card' ? 'rgba(194, 155, 76, 0.06)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="radio"
                name="payment"
                checked={selectedMethod === 'Card'}
                onChange={() => handleMethodChange('Card')}
              />
              <CreditCard size={20} style={{ color: 'var(--color-sapphire)' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Credit or Debit Card
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Visa, Mastercard, American Express, Diners Club
                </span>
              </div>
            </div>
            {selectedMethod === 'Card' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
          </div>

          {selectedMethod === 'Card' && (
            <div style={{ padding: '0 20px 20px 48px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    padding: '10px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    letterSpacing: '0.08em',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', maxWidth: '360px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Valid Thru
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
                <div style={{ width: '90px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '360px',
                    padding: '10px 14px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 3. Net Banking */}
        <div style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div
            onClick={() => handleMethodChange('NetBanking')}
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedMethod === 'NetBanking' ? 'rgba(194, 155, 76, 0.06)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="radio"
                name="payment"
                checked={selectedMethod === 'NetBanking'}
                onChange={() => handleMethodChange('NetBanking')}
              />
              <Building2 size={20} style={{ color: 'var(--color-sapphire)' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Net Banking
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  All major Indian private and public institutions
                </span>
              </div>
            </div>
            {selectedMethod === 'NetBanking' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
          </div>

          {selectedMethod === 'NetBanking' && (
            <div style={{ padding: '0 20px 20px 48px' }}>
              <select
                value={selectedBank}
                onChange={(e) => {
                  setSelectedBank(e.target.value);
                  onSelectPayment({ method: 'NetBanking', bankName: e.target.value });
                }}
                style={{
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-surface)',
                  width: '100%',
                  maxWidth: '360px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}
        </div>

        {/* 4. Digital Wallets */}
        <div style={{ borderBottom: '1px solid var(--border-light)' }}>
          <div
            onClick={() => handleMethodChange('Wallet')}
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedMethod === 'Wallet' ? 'rgba(194, 155, 76, 0.06)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="radio"
                name="payment"
                checked={selectedMethod === 'Wallet'}
                onChange={() => handleMethodChange('Wallet')}
              />
              <Wallet size={20} style={{ color: 'var(--color-sapphire)' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Digital Wallets
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Paytm Wallet, Amazon Pay, Mobikwik
                </span>
              </div>
            </div>
            {selectedMethod === 'Wallet' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
          </div>
        </div>

        {/* 5. Cash on Delivery */}
        <div>
          <div
            onClick={() => handleMethodChange('COD')}
            style={{
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              backgroundColor: selectedMethod === 'COD' ? 'rgba(194, 155, 76, 0.06)' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <input
                type="radio"
                name="payment"
                checked={selectedMethod === 'COD'}
                onChange={() => handleMethodChange('COD')}
              />
              <Banknote size={20} style={{ color: 'var(--color-sapphire)' }} />
              <div>
                <span style={{ fontSize: '0.92rem', fontWeight: 600, display: 'block' }}>
                  Cash on Delivery (COD)
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Pay cash or card upon arrival of our white-glove courier
                </span>
              </div>
            </div>
            {selectedMethod === 'COD' && <Check size={16} style={{ color: 'var(--color-sapphire)' }} />}
          </div>
        </div>
      </div>
    </div>
  );
};
