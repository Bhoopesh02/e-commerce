'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BRAND_NAME } from '@/lib/constants';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const { getCartItemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { storefront } = useStorefrontStore();
  const { user } = useAuthStore();

  const cartCount = getCartItemCount();
  const wishlistCount = productIds.length;

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Hysteresis: activate above 48px, deactivate only below 16px to prevent threshold flapping
        setIsScrolled((prev) => {
          if (!prev && y > 48) return true;
          if (prev && y < 16) return false;
          return prev;
        });
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const shopHref = '/shop';
  const newArrivalsHref = '/shop?tag=new-arrival';
  const accountHref = user?.role === 'admin' ? '/admin/dashboard' : '/account';

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          transition:
            'background-color 350ms var(--ease-luxury), border-color 350ms var(--ease-luxury), box-shadow 350ms var(--ease-luxury), backdrop-filter 350ms var(--ease-luxury), -webkit-backdrop-filter 350ms var(--ease-luxury)',
          backgroundColor: isScrolled ? 'var(--nav-backdrop)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
          color: 'var(--text-primary)',
          willChange: 'background-color, border-color, box-shadow, backdrop-filter',
          transform: 'translateZ(0)',
        }}
      >
        <div
          className="container navbar-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            height: '76px',
          }}
        >
          {/* Left: Nav items (Hamburger on mobile, Nav Links on desktop) */}
          <div
            style={{
              justifySelf: 'start',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Mobile Menu Button (48x48px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                padding: 0,
                color: 'inherit',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-pill)',
              }}
              aria-label="Toggle Navigation Menu"
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Left: Category-Neutral Luxury Nav Links (Desktop) */}
            <nav
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '32px',
              }}
              className="desktop-nav-links"
            >
              <Link
                href="/"
                className="nav-link-expand"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Home
              </Link>
              <Link
                href={shopHref}
                className="nav-link-expand"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                Collections
              </Link>
              <Link
                href={newArrivalsHref}
                className="nav-link-expand"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Center: Brand Identity Logo (>= 48px touch target & responsive scaling) */}
          <div style={{ justifySelf: 'center', textAlign: 'center', minWidth: 0 }}>
            <Link
              href="/"
              className="navbar-brand-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '48px',
                minWidth: '48px',
                padding: '0 8px',
                textDecoration: 'none',
              }}
            >
              <span
                className="navbar-brand-text"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  color: 'var(--text-primary)',
                  display: 'inline-block',
                  transform: isScrolled ? 'scale(0.92)' : 'scale(1)',
                  transition: 'transform 350ms var(--ease-luxury)',
                  willChange: 'transform',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {BRAND_NAME}
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Wishlist, Account, Bag) - all >= 48px touch targets */}
          <div
            className="navbar-actions"
            style={{
              justifySelf: 'end',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search Collection"
              className="navbar-action-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                padding: 0,
                color: 'inherit',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-pill)',
                touchAction: 'manipulation',
              }}
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="navbar-action-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                padding: 0,
                color: 'inherit',
                borderRadius: 'var(--radius-pill)',
                touchAction: 'manipulation',
              }}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'var(--color-sunset-600)',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Admin Portal Link (Visible on desktop/tablet, in drawer on mobile) */}
            <Link
              href={accountHref}
              aria-label={user?.role === 'admin' ? 'Admin Control' : 'Account'}
              className="navbar-action-btn navbar-account-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                padding: 0,
                color: 'inherit',
                borderRadius: 'var(--radius-pill)',
                touchAction: 'manipulation',
              }}
            >
              <User size={20} />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openDrawer}
              aria-label="Shopping Bag"
              className="navbar-action-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                width: '48px',
                height: '48px',
                minWidth: '48px',
                minHeight: '48px',
                padding: 0,
                color: 'inherit',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-pill)',
                touchAction: 'manipulation',
              }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'var(--cta-primary)',
                    color: 'var(--cta-text)',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '16px',
                    height: '16px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Home
            </Link>
            <Link
              href={shopHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Collections
            </Link>
            <Link
              href={newArrivalsHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              New Arrivals
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Private Client Offers
            </Link>
            <Link
              href="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
            </Link>
            <Link
              href={accountHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {user?.role === 'admin' ? 'Admin Portal' : 'My Account'}
            </Link>
          </div>
        )}
      </header>

      {/* Style block for responsive navigation layout & touch target sizing */}
      <style jsx global>{`
        .navbar-action-btn:hover {
          background-color: var(--bg-surface-hover, rgba(255, 255, 255, 0.06));
        }
        @media (min-width: 768px) {
          .mobile-nav-toggle {
            display: none !important;
          }
          .desktop-nav-links {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .navbar-container {
            grid-template-columns: 48px 1fr auto !important;
            gap: 4px !important;
            height: 64px !important;
          }
          .navbar-brand-text {
            font-size: clamp(1.15rem, 4.5vw, 1.55rem) !important;
            letter-spacing: clamp(0.1em, 1.5vw, 0.18em) !important;
          }
          .navbar-actions {
            gap: 2px !important;
          }
          .navbar-account-link {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
