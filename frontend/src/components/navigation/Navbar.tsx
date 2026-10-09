'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
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

  const newArrivalsHref = '/new-arrivals';
  const accountHref = !user ? '/signin' : user.role === 'admin' ? '/admin/dashboard' : '/account';

  const isHomePage = pathname === '/';
  const isLightNav = isHomePage && !isScrolled;

  const navLinkStyle: React.CSSProperties = {
    fontSize: '0.82rem',
    fontWeight: 500,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    height: '48px',
    minHeight: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: '0 6px',
    color: isLightNav ? 'var(--bg-subtle)' : 'var(--text-primary)',
    textShadow: isLightNav ? '0 1px 8px var(--overlay-black-70)' : 'none',
    transition: 'color 350ms var(--ease-luxury), text-shadow 350ms var(--ease-luxury)',
    position: 'relative',
    textDecoration: 'none',
  };

  const actionBtnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    minHeight: '48px',
    padding: 0,
    color: isLightNav ? 'var(--bg-subtle)' : 'var(--text-primary)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: 'var(--radius-pill)',
    touchAction: 'manipulation',
    transition: 'color 350ms var(--ease-luxury), background-color 200ms ease',
    lineHeight: 1,
    textDecoration: 'none',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    backgroundColor: isLightNav ? 'var(--text-inverse)' : 'var(--brand-primary)',
    color: isLightNav ? 'var(--brand-primary)' : 'var(--text-inverse)',
    fontSize: '0.65rem',
    fontWeight: 700,
    lineHeight: 1,
    width: '16px',
    height: '16px',
    minWidth: '16px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    boxShadow: isLightNav ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.2)',
  };

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
            'background 350ms var(--ease-luxury), background-color 350ms var(--ease-luxury), backdrop-filter 350ms var(--ease-luxury), -webkit-backdrop-filter 350ms var(--ease-luxury), color 350ms var(--ease-luxury)',
          background: isScrolled
            ? 'var(--nav-backdrop)'
            : isHomePage
              ? 'linear-gradient(180deg, var(--overlay-black-50) 0%, var(--overlay-black-30) 60%, transparent 100%)'
              : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'blur(0px)',
          borderBottom: 'none',
          boxShadow: 'none',
          color: isLightNav ? 'var(--bg-subtle)' : 'var(--text-primary)',
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
              height: '48px',
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
                color: isLightNav ? 'var(--bg-subtle)' : 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-pill)',
                filter: isLightNav ? 'drop-shadow(0 2px 6px var(--overlay-black-70))' : 'none',
                transition: 'filter 350ms var(--ease-luxury), color 350ms var(--ease-luxury)',
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
                gap: '24px',
                height: '48px',
              }}
              className="desktop-nav-links"
              onMouseLeave={() => setHoveredNav(null)}
            >
              <Link
                href="/"
                className="nav-link-expand"
                onMouseEnter={() => setHoveredNav(null)}
                style={navLinkStyle}
              >
                Home
              </Link>
              <div 
                className="nav-link-wrapper"
                onMouseEnter={() => setHoveredNav('collections')}
                style={{ height: '48px', display: 'inline-flex', alignItems: 'center' }}
              >
                <button
                  type="button"
                  onClick={() => setHoveredNav(prev => prev === 'collections' ? null : 'collections')}
                  className="nav-link-expand"
                  aria-expanded={hoveredNav === 'collections'}
                  aria-haspopup="true"
                  style={{
                    ...navLinkStyle,
                    background: 'none',
                    border: 'none',
                    margin: 0,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Collections
                </button>
              </div>

              <Link
                href={newArrivalsHref}
                className="nav-link-expand"
                onMouseEnter={() => setHoveredNav(null)}
                style={navLinkStyle}
              >
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Center: Brand Identity Logo (>= 48px touch target & responsive scaling) */}
          <div
            style={{
              justifySelf: 'center',
              textAlign: 'center',
              minWidth: 0,
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Link
              href="/"
              className="navbar-brand-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '48px',
                minHeight: '48px',
                minWidth: '48px',
                padding: '0 8px',
                lineHeight: 1,
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
                  lineHeight: 1,
                  color: isLightNav ? 'var(--bg-subtle)' : 'var(--text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transform: isScrolled ? 'scale(0.92)' : 'scale(0.92)',
                  transition: 'transform 350ms var(--ease-luxury), color 350ms var(--ease-luxury), text-shadow 350ms var(--ease-luxury)',
                  willChange: 'transform, color',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  textShadow: isLightNav ? '0 2px 14px var(--overlay-black-70)' : 'none',
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
              height: '48px',
              gap: '12px',
              filter: isLightNav ? 'drop-shadow(0 1px 6px var(--overlay-black-70))' : 'none',
              transition: 'filter 350ms var(--ease-luxury)',
            }}
          >
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              aria-label="Search Collection"
              className="navbar-action-btn nav-icon search"
              style={actionBtnStyle}
            >
              <Search size={20} />
            </button>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="navbar-action-btn nav-icon heart"
              style={actionBtnStyle}
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="badge" style={badgeStyle}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account / Admin Portal Link (Visible on desktop/tablet, in drawer on mobile) */}
            <Link
              href={accountHref}
              aria-label={user?.role === 'admin' ? 'Admin Control' : 'Account'}
              className="navbar-action-btn navbar-account-link nav-icon profile"
              style={actionBtnStyle}
            >
              <User size={20} />
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openDrawer}
              aria-label="Shopping Bag"
              className="navbar-action-btn nav-icon bag"
              style={actionBtnStyle}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="badge" style={badgeStyle}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                overflow: 'hidden',
                position: 'absolute',
                top: '100%',
                left: 0,
                width: 'fit-content',
                minWidth: '240px',
                backgroundColor: 'var(--bg-surface)',
                borderBottom: '1px solid var(--border-color)',
                borderRight: '1px solid var(--border-color)',
                borderBottomRightRadius: '12px',
                boxShadow: '4px 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  color: 'var(--text-primary)',
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
                  href="/shop"
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
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Mega Menu Dropdown */}
      <AnimatePresence>
        {hoveredNav && hoveredNav !== 'home' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onMouseEnter={() => setHoveredNav(hoveredNav)}
            onMouseLeave={() => setHoveredNav(null)}
            style={{
              position: 'fixed',
              top: '76px', // height of the navbar
              left: 0,
              right: 0,
              backgroundColor: 'var(--bg-surface)',
              borderBottom: '1px solid var(--border-color)',
              zIndex: 99,
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              padding: '24px 0',
              pointerEvents: 'auto',
            }}
          >
            <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px' }}>
              
              {/* Column 1: Categories */}
              <div>
                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Shop by Category
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/shop?categorySlug=outerwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Outerwear</Link>
                    <Link href="/shop?categorySlug=tailoring" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Tailoring</Link>
                    <Link href="/shop?categorySlug=eveningwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Eveningwear</Link>
                    <Link href="/shop?categorySlug=knitwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Knitwear</Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/shop?categorySlug=leather-goods" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Leather Goods</Link>
                    <Link href="/shop?categorySlug=footwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Footwear</Link>
                    <Link href="/shop?categorySlug=fine-jewelry" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Fine Jewelry</Link>
                    <Link href="/shop?categorySlug=fragrances" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Fragrances</Link>
                  </div>
                </div>
              </div>

              {/* Column 2: Trends/Featured */}
              <div>
                <h4 style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Shop by Edit
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/shop?categorySlug=outerwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Heritage Styles</Link>
                  <Link href="/shop?categorySlug=tailoring" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Sartorial Elegance</Link>
                  <Link href="/shop?categorySlug=leather-goods" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Monochrome</Link>
                  <Link href="/shop?categorySlug=knitwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Cashmere Essentials</Link>
                  <Link href="/shop?categorySlug=eveningwear" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>The Evening Edit</Link>
                </div>
              </div>

              {/* Column 3: Featured Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '80%', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)' }}>
                  {/* Since we don't have exactly the image from the user's prompt, we use an existing image */}
                  <img 
                    src="/images/categories/cat-tailoring.jpg" 
                    alt="The New-Season Collections" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <Link href="/new-arrivals" onClick={() => setHoveredNav(null)} style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  The New-Season Collections
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style block for responsive navigation layout & touch target sizing */}
      <style jsx global>{`
        header {
          border-bottom: none !important;
          box-shadow: none !important;
        }
        .navbar-action-btn:hover {
          background-color: var(--bg-surface-hover, var(--overlay-white-5));
        }
        .navbar-action-btn svg {
          display: block !important;
          flex-shrink: 0 !important;
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
