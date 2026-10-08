'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useToastStore();

  // Newsletter interactive state
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please provide a valid client email address.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Welcome to the Aurelia Private Ledger.', 'success');
    }, 400);
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Atelier Footer"
      style={{
        backgroundColor: 'var(--surface-brand-dark)',
        color: 'var(--text-inverse)',
        borderTop: '1px solid var(--overlay-white-10)',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
        {/* ================================================================= */}
        {/* 1. NEWSLETTER / PRIVATE LEDGER SECTION                            */}
        {/* ================================================================= */}
        <section
          className="footer-newsletter-section"
          aria-labelledby="footer-newsletter-heading"
          style={{
            paddingTop: '64px',
            paddingBottom: '56px',
            borderBottom: '1px solid var(--overlay-white-10)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Copy side */}
            <div style={{ maxWidth: '560px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--color-golden, var(--brand-accent))',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                Atelier Correspondence
              </span>
              <h2
                id="footer-newsletter-heading"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3vw, 2.3rem)',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: 'var(--text-inverse)',
                  marginBottom: '10px',
                  lineHeight: 1.2,
                }}
              >
                The Private Ledger
              </h2>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--overlay-white-45)',
                  lineHeight: 1.65,
                }}
              >
                Receive invitations to private salon previews, new editions, and styling consultations. Dispatched exclusively via email.
              </p>
            </div>

            {/* Input & Form side */}
            <div style={{ width: '100%', maxWidth: '480px', justifySelf: 'end' }}>
              {isSubmitted ? (
                <div
                  style={{
                    padding: '16px 20px',
                    backgroundColor: 'var(--overlay-white-10)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: 'var(--radius-sm, 8px)',
                    border: '1px solid var(--color-golden-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckCircle2 size={20} style={{ color: 'var(--color-golden, var(--brand-accent))', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-inverse)', lineHeight: 1.5 }}>
                    Your email ({email}) is inscribed. We honor your privacy with email-only correspondence.
                  </span>
                </div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div
                    className="footer-input-wrapper"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: 'var(--overlay-white-10)',
                      borderRadius: 'var(--radius-pill, 999px)',
                      padding: '5px 6px 5px 18px',
                      border: '1px solid var(--overlay-white-10)',
                      transition: 'border-color 200ms ease, box-shadow 200ms ease',
                    }}
                  >
                    <Mail size={17} className="mail-icon" style={{ color: 'var(--overlay-white-45)', marginRight: '10px', flexShrink: 0 }} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Email address for private ledger"
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-inverse)',
                        fontSize: '0.88rem',
                        minWidth: 0,
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="footer-inscribe-btn"
                      style={{
                        flexShrink: 0,
                        backgroundColor: 'var(--color-golden, var(--brand-accent))',
                        color: "var(--text-primary)",
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        padding: '10px 22px',
                        borderRadius: 'var(--radius-pill, 999px)',
                        border: 'none',
                        cursor: isLoading ? 'wait' : 'pointer',
                        transition: 'background-color 200ms ease, transform 150ms ease',
                      }}
                    >
                      {isLoading ? 'Inscribing...' : 'Inscribe'}
                    </button>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--overlay-white-45)', paddingLeft: '14px' }}>
                    Strictly confidential. No SMS or promotional push alerts.
                  </span>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. MAIN 4-COLUMN CONTENT GRID                                     */}
        {/* ================================================================= */}
        <div
          style={{
            paddingTop: '64px',
            paddingBottom: '56px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '48px',
          }}
          className="footer-columns-grid"
        >
          {/* COLUMN 1 — AURELIA */}
          <div style={{ maxWidth: '340px' }} className="footer-col-brand">
            <Link
              href="/"
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                color: 'inherit',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.9rem',
                  letterSpacing: '0.22em',
                  fontWeight: 600,
                  color: 'var(--text-inverse)',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                {BRAND_NAME}
              </span>
            </Link>

            <span
              style={{
                display: 'block',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-golden, var(--brand-accent))',
                fontWeight: 500,
                marginBottom: '16px',
              }}
            >
              {BRAND_TAGLINE}
            </span>

            <p
              className="hidden-mobile"
              style={{
                fontSize: '0.86rem',
                color: 'var(--overlay-white-45)',
                lineHeight: 1.7,
                marginBottom: '14px',
              }}
            >
              {BRAND_TAGLINE}. Crafted between Milan, Tuscany, and Paris with traceable European materials and enduring silhouette integrity.
            </p>

            <p
              className="hidden-mobile"
              style={{
                fontSize: '0.8rem',
                color: 'var(--overlay-white-45)',
                lineHeight: 1.6,
                fontStyle: 'italic',
                marginBottom: '24px',
              }}
            >
              Designed with enduring silhouette integrity and crafted from traceable European materials.
            </p>

            {/* Atelier Headquarters & Concierge Inquiries */}
            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--overlay-white-10)',
                fontSize: '0.78rem',
                color: 'var(--overlay-white-45)',
                lineHeight: 1.65,
              }}
            >
              <div style={{ color: 'var(--color-golden, var(--brand-accent))', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                Atelier Operations
              </div>
              <div>Penthouse 9, UB City, Bengaluru, Karnataka, 560001, India</div>
              <div>Direct: +91 98000 11223</div>
            </div>
          </div>

          {/* COLUMN 2 — COLLECTIONS (All 8 registered categories) */}
          <div className="footer-nav-col">
            <h3
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--overlay-white-45)',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              Collections
            </h3>

            <ul className="footer-links-list">
              <li>
                <Link href="/shop?categorySlug=outerwear" className="footer-link">
                  Outerwear & Coats
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=tailoring" className="footer-link">
                  Bespoke Tailoring
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=eveningwear" className="footer-link">
                  Silk Eveningwear
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/shop?categorySlug=knitwear" className="footer-link">
                  Cashmere Knitwear
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=leather-goods" className="footer-link">
                  Hand-Finished Leather Goods
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/shop?categorySlug=footwear" className="footer-link">
                  Florentine Footwear
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/shop?categorySlug=fine-jewelry" className="footer-link">
                  Sculptural Fine Jewelry
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/shop?categorySlug=fragrances" className="footer-link">
                  Artisanal Fragrances
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — CLIENT CONCIERGE */}
          <div className="footer-nav-col">
            <h3
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--overlay-white-45)',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              Client Concierge
            </h3>

            <ul className="footer-links-list">
              <li>
                <Link href="/account" className="footer-link">
                  Private Client Account
                </Link>
              </li>
              <li>
                <Link href="/account/support" className="footer-link">
                  Bespoke Inquiries & Support
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/offers" className="footer-link">
                  Seasonal Privileges
                </Link>
              </li>
              <li className="hidden-mobile">
                <Link href="/cart" className="footer-link">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="footer-link">
                  Order History
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — THE HOUSE */}
          <div className="footer-nav-col">
            <h3
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--overlay-white-45)',
                fontWeight: 600,
                marginBottom: '20px',
              }}
            >
              The House
            </h3>

            <div className="footer-links-list">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <Link href="/#brand-story" className="footer-link">
                    The House Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/shop?tag=new-arrival" className="footer-link">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/shop?tag=signature" className="footer-link">
                    Signature Icons
                  </Link>
                </li>
                <li className="hidden-mobile">
                  <Link href="/shop?tag=bestseller" className="footer-link">
                    House Favorites
                  </Link>
                </li>

              </ul>

              {/* Non-linked editorial hallmarks */}
              <div
                className="hidden-mobile"
                style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--overlay-white-10)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: 'var(--overlay-white-45)',
                  lineHeight: 1.6,
                }}
              >
                <span>Crafted between Milan, Tuscany, and Paris.</span>
                <span>Traceable European materials.</span>
                <span>Timeless heirloom construction.</span>
              </div>
            </div>
          </div>
        </div>



        {/* ================================================================= */}
        {/* 4. BOTTOM COPYRIGHT BAR                                           */}
        {/* ================================================================= */}
        <div
          style={{
            borderTop: '1px solid var(--overlay-white-10)',
            paddingTop: '24px',
            paddingBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            fontSize: '0.8rem',
            color: 'var(--overlay-white-45)',
          }}
        >
          <div>
            © 2026 {BRAND_NAME} Atelier. All rights reserved.
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>Prices in Indian Rupees (INR ₹)</span>
            <span aria-hidden="true" style={{ color: 'var(--overlay-white-45)' }}>·</span>
            <span>Complimentary Insured Courier</span>
          </div>
        </div>
      </div>

      {/* Styled JSX for Responsive Layout, Links & Hover States */}
      <style jsx>{`
        @keyframes mailShake {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-6deg); }
          50% { transform: translateY(-3px) rotate(6deg); }
          75% { transform: translateY(-3px) rotate(-3deg); }
          100% { transform: translateY(-3px) rotate(0deg); }
        }

        :global(.mail-icon) {
          cursor: pointer;
        }

        :global(.mail-icon:hover) {
          animation: mailShake 0.4s ease-in-out forwards;
        }

        .footer-link {
          font-size: 0.88rem;
          color: var(--overlay-white-45);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          transition: color 200ms ease, transform 150ms ease;
        }
        .footer-link:hover {
          color: var(--bg-subtle);
          transform: translateX(3px);
        }
        .footer-link:focus-visible {
          outline: 2px solid var(--color-golden, var(--brand-accent));
          outline-offset: 4px;
          border-radius: 2px;
        }
        .footer-input-wrapper:focus-within {
          border-color: var(--color-golden, var(--brand-accent)) !important;
          box-shadow: 0 0 0 1px var(--color-golden, var(--brand-accent));
        }
        .footer-inscribe-btn:hover:not(:disabled) {
          background-color: var(--color-golden-600) !important;
          transform: translateY(-1px);
        }
        .footer-inscribe-btn:focus-visible {
          outline: 2px solid var(--color-diamond);
          outline-offset: 2px;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        @media (max-width: 767px) {
          .hidden-mobile {
            display: none !important;
          }
          .footer-newsletter-section {
            display: none !important;
          }
          .footer-columns-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }
          .footer-col-brand {
            max-width: 100% !important;
            padding-bottom: 24px;
            border-bottom: 1px solid rgba(224, 224, 224, 0.15);
          }
          .footer-link {
            min-height: 40px;
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
};
