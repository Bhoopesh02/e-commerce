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
            'background-color var(--duration-normal) var(--ease-editorial), border-color var(--duration-normal) var(--ease-editorial), box-shadow var(--duration-normal) var(--ease-editorial)',
          backgroundColor: isScrolled ? 'var(--nav-backdrop)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-light)' : '1px solid transparent',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
          color: 'var(--text-primary)',
          willChange: 'background-color, border-color, box-shadow',
          transform: 'translateZ(0)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}
        >
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}
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
              style={{
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                position: 'relative',
              }}
            >
              Home
            </Link>
            <Link
              href={shopHref}
              style={{
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                position: 'relative',
              }}
            >
              Collections
            </Link>
            <Link
              href={newArrivalsHref}
              style={{
                fontSize: '0.82rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              New Arrivals
            </Link>
          </nav>

          {/* Center: Brand Identity Logo */}
          <div style={{ textAlign: 'center' }}>
            <Link href="/" style={{ display: 'inline-block' }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  color: 'var(--text-primary)',
                  display: 'inline-block',
                  transform: isScrolled ? 'scale(0.92)' : 'scale(1)',
                  transition: 'transform var(--duration-normal) var(--ease-editorial)',
                  willChange: 'transform',
                  textTransform: 'uppercase',
                }}
              >
                {BRAND_NAME}
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Wishlist, Account, Bag, Storefront Experience Switcher) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>




            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search Collection"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              <Search size={19} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: 'inherit',
              }}
            >
              <Heart size={19} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
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

            {/* Account / Admin Portal Link */}
            <Link
              href={accountHref}
              aria-label={user?.role === 'admin' ? 'Admin Control' : 'Account'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
              }}
            >
              <User size={19} />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openDrawer}
              aria-label="Shopping Bag"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                color: 'inherit',
              }}
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
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
              gap: '16px',
            }}
          >
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              Home
            </Link>
            <Link
              href={shopHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              Collections
            </Link>
            <Link
              href={newArrivalsHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              New Arrivals
            </Link>
            <Link
              href="/offers"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              Private Client Offers
            </Link>
            <Link
              href={accountHref}
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em' }}
            >
              {user?.role === 'admin' ? 'Admin Portal' : 'My Account'}
            </Link>
          </div>
        )}
      </header>

      {/* Style block for responsive desktop navigation layout */}
      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-nav-toggle {
            display: none !important;
          }
          .desktop-nav-links {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
