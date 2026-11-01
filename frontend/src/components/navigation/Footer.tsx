'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_NAME } from '@/lib/constants';
import { useToastStore } from '@/store/useToastStore';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useToastStore();

  // Newsletter interactive state
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mobile Accordion states
  const [isHouseOpen, setIsHouseOpen] = useState(false);
  const [isClientCareOpen, setIsClientCareOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Welcome to the Aurelia Private Ledger.', 'success');
    }, 350);
  };

  return (
    <footer
      role="contentinfo"
      aria-label="Aurelia Atelier Footer"
      className="almada-editorial-footer"
    >
      <div className="container footer-content-wrap">
        {/* ================================================================= */}
        {/* 1. TOP ROW: 'Discover the Atelier' + Sub-navigation (Desktop only) */}
        {/* ================================================================= */}
        <div className="footer-top-strip desktop-only">
          <span className="footer-top-eyebrow">Discover the Atelier</span>
          <nav className="footer-top-nav" aria-label="Atelier Highlights">
            <Link href="/shop?categorySlug=tailoring" className="footer-top-link">
              Ready-to-Wear
            </Link>
            <Link href="/shop?categorySlug=eveningwear" className="footer-top-link">
              Haute Couture Silks
            </Link>
            <Link href="/about" className="footer-top-link">
              Atelier Chronicle
            </Link>
            <Link href="/new-arrivals" className="footer-top-link">
              New Editions
            </Link>
          </nav>
        </div>

        {/* ================================================================= */}
        {/* 2. DESKTOP 3-COLUMN EDITORIAL GRID (>= 768px)                     */}
        {/* ================================================================= */}
        <div className="footer-editorial-grid desktop-only">
          {/* COLUMN 1: Newsletter & Atelier Address */}
          <div className="footer-grid-col footer-col-newsletter">
            <h2 className="footer-col-heading">THE PRIVATE LEDGER</h2>
            <p className="footer-col-description">
              Receive private salon invitations, new collection releases, and bespoke atelier updates directly to your inbox.
            </p>

            {isSubmitted ? (
              <div className="footer-newsletter-success">
                <Check size={16} className="footer-success-icon" />
                <span>You have been inscribed into the private ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <div className="footer-underline-input-wrapper">
                  <input
                    type="email"
                    required
                    placeholder="Enter e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address for private ledger"
                    className="footer-underline-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Subscribe to newsletter"
                    className="footer-submit-arrow-btn"
                  >
                    <ChevronRight size={17} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}

            {/* Atelier Address & Flagship Location */}
            <div className="footer-address-block">
              <span className="footer-address-title">Flagship Atelier &amp; Salons</span>
              <p className="footer-address-text">
                Penthouse 9, UB City, Vittal Mallya Road<br />
                Bengaluru, Karnataka 560001, India
              </p>
              <div className="footer-address-contact">
                <a href="tel:+919800011223" className="footer-contact-link">
                  +91 98000 11223
                </a>
                <span className="footer-contact-divider" aria-hidden="true">·</span>
                <a href="mailto:concierge@aurelia-atelier.com" className="footer-contact-link">
                  concierge@aurelia-atelier.com
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: The House & Heritage */}
          <div className="footer-grid-col footer-col-links">
            <span className="footer-nav-heading">The House</span>
            <ul className="footer-nav-list">
              <li>
                <Link href="/about" className="footer-nav-link">
                  The House Story
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="footer-nav-link">
                  Artisanal Craftsmanship
                </Link>
              </li>
              <li>
                <Link href="/faq?category=garment-care" className="footer-nav-link">
                  Material &amp; Archive Care
                </Link>
              </li>
              <li>
                <Link href="/about#boutiques" className="footer-nav-link">
                  Private Salons
                </Link>
              </li>
              <li>
                <Link href="/about#press" className="footer-nav-link">
                  Editorial &amp; Press
                </Link>
              </li>

            </ul>
          </div>

          {/* COLUMN 3: Client Concierge & Customer Care */}
          <div className="footer-grid-col footer-col-links">
            <span className="footer-nav-heading">Customer Care</span>
            <ul className="footer-nav-list">
              <li>
                <Link href="/account/support" className="footer-nav-link">
                  Client Concierge Desk
                </Link>
              </li>
              <li>
                <Link href="/faq" className="footer-nav-link">
                  Help Centre &amp; FAQs
                </Link>
              </li>
              <li>
                <Link href="/faq?category=shipping-delivery" className="footer-nav-link">
                  White-Glove Shipping
                </Link>
              </li>
              <li>
                <Link href="/faq?category=returns-exchanges" className="footer-nav-link">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/account/orders/tracking" className="footer-nav-link">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link href="/faq?category=payments-privilege" className="footer-nav-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/faq?category=payments-privilege" className="footer-nav-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. MOBILE EDITORIAL VIEW (< 768px)                                */}
        {/* ================================================================= */}
        <div className="footer-mobile-view mobile-only">
          {/* Section A: Newsletter / Mailing list */}
          <div className="footer-mobile-newsletter">
            <h2 className="footer-mobile-heading">THE PRIVATE LEDGER</h2>
            <p className="footer-mobile-description">
              Receive private salon invitations, new collection releases, and bespoke atelier updates directly to your inbox.
            </p>

            {isSubmitted ? (
              <div className="footer-newsletter-success">
                <Check size={16} className="footer-success-icon" />
                <span>You have been inscribed into the private ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                <div className="footer-underline-input-wrapper">
                  <input
                    type="email"
                    required
                    placeholder="Enter e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label="Email address for private ledger"
                    className="footer-underline-input"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    aria-label="Subscribe to newsletter"
                    className="footer-submit-arrow-btn"
                  >
                    <ChevronRight size={17} strokeWidth={1.5} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section B: Collapsible Accordions matching mobile screenshot */}
          <div className="footer-mobile-accordions">
            {/* Accordion 1: THE HOUSE */}
            <div className="footer-accordion-item">
              <button
                type="button"
                className="footer-accordion-trigger"
                onClick={() => setIsHouseOpen((prev) => !prev)}
                aria-expanded={isHouseOpen}
                aria-controls="footer-house-links"
              >
                <span className="footer-accordion-title">THE HOUSE &amp; ATELIER</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={`footer-accordion-icon ${isHouseOpen ? 'is-open' : ''}`}
                />
              </button>
              {isHouseOpen && (
                <div id="footer-house-links" className="footer-accordion-content">
                  <ul className="footer-mobile-nav-list">
                    <li>
                      <Link href="/about" className="footer-mobile-nav-link">
                        The House Story
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#craftsmanship" className="footer-mobile-nav-link">
                        Artisanal Craftsmanship
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq?category=garment-care" className="footer-mobile-nav-link">
                        Material &amp; Archive Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#boutiques" className="footer-mobile-nav-link">
                        Private Salons
                      </Link>
                    </li>
                    <li>
                      <Link href="/about#press" className="footer-mobile-nav-link">
                        Editorial &amp; Press
                      </Link>
                    </li>

                  </ul>
                </div>
              )}
            </div>

            {/* Accordion 2: CLIENT CARE */}
            <div className="footer-accordion-item">
              <button
                type="button"
                className="footer-accordion-trigger"
                onClick={() => setIsClientCareOpen((prev) => !prev)}
                aria-expanded={isClientCareOpen}
                aria-controls="footer-client-care-links"
              >
                <span className="footer-accordion-title">CUSTOMER CARE</span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.5}
                  className={`footer-accordion-icon ${isClientCareOpen ? 'is-open' : ''}`}
                />
              </button>
              {isClientCareOpen && (
                <div id="footer-client-care-links" className="footer-accordion-content">
                  <ul className="footer-mobile-nav-list">
                    <li>
                      <Link href="/account/support" className="footer-mobile-nav-link">
                        Client Concierge Desk
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="footer-mobile-nav-link">
                        Help Centre &amp; FAQs
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq?category=shipping-delivery" className="footer-mobile-nav-link">
                        White-Glove Shipping
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq?category=returns-exchanges" className="footer-mobile-nav-link">
                        Return &amp; Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/account/orders/tracking" className="footer-mobile-nav-link">
                        Track Consignment
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq?category=payments-privilege" className="footer-mobile-nav-link">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq?category=payments-privilege" className="footer-mobile-nav-link">
                        Terms of Service
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Section C: Mobile Flagship Address Block */}
          <div className="footer-mobile-address-block">
            <span className="footer-address-title">Flagship Atelier &amp; Salons</span>
            <p className="footer-address-text">
              Penthouse 9, UB City, Vittal Mallya Road<br />
              Bengaluru, Karnataka 560001, India
            </p>
            <div className="footer-address-contact">
              <a href="tel:+919800011223" className="footer-contact-link">
                +91 98000 11223
              </a>
              <span className="footer-contact-divider" aria-hidden="true">·</span>
              <a href="mailto:concierge@aurelia-atelier.com" className="footer-contact-link">
                concierge@aurelia-atelier.com
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. MASSIVE BOTTOM BRAND WORDMARK (ALMADA STYLE -> AURELIA)         */}
        {/* ================================================================= */}
        <div className="footer-brand-stage" aria-label={`${BRAND_NAME} Brandmark`}>
          <Link href="/" className="footer-brand-anchor">
            <div className="footer-brand-letters">
              <span>A</span>
              <span>U</span>
              <span>R</span>
              <span>E</span>
              <span>L</span>
              <span>I</span>
              <span>A</span>
            </div>
          </Link>
          <div className="footer-bottom-copyright">
            © 2026 {BRAND_NAME} ATELIER
          </div>
        </div>
      </div>

      {/* Styled JSX matching the minimalist editorial design */}
      <style jsx>{`
        .almada-editorial-footer {
          background-color: #ffffff;
          color: #141414;
          border-top: 1px solid #eaeaea;
          margin-top: auto;
          position: relative;
          z-index: 10;
          padding-top: clamp(40px, 6vw, 76px);
          padding-bottom: clamp(24px, 4vw, 36px);
          overflow: hidden;
        }

        .footer-content-wrap {
          padding-left: max(20px, env(safe-area-inset-left, 0px));
          padding-right: max(20px, env(safe-area-inset-right, 0px));
          max-width: 1360px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Responsive Visibility Switches */
        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 767px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: block !important;
          }
        }

        /* 1. TOP STRIP (DESKTOP) */
        .footer-top-strip {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: clamp(40px, 5.5vw, 68px);
        }

        .footer-top-eyebrow {
          font-family: var(--font-display, 'Cormorant Garamond', Garamond, serif);
          font-style: italic;
          font-size: 1.18rem;
          color: #141414;
          letter-spacing: 0.01em;
          line-height: 1.2;
        }

        .footer-top-nav {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          column-gap: clamp(24px, 4vw, 48px);
          row-gap: 12px;
        }

        .footer-top-link {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.95rem;
          font-weight: 400;
          color: #141414;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 180ms ease, opacity 180ms ease;
        }

        .footer-top-link:hover {
          color: #666666;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        /* 2. MAIN 3-COLUMN GRID (DESKTOP) */
        .footer-editorial-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: clamp(32px, 5vw, 72px);
          align-items: flex-start;
          margin-bottom: clamp(48px, 7vw, 92px);
        }

        .footer-grid-col {
          display: flex;
          flex-direction: column;
        }

        .footer-col-newsletter {
          max-width: 440px;
        }

        .footer-col-heading {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #141414;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .footer-col-description {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.84rem;
          color: #666666;
          line-height: 1.6;
          margin: 0 0 24px 0;
        }

        .footer-underline-input-wrapper {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #141414;
          padding-bottom: 8px;
          position: relative;
          transition: border-color 200ms ease;
        }

        .footer-underline-input-wrapper:focus-within {
          border-bottom-width: 1.5px;
        }

        .footer-underline-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.92rem;
          color: #141414;
          padding: 0 8px 0 0;
          min-width: 0;
        }

        .footer-underline-input::placeholder {
          color: #8c8c8c;
          font-weight: 300;
        }

        .footer-submit-arrow-btn {
          background: transparent;
          border: none;
          padding: 0 2px;
          cursor: pointer;
          color: #141414;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: transform 180ms ease, opacity 180ms ease;
        }

        .footer-submit-arrow-btn:hover:not(:disabled) {
          transform: translateX(4px);
          opacity: 0.7;
        }

        .footer-newsletter-success {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #141414;
          padding-top: 4px;
        }

        .footer-success-icon {
          color: #1e6f5c;
          flex-shrink: 0;
        }

        /* Atelier Address Block (Desktop) */
        .footer-address-block {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid #eeeeee;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .footer-address-title {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.76rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #141414;
        }

        .footer-address-text {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.83rem;
          color: #666666;
          line-height: 1.55;
          margin: 0;
        }

        .footer-address-contact {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          margin-top: 2px;
        }

        .footer-contact-link {
          color: #141414;
          text-decoration: none;
          transition: color 180ms ease;
        }

        .footer-contact-link:hover {
          color: #666666;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .footer-contact-divider {
          color: #999999;
        }

        /* Links Headings (Desktop) */
        .footer-nav-heading {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #141414;
          margin-bottom: 14px;
          display: block;
        }

        /* Links (Desktop) */
        .footer-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 13px;
        }

        .footer-nav-link {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.88rem;
          font-weight: 400;
          color: #141414;
          text-decoration: none;
          display: inline-block;
          transition: color 180ms ease, opacity 180ms ease;
        }

        .footer-nav-link:hover {
          color: #666666;
        }

        .footer-nav-link:focus-visible {
          outline: 1px dashed #141414;
          outline-offset: 2px;
        }

        /* ================================================================= */
        /* 3. MOBILE VIEW SPECIFIC STYLES                                    */
        /* ================================================================= */
        .footer-mobile-view {
          margin-bottom: 40px;
        }

        .footer-mobile-newsletter {
          margin-bottom: 32px;
        }

        .footer-mobile-heading {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.84rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #141414;
          margin: 0 0 10px 0;
        }

        .footer-mobile-description {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.85rem;
          color: #555555;
          line-height: 1.55;
          margin: 0 0 22px 0;
        }

        /* Mobile Accordions */
        .footer-mobile-accordions {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .footer-accordion-item {
          border-bottom: 1px solid transparent;
        }

        .footer-accordion-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
          border: none;
          padding: 14px 0;
          cursor: pointer;
          text-align: left;
        }

        .footer-accordion-title {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.84rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #141414;
        }

        .footer-accordion-icon {
          color: #141414;
          transition: transform 220ms ease;
          flex-shrink: 0;
        }

        .footer-accordion-icon.is-open {
          transform: rotate(180deg);
        }

        .footer-accordion-content {
          padding-bottom: 16px;
          animation: accordionFade 200ms ease;
        }

        @keyframes accordionFade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-mobile-nav-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-mobile-nav-link {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.88rem;
          color: #555555;
          text-decoration: none;
          display: inline-block;
          padding: 2px 0;
          transition: color 180ms ease;
        }

        .footer-mobile-nav-link:hover {
          color: #141414;
        }

        /* Mobile Address Block */
        .footer-mobile-address-block {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #eeeeee;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        /* ================================================================= */
        /* 4. MASSIVE BOTTOM BRAND STAGE                                     */
        /* ================================================================= */
        .footer-brand-stage {
          width: 100%;
          margin-top: 24px;
        }

        .footer-brand-anchor {
          display: block;
          text-decoration: none;
          color: #141414;
          width: 100%;
          user-select: none;
        }

        .footer-brand-letters {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          width: 100%;
          font-family: var(--font-display, 'Cormorant Garamond', Garamond, Didot, serif);
          font-size: clamp(3.2rem, 15.6vw, 15.8rem);
          font-weight: 350;
          line-height: 0.82;
          letter-spacing: -0.01em;
          color: #141414;
          transform: scaleY(1.04);
          transition: opacity 250ms ease;
        }

        .footer-brand-letters span {
          display: inline-block;
          text-align: center;
        }

        .footer-brand-anchor:hover .footer-brand-letters {
          opacity: 0.85;
        }

        .footer-bottom-copyright {
          font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #767676;
          margin-top: 14px;
        }

        @media (max-width: 767px) {
          .footer-brand-letters {
            font-size: clamp(2.4rem, 15.2vw, 4.8rem);
            line-height: 0.9;
          }

          .footer-bottom-copyright {
            font-size: 0.65rem;
            margin-top: 12px;
          }
        }
      `}</style>
    </footer>
  );
};
