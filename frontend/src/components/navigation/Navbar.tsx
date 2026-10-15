'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useStorefrontStore } from '@/store/useStorefrontStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BRAND_NAME } from '@/lib/constants';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const pathname = usePathname();

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  const { getCartItemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { storefront } = useStorefrontStore();
  const { user } = useAuthStore();

  const cartCount = getCartItemCount();
  const wishlistCount = productIds.length;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu on click/tap outside or Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when expanding to desktop viewport
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let isScrolledLocal = typeof window !== 'undefined' ? window.scrollY > 48 : false;
    setIsScrolled(isScrolledLocal);

    const handleScroll = () => {
      const y = window.scrollY;
      // Hysteresis threshold check: only trigger React state update when crossing threshold
      if (!isScrolledLocal && y > 48) {
        isScrolledLocal = true;
        setIsScrolled(true);
      } else if (isScrolledLocal && y < 16) {
        isScrolledLocal = false;
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const newArrivalsHref = '/new-arrivals';
  const accountHref = !user ? '/signin' : user.role === 'admin' ? '/admin/dashboard' : '/account';

  const normalizedPath = pathname ? pathname.replace(/\/+$/, '') || '/' : '/';
  const isHeroBannerPage =
    normalizedPath === '/' ||
    normalizedPath === '/collections' ||
    normalizedPath === '/new-arrivals' ||
    normalizedPath.startsWith('/new-arrivals/');

  const isMegaMenuOpen = Boolean(hoveredNav && hoveredNav !== 'home');
  const isSolidNav = isScrolled || isMegaMenuOpen;
  const isLightNav = isHeroBannerPage && !isSolidNav;

  const navLinkStyle: React.CSSProperties = {
    fontSize: 'clamp(0.68rem, 0.45rem + 0.32vw, 0.82rem)',
    fontWeight: 500,
    letterSpacing: 'clamp(0.06em, 0.02em + 0.07vw, 0.12em)',
    textTransform: 'uppercase',
    height: '48px',
    minHeight: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    padding: '0 clamp(3px, 0.3vw, 6px)',
    color: isLightNav ? '#ffffff' : 'var(--text-primary)',
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
    color: isLightNav ? '#ffffff' : 'var(--text-primary)',
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
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'transform',
          transition:
            'background 250ms ease, background-color 250ms ease, color 250ms ease',
          background: isSolidNav
            ? 'rgba(255, 255, 255, 0.95)'
            : isHeroBannerPage
              ? 'linear-gradient(180deg, var(--overlay-black-50) 0%, var(--overlay-black-30) 60%, transparent 100%)'
              : 'transparent',
          backdropFilter: isSolidNav ? 'blur(6px)' : 'none',
          WebkitBackdropFilter: isSolidNav ? 'blur(6px)' : 'none',
          borderBottom: isSolidNav ? '1px solid var(--border-color)' : 'none',
          boxShadow: isSolidNav ? '0 2px 10px rgba(0, 0, 0, 0.03)' : 'none',
          color: isLightNav ? '#ffffff' : 'var(--text-primary)',
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
              ref={mobileToggleRef}
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
                color: isLightNav ? '#ffffff' : 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: 'var(--radius-pill)',
                filter: isLightNav ? 'drop-shadow(0 2px 6px var(--overlay-black-70))' : 'none',
                transition: 'filter 350ms var(--ease-luxury), color 350ms var(--ease-luxury)',
              }}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-flyout"
              className="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Left: Category-Neutral Luxury Nav Links (Desktop) */}
            <nav
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 'clamp(10px, 0.5rem + 1vw, 24px)',
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
                <Link
                  href="/collections"
                  onClick={() => setHoveredNav(null)}
                  className="nav-link-expand"
                  aria-expanded={hoveredNav === 'collections'}
                  aria-haspopup="true"
                  style={{
                    ...navLinkStyle,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  Collections
                </Link>
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
                  fontSize: 'clamp(1.15rem, 0.6rem + 1.15vw, 1.75rem)',
                  fontWeight: 600,
                  letterSpacing: 'clamp(0.12em, 0.04em + 0.1vw, 0.22em)',
                  lineHeight: 1,
                  color: isLightNav ? '#ffffff' : 'var(--text-primary)',
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
              gap: 'clamp(6px, 0.4rem + 0.5vw, 12px)',
              filter: isLightNav ? 'drop-shadow(0 1px 6px var(--overlay-black-70))' : 'none',
              transition: 'filter 350ms var(--ease-luxury)',
            }}
          >
            {/* Search Trigger: Directly navigates to /search on all devices */}
            <Link
              href="/search"
              aria-label="Search Collection"
              className="navbar-action-btn nav-icon search"
              style={actionBtnStyle}
            >
              <Search size={20} />
              <span className="nav-tooltip" aria-hidden="true">Search</span>
            </Link>

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
              <span className="nav-tooltip" aria-hidden="true">Wishlist</span>
            </Link>

            {/* Account / Admin Portal Link (Visible on desktop/tablet, in drawer on mobile) */}
            <Link
              href={accountHref}
              aria-label={user?.role === 'admin' ? 'Admin Control' : 'Account'}
              className="navbar-action-btn navbar-account-link nav-icon profile"
              style={actionBtnStyle}
            >
              <User size={20} />
              <span className="nav-tooltip" aria-hidden="true">
                {!user ? 'Sign In' : user.role === 'admin' ? 'Admin Portal' : 'Account'}
              </span>
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
              <span className="nav-tooltip" aria-hidden="true">Shopping Bag</span>
            </button>
          </div>
        </div>

        {/* Mobile Flyout Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-navigation-flyout"
              data-lenis-prevent
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
                  href="/collections"
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
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: pathname === '/collections' ? 600 : 400,
                    letterSpacing: '0.04em',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '16px',
                    color: pathname === '/collections' ? 'var(--brand-primary)' : 'var(--text-primary)',
                  }}
                >
                  All Collections
                </Link>
                <Link
                  href="/collections/men"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: pathname === '/collections/men' ? 600 : 400,
                    letterSpacing: '0.04em',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '16px',
                    color: pathname === '/collections/men' ? 'var(--brand-primary)' : 'var(--text-primary)',
                  }}
                >
                  Men
                </Link>
                <Link
                  href="/collections/women"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: pathname === '/collections/women' ? 600 : 400,
                    letterSpacing: '0.04em',
                    minHeight: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '16px',
                    color: pathname === '/collections/women' ? 'var(--brand-primary)' : 'var(--text-primary)',
                  }}
                >
                  Women
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
            data-lenis-prevent
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
            <div className="container" style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 0.6fr) 1.5fr 1fr 1.3fr', gap: 'clamp(16px, 1rem + 1vw, 32px)' }}>
              
              {/* Column 1: Shop by Department */}
              <div>
                <h4 style={{ fontSize: 'clamp(0.72rem, 0.6rem + 0.15vw, 0.8rem)', letterSpacing: 'clamp(0.06em, 0.03em + 0.05vw, 0.1em)', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Shop by Department
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link 
                    href="/collections" 
                    onClick={() => setHoveredNav(null)} 
                    style={{ 
                      fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', 
                      color: pathname === '/collections' ? 'var(--text-primary)' : 'var(--text-primary)',
                      fontWeight: pathname === '/collections' ? 600 : 400,
                      textDecoration: pathname === '/collections' ? 'underline' : 'none',
                    }}
                  >
                    All Collections
                  </Link>
                  <Link 
                    href="/collections/men" 
                    onClick={() => setHoveredNav(null)} 
                    style={{ 
                      fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', 
                      color: pathname === '/collections/men' ? 'var(--text-primary)' : 'var(--text-primary)',
                      fontWeight: pathname === '/collections/men' ? 600 : 400,
                      textDecoration: pathname === '/collections/men' ? 'underline' : 'none',
                    }}
                  >
                    Men
                  </Link>
                  <Link 
                    href="/collections/women" 
                    onClick={() => setHoveredNav(null)} 
                    style={{ 
                      fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', 
                      color: pathname === '/collections/women' ? 'var(--text-primary)' : 'var(--text-primary)',
                      fontWeight: pathname === '/collections/women' ? 600 : 400,
                      textDecoration: pathname === '/collections/women' ? 'underline' : 'none',
                    }}
                  >
                    Women
                  </Link>
                </div>
              </div>

              {/* Column 2: Categories */}
              <div>
                <h4 style={{ fontSize: 'clamp(0.72rem, 0.6rem + 0.15vw, 0.8rem)', letterSpacing: 'clamp(0.06em, 0.03em + 0.05vw, 0.1em)', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Shop by Category
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/shop?categorySlug=outerwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Outerwear</Link>
                    <Link href="/shop?categorySlug=tailoring" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Tailoring</Link>
                    <Link href="/shop?categorySlug=eveningwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Eveningwear</Link>
                    <Link href="/shop?categorySlug=knitwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Knitwear</Link>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Link href="/shop?categorySlug=leather-goods" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Leather Goods</Link>
                    <Link href="/shop?categorySlug=footwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Footwear</Link>
                    <Link href="/shop?categorySlug=fine-jewelry" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Fine Jewelry</Link>
                    <Link href="/shop?categorySlug=fragrances" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Fragrances</Link>
                  </div>
                </div>
              </div>

              {/* Column 3: Trends/Featured */}
              <div>
                <h4 style={{ fontSize: 'clamp(0.72rem, 0.6rem + 0.15vw, 0.8rem)', letterSpacing: 'clamp(0.06em, 0.03em + 0.05vw, 0.1em)', textTransform: 'uppercase', marginBottom: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Shop by Edit
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <Link href="/shop?categorySlug=outerwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Heritage Styles</Link>
                  <Link href="/shop?categorySlug=tailoring" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Sartorial Elegance</Link>
                  <Link href="/shop?categorySlug=leather-goods" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Monochrome</Link>
                  <Link href="/shop?categorySlug=knitwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>Cashmere Essentials</Link>
                  <Link href="/shop?categorySlug=eveningwear" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.82rem, 0.72rem + 0.18vw, 0.95rem)', color: 'var(--text-primary)' }}>The Evening Edit</Link>
                </div>
              </div>

              {/* Column 4: Featured Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/collections"
                  onClick={() => setHoveredNav(null)}
                  style={{ position: 'relative', width: '100%', paddingBottom: '80%', overflow: 'hidden', backgroundColor: 'var(--bg-subtle)', display: 'block' }}
                >
                  <Image 
                    src="/images/categories/cat-tailoring.webp" 
                    alt="The New-Season Collections" 
                    fill
                    sizes="280px"
                    quality={85}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </Link>
                <Link href="/collections" onClick={() => setHoveredNav(null)} style={{ fontSize: 'clamp(0.72rem, 0.62rem + 0.15vw, 0.8rem)', letterSpacing: 'clamp(0.06em, 0.03em + 0.05vw, 0.1em)', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                  The New-Season Collections
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Style block for responsive navigation layout & touch target sizing */}
      <style jsx global>{`
        .navbar-action-btn:hover {
          background-color: var(--bg-surface-hover, var(--overlay-white-5));
        }
        .navbar-action-btn svg {
          display: block !important;
          flex-shrink: 0 !important;
        }
        .nav-tooltip {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%) translateY(-3px);
          background: rgba(18, 18, 18, 0.94);
          color: #ffffff !important;
          font-size: 0.65rem !important;
          font-weight: 600 !important;
          letter-spacing: 0.08em !important;
          text-transform: uppercase !important;
          text-shadow: none !important;
          white-space: nowrap !important;
          padding: 4px 8px !important;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.12);
          pointer-events: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 160ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 160ms cubic-bezier(0.16, 1, 0.3, 1),
                      visibility 160ms cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 120;
          line-height: 1.2;
        }
        .nav-tooltip::before {
          content: '';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: transparent transparent rgba(18, 18, 18, 0.94) transparent;
        }
        @media (hover: hover) and (pointer: fine) {
          .navbar-action-btn:hover .nav-tooltip,
          .navbar-action-btn:focus-visible .nav-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
          }
        }
        @media (min-width: 768px) {
          .mobile-nav-toggle {
            display: none !important;
          }
          .desktop-nav-links {
            display: flex !important;
          }
          .desktop-nav-links .nav-link-expand {
            font-size: clamp(0.68rem, 0.45rem + 0.32vw, 0.82rem) !important;
            letter-spacing: clamp(0.06em, 0.02em + 0.07vw, 0.12em) !important;
            padding: 0 clamp(3px, 0.3vw, 6px) !important;
          }
          .navbar-brand-text {
            font-size: clamp(1.15rem, 0.6rem + 1.15vw, 1.75rem) !important;
            letter-spacing: clamp(0.12em, 0.04em + 0.1vw, 0.22em) !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1100px) {
          .desktop-nav-links {
            gap: clamp(10px, 1.2vw, 16px) !important;
          }
          .navbar-actions {
            gap: clamp(4px, 0.6vw, 8px) !important;
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
