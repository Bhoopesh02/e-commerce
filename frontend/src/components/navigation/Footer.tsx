'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BRAND_NAME, BRAND_TAGLINE } from '@/lib/constants';
import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, Mail } from 'lucide-react';

/* Social Icon SVGs matching reference image */
const SocialIcons = {
  Facebook: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  ),
  YouTube: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  Instagram: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Telegram: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  ),
  WhatsApp: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.301-.15-1.776-.876-2.051-.976-.275-.1-.475-.15-.675.15-.2.301-.775.976-.95 1.176-.175.2-.35.225-.65.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.676-2.088-.175-.301-.019-.463.131-.613.136-.135.301-.35.451-.525.15-.175.2-.301.301-.501.1-.2.05-.375-.025-.525-.075-.15-.675-1.627-.925-2.228-.244-.585-.492-.506-.675-.515-.175-.009-.375-.01-.575-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.026-1.05 2.502 0 1.476 1.075 2.899 1.225 3.1 0 .201 2.115 3.23 5.123 4.529.715.309 1.274.494 1.71.633.719.229 1.374.197 1.892.12.578-.087 1.776-.726 2.026-1.428.25-.702.25-1.303.175-1.428-.075-.125-.275-.2-.575-.35zm-5.467 7.618h-.005a10.01 10.01 0 0 1-5.1-1.399l-.366-.217-3.794.995 1.013-3.699-.239-.379a10.007 10.007 0 0 1-1.536-5.289c0-5.524 4.495-10.02 10.025-10.02 2.677 0 5.194 1.043 7.086 2.937a9.967 9.967 0 0 1 2.935 7.083c0 5.525-4.495 10.02-10.02 10.02zm8.508-18.528A11.942 11.942 0 0 0 12.005 0C5.385 0 .007 5.378.007 11.998c0 2.113.552 4.176 1.602 5.996L0 24l6.177-1.62a11.98 11.98 0 0 0 5.828 1.499h.005c6.619 0 11.996-5.379 11.996-12 0-3.206-1.249-6.22-3.513-8.487z" />
    </svg>
  ),
};

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
        backgroundColor: 'var(--color-black-tie)',
        color: 'var(--color-diamond)',
        borderTop: '1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.1))',
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container footer-inner-container">
        {/* ================================================================= */}
        {/* 1. NEWSLETTER / PRIVATE LEDGER SECTION                            */}
        {/* ================================================================= */}
        <section
          className="footer-newsletter-section"
          aria-labelledby="footer-newsletter-heading"
        >
          <div className="footer-newsletter-grid">
            {/* Copy side */}
            <div className="footer-newsletter-copy">
              <span className="footer-newsletter-badge">
                Atelier Correspondence
              </span>
              <h2 id="footer-newsletter-heading" className="footer-newsletter-title">
                The Private Ledger
              </h2>
              <p className="footer-newsletter-desc">
                Receive invitations to private salon previews, new editions, and styling consultations — straight to your inbox.
              </p>
            </div>

            {/* Input & Form side */}
            <div className="footer-newsletter-form-wrapper">
              {isSubmitted ? (
                <div className="footer-newsletter-success">
                  <CheckCircle2 size={20} style={{ color: 'var(--color-golden-500, #C29B4C)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.86rem', color: 'var(--color-diamond)', lineHeight: 1.5 }}>
                    Your email ({email}) is inscribed. We honor your privacy with email-only correspondence.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                  <div className="footer-input-wrapper">
                    <Mail size={17} className="mail-icon" style={{ color: 'var(--color-diamond)', opacity: 0.65, marginRight: '10px', flexShrink: 0 }} />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-label="Email address for private ledger"
                      className="footer-newsletter-input"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="footer-inscribe-btn"
                    >
                      {isLoading ? 'Inscribing...' : 'Inscribe'}
                    </button>
                  </div>
                  <span className="footer-privacy-note">
                    Strictly confidential. No SMS or promotional push alerts.
                  </span>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. MOBILE-SPECIFIC CENTERED BRAND HEADER (Option 1)              */}
        {/* ================================================================= */}
        <div className="mobile-only footer-mobile-brand-header">
          <Link href="/" className="footer-mobile-brand-link">
            <span className="footer-mobile-brand-title">{BRAND_NAME}</span>
          </Link>
          <span className="footer-mobile-brand-tagline">{BRAND_TAGLINE}</span>
        </div>

        {/* ================================================================= */}
        {/* 3. MOBILE-SPECIFIC 2-COLUMN NAVIGATION GRID (Option 1)           */}
        {/* ================================================================= */}
        <div className="mobile-only footer-mobile-columns-wrapper">
          <div className="footer-mobile-two-col-grid">
            {/* Column 1 — Customer Support */}
            <div className="footer-mobile-nav-column">
              <h3 className="footer-column-heading footer-underlined-heading">
                Customer Support
              </h3>
              <ul className="footer-links-list">
                <li>
                  <Link href="/account/support" className="footer-link">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/account/support" className="footer-link">
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/account/support" className="footer-link">
                    Return & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/account/support" className="footer-link">
                    Bespoke Support
                  </Link>
                </li>
                <li>
                  <Link href="/account/orders/tracking" className="footer-link">
                    Track Your Order
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 — The House / Quick Navigation */}
            <div className="footer-mobile-nav-column">
              <h3 className="footer-column-heading footer-underlined-heading">
                The House
              </h3>
              <ul className="footer-links-list">
                <li>
                  <Link href="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="footer-link">
                    Collections
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
                <li>
                  <Link href="/#house-philosophy" className="footer-link">
                    House Philosophy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Centered Connect With Us & Social Icons Bar (Option 1) */}
          <div className="footer-mobile-connect-section">
            <h3 className="footer-column-heading footer-underlined-heading footer-center-heading">
              Connect With Us
            </h3>
            <div className="footer-mobile-contact-list">
              <a href="mailto:concierge@aurelia-atelier.com" className="footer-contact-link">
                Email: concierge@aurelia-atelier.com
              </a>
              <a href="tel:+919800011223" className="footer-contact-link">
                Phone: +91 98000 11223
              </a>
              <span className="footer-contact-text">
                Location: Penthouse 9, UB City, Bengaluru, India
              </span>
            </div>

            {/* Circular Social Icons matching reference image */}
            <div className="footer-social-icons-row" role="navigation" aria-label="Social media channels">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Facebook" className="footer-social-circle">
                <SocialIcons.Facebook />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on YouTube" className="footer-social-circle">
                <SocialIcons.YouTube />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Instagram" className="footer-social-circle">
                <SocialIcons.Instagram />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Telegram" className="footer-social-circle">
                <SocialIcons.Telegram />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on WhatsApp" className="footer-social-circle">
                <SocialIcons.WhatsApp />
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. DESKTOP-SPECIFIC 4-COLUMN CONTENT GRID                         */}
        {/* ================================================================= */}
        <div className="desktop-only footer-columns-grid">
          {/* COLUMN 1 — AURELIA BRAND & OPERATIONS */}
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
                  color: 'var(--color-diamond)',
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
                color: 'var(--color-icy-lake, #CAD4D6)',
                fontWeight: 500,
                marginBottom: '16px',
              }}
            >
              {BRAND_TAGLINE}
            </span>

            <p
              style={{
                fontSize: '0.86rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: 1.7,
                marginBottom: '14px',
              }}
            >
              {BRAND_TAGLINE}. Crafted between Milan, Tuscany, and Paris with traceable European materials and enduring silhouette integrity.
            </p>

            {/* Desktop Social Icons */}
            <div className="footer-social-icons-row desktop-socials" style={{ marginBottom: '20px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Facebook" className="footer-social-circle">
                <SocialIcons.Facebook />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on YouTube" className="footer-social-circle">
                <SocialIcons.YouTube />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Instagram" className="footer-social-circle">
                <SocialIcons.Instagram />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on Telegram" className="footer-social-circle">
                <SocialIcons.Telegram />
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="Aurelia on WhatsApp" className="footer-social-circle">
                <SocialIcons.WhatsApp />
              </a>
            </div>

            {/* Atelier Headquarters & Concierge Inquiries */}
            <div
              style={{
                paddingTop: '16px',
                borderTop: '1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.1))',
                fontSize: '0.78rem',
                color: 'rgba(255, 255, 255, 0.7)',
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

          {/* COLUMN 2 — COLLECTIONS */}
          <div className="footer-nav-col">
            <h3 className="footer-column-heading">Collections</h3>
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
              <li>
                <Link href="/shop?categorySlug=knitwear" className="footer-link">
                  Cashmere Knitwear
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=leather-goods" className="footer-link">
                  Hand-Finished Leather Goods
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=footwear" className="footer-link">
                  Florentine Footwear
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=fine-jewelry" className="footer-link">
                  Sculptural Fine Jewelry
                </Link>
              </li>
              <li>
                <Link href="/shop?categorySlug=fragrances" className="footer-link">
                  Artisanal Fragrances
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 — CLIENT CONCIERGE */}
          <div className="footer-nav-col">
            <h3 className="footer-column-heading">Client Concierge</h3>
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
              <li>
                <Link href="/offers" className="footer-link">
                  Seasonal Privileges
                </Link>
              </li>
              <li>
                <Link href="/cart" className="footer-link">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="footer-link">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/account/orders/tracking" className="footer-link">
                  Track Consignment
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 — THE HOUSE */}
          <div className="footer-nav-col">
            <h3 className="footer-column-heading">The House</h3>
            <div className="footer-links-list">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <Link href="/#house-philosophy" className="footer-link">
                    The House Philosophy
                  </Link>
                </li>
                <li>
                  <Link href="/#new-arrivals" className="footer-link">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/#signature-icons" className="footer-link">
                    Signature Icons
                  </Link>
                </li>
                <li>
                  <Link href="/#house-favorites" className="footer-link">
                    House Favorites
                  </Link>
                </li>
              </ul>

              {/* Non-linked editorial hallmarks */}
              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.1))',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.78rem',
                  color: 'rgba(255, 255, 255, 0.6)',
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
        {/* 5. BOTTOM COPYRIGHT BAR                                           */}
        {/* ================================================================= */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-copy">
            © 2026 {BRAND_NAME} Atelier. All rights reserved.
          </div>
          <div className="footer-bottom-meta">
            <span>Prices in Indian Rupees (INR ₹)</span>
            <span aria-hidden="true" className="footer-meta-dot">·</span>
            <span>Complimentary Insured Courier</span>
          </div>
          <div className="mobile-only footer-mobile-hallmark">
            Made with meticulous care for discerning patrons.
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

        .footer-inner-container {
          padding-left: 24px;
          padding-right: 24px;
        }

        /* Newsletter Section */
        .footer-newsletter-section {
          padding-top: 64px;
          padding-bottom: 56px;
          border-bottom: 1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.1));
        }

        .footer-newsletter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          align-items: center;
        }

        .footer-newsletter-copy {
          max-width: 560px;
        }

        .footer-newsletter-badge {
          font-size: 0.72rem;
          fontWeight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-icy-lake, #CAD4D6);
          display: block;
          margin-bottom: 8px;
        }

        .footer-newsletter-title {
          font-family: var(--font-display);
          font-size: clamp(1.75rem, 3vw, 2.3rem);
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--color-diamond);
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .footer-newsletter-desc {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.65;
        }

        .footer-newsletter-form-wrapper {
          width: 100%;
          max-width: 480px;
          justify-self: end;
        }

        .footer-newsletter-success {
          padding: 16px 20px;
          background-color: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-sm, 8px);
          border: 1px solid var(--color-golden-300, #E4C888);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-input-wrapper {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.07);
          border-radius: var(--radius-pill, 999px);
          padding: 5px 6px 5px 18px;
          border: 1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.12));
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .footer-input-wrapper:focus-within {
          border-color: var(--color-golden, var(--brand-accent)) !important;
          box-shadow: 0 0 0 1px var(--color-golden, var(--brand-accent));
        }

        .footer-newsletter-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-diamond);
          font-size: 0.88rem;
          min-width: 0;
        }

        .footer-newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        .footer-inscribe-btn {
          flex-shrink: 0;
          background-color: var(--color-diamond);
          color: var(--color-black-tie);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 22px;
          border-radius: var(--radius-pill, 999px);
          border: none;
          cursor: pointer;
          transition: background-color 200ms ease, color 200ms ease, transform 150ms ease;
        }

        .footer-inscribe-btn:hover:not(:disabled) {
          background-color: var(--color-golden, var(--brand-accent)) !important;
          color: var(--color-black-tie) !important;
          transform: translateY(-1px);
        }

        .footer-inscribe-btn:focus-visible {
          outline: 2px solid var(--color-golden);
          outline-offset: 2px;
        }

        .footer-privacy-note {
          font-size: 0.74rem;
          color: rgba(255, 255, 255, 0.55);
          padding-left: 14px;
        }

        /* Headings & Links */
        .footer-column-heading {
          font-size: 0.8rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-diamond);
          font-weight: 600;
          margin-bottom: 20px;
        }

        .footer-underlined-heading {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 1px;
          text-decoration-color: rgba(255, 255, 255, 0.3);
        }

        .footer-center-heading {
          text-align: center;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-link {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.72);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          transition: color 200ms ease, transform 150ms ease;
        }

        .footer-link:hover {
          color: var(--color-diamond);
          font-weight: 500;
          transform: translateX(3px);
        }

        .footer-link:focus-visible {
          outline: 2px solid var(--color-golden, var(--brand-accent));
          outline-offset: 4px;
          border-radius: 2px;
        }

        /* Social Icons - Circular White Buttons matching reference */
        .footer-social-icons-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-social-circle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #FFFFFF;
          color: #141414;
          text-decoration: none;
          transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
          flex-shrink: 0;
        }

        .footer-social-circle:hover {
          transform: translateY(-2px) scale(1.06);
          background-color: var(--color-golden-200, #EED7A1);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.25);
        }

        .footer-social-circle:focus-visible {
          outline: 2px solid var(--color-golden);
          outline-offset: 2px;
        }

        /* Desktop Grid */
        .footer-columns-grid {
          padding-top: 64px;
          padding-bottom: 56px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 48px;
        }

        /* Bottom Copyright Bar */
        .footer-bottom-bar {
          border-top: 1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.1));
          padding-top: 24px;
          padding-bottom: 32px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-bottom-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }

        .footer-meta-dot {
          color: rgba(255, 255, 255, 0.3);
        }

        /* Responsive visibility defaults */
        .mobile-only {
          display: none;
        }

        .desktop-only {
          display: grid;
        }

        /* =============================================================== */
        /* MOBILE OPTIMIZATIONS (<768px)                                   */
        /* =============================================================== */
        @media (max-width: 767px) {
          .mobile-only {
            display: block;
          }

          .desktop-only {
            display: none !important;
          }

          .footer-inner-container {
            padding-left: 20px;
            padding-right: 20px;
          }

          /* 1. Newsletter on Mobile */
          .footer-newsletter-section {
            padding-top: 44px;
            padding-bottom: 36px;
            text-align: center;
          }

          .footer-newsletter-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .footer-newsletter-copy {
            max-width: 100%;
            margin: 0 auto;
          }

          .footer-newsletter-badge {
            margin-bottom: 6px;
          }

          .footer-newsletter-title {
            font-size: 1.7rem;
            margin-bottom: 8px;
          }

          .footer-newsletter-desc {
            font-size: 0.84rem;
            max-width: 320px;
            margin: 0 auto;
            line-height: 1.55;
          }

          .footer-newsletter-form-wrapper {
            max-width: 100%;
            justify-self: center;
          }

          .footer-input-wrapper {
            padding: 4px 5px 4px 16px;
          }

          .footer-newsletter-input {
            font-size: 0.84rem;
          }

          .footer-inscribe-btn {
            padding: 9px 18px;
            font-size: 0.78rem;
          }

          .footer-privacy-note {
            padding-left: 0;
            text-align: center;
            font-size: 0.72rem;
          }

          /* 2. Centered Mobile Brand Header */
          .footer-mobile-brand-header {
            text-align: center;
            padding-top: 36px;
            padding-bottom: 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .footer-mobile-brand-link {
            text-decoration: none;
            color: inherit;
          }

          .footer-mobile-brand-title {
            font-family: var(--font-display);
            font-size: 1.85rem;
            letter-spacing: 0.22em;
            font-weight: 600;
            color: var(--color-diamond);
            text-transform: uppercase;
            display: block;
          }

          .footer-mobile-brand-tagline {
            display: block;
            font-size: 0.75rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: var(--color-icy-lake, #CAD4D6);
            font-weight: 500;
          }

          /* 3. Mobile 2-Column Links Grid */
          .footer-mobile-columns-wrapper {
            padding-bottom: 36px;
          }

          .footer-mobile-two-col-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 36px;
          }

          .footer-mobile-nav-column {
            display: flex;
            flex-direction: column;
          }

          .footer-column-heading {
            font-size: 0.78rem;
            letter-spacing: 0.14em;
            margin-bottom: 14px;
          }

          .footer-link {
            font-size: 0.82rem;
            min-height: 32px;
          }

          /* 4. Mobile Connect With Us & Social Icons */
          .footer-mobile-connect-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid var(--overlay-white-10, rgba(255, 255, 255, 0.08));
          }

          .footer-mobile-contact-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            margin-bottom: 20px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.75);
            line-height: 1.6;
          }

          .footer-contact-link {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: color 150ms ease;
          }

          .footer-contact-link:hover {
            color: var(--color-golden, var(--brand-accent));
          }

          .footer-contact-text {
            color: rgba(255, 255, 255, 0.6);
            max-width: 280px;
          }

          .footer-social-icons-row {
            justify-content: center;
            gap: 12px;
          }

          .footer-social-circle {
            width: 38px;
            height: 38px;
          }

          /* 5. Mobile Bottom Bar */
          .footer-bottom-bar {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
            padding-top: 24px;
            padding-bottom: 36px;
          }

          .footer-bottom-meta {
            justify-content: center;
            gap: 10px;
            font-size: 0.74rem;
          }

          .footer-mobile-hallmark {
            font-size: 0.72rem;
            color: rgba(255, 255, 255, 0.45);
            margin-top: 2px;
          }
        }
      `}</style>
    </footer>
  );
};
