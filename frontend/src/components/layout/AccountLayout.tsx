'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AccountLayoutProps {
  children: React.ReactNode;
}

const TABS = [
  { id: 'overview', label: 'Overview', href: '/account' },
  { id: 'orders', label: 'Orders', href: '/account/orders' },
  { id: 'addresses', label: 'Addresses', href: '/account/addresses' },
  { id: 'returns', label: 'Returns & Exchanges', href: '/account/returns' },
  { id: 'preferences', label: 'Email Preferences', href: '/account/preferences' },
  { id: 'profile', label: 'Profile Settings', href: '/account/profile' },
] as const;

export const AccountLayout: React.FC<AccountLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const updateScrollOverflow = React.useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, clientWidth, scrollWidth } = container;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      updateScrollOverflow();
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollOverflow);

    // Initial check
    updateScrollOverflow();

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollOverflow);
    };
  }, [updateScrollOverflow]);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeEl = container.querySelector('.mobile-nav-item.active') as HTMLElement | null;
    if (activeEl) {
      const targetScrollLeft = activeEl.offsetLeft - (container.clientWidth - activeEl.clientWidth) / 2;
      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }

    const timer = setTimeout(updateScrollOverflow, 350);
    return () => clearTimeout(timer);
  }, [pathname, updateScrollOverflow]);

  return (
    <div className="account-page">
      <div className="container account-container">
        {/* Left Sidebar (Desktop) */}
        <aside className="account-sidebar">
          <div className="sidebar-profile">
            <h1 className="profile-name">MY ACCOUNT</h1>
          </div>
          
          <nav className="account-nav">
            {TABS.map(tab => {
              // Exact match for overview, startsWith for others
              const isActive = tab.href === '/account' 
                ? pathname === '/account' 
                : pathname.startsWith(tab.href);
              
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <nav className={`account-mobile-nav ${canScrollLeft ? 'fade-left' : ''} ${canScrollRight ? 'fade-right' : ''}`}>
          <div className="mobile-nav-scroll" ref={scrollContainerRef}>
            {TABS.map(tab => {
              const isActive = tab.href === '/account' 
                ? pathname === '/account' 
                : pathname.startsWith(tab.href);
              
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right Content */}
        <main className="account-content">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .account-page {
          padding-top: 80px;
          padding-bottom: 80px;
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: var(--text-primary);
        }
        
        .account-container {
          max-width: 1024px;
          margin: 0 auto;
          display: flex;
          gap: 48px;
        }

        /* Sidebar Styles */
        .account-sidebar {
          width: 240px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }

        .account-mobile-nav {
          display: none;
        }
        
        @media (max-width: 768px) {
          .account-page {
            padding-top: calc(var(--navbar-height, 64px) + clamp(12px, 3vw, 24px));
            padding-bottom: 48px;
          }

          .account-sidebar {
            display: none;
          }
          
          .account-container {
            flex-direction: column;
            gap: 20px;
          }

          .account-mobile-nav {
            display: block;
            width: 100%;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 24px;
            overflow: hidden;
            position: relative;
            -webkit-mask-image: none;
            mask-image: none;
            transition: -webkit-mask-image 0.2s ease, mask-image 0.2s ease;
          }

          .account-mobile-nav.fade-right {
            -webkit-mask-image: linear-gradient(to right, #000 0%, #000 calc(100% - 32px), transparent 100%);
            mask-image: linear-gradient(to right, #000 0%, #000 calc(100% - 32px), transparent 100%);
          }

          .account-mobile-nav.fade-left {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 100%);
            mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 100%);
          }

          .account-mobile-nav.fade-left.fade-right {
            -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 calc(100% - 32px), transparent 100%);
            mask-image: linear-gradient(to right, transparent 0%, #000 32px, #000 calc(100% - 32px), transparent 100%);
          }

          .mobile-nav-scroll {
            display: flex;
            overflow-x: auto;
            gap: 20px;
            padding: 0 16px 10px 4px;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
            -webkit-overflow-scrolling: touch;
          }
          
          .mobile-nav-scroll::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }

          .mobile-nav-item {
            font-size: 0.9rem;
            color: var(--text-primary);
            opacity: 0.6;
            white-space: nowrap;
            text-decoration: none;
            transition: opacity 0.2s ease;
            display: inline-flex;
            align-items: center;
            min-height: 2.75rem; /* 44px touch target */
            padding: 0 4px;
          }

          .mobile-nav-item.active {
            opacity: 1;
            font-weight: 500;
            border-bottom: 2px solid var(--color-black-tie);
          }
        }
        
        .sidebar-profile {
          margin-bottom: 48px;
        }
        
        .profile-name {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 400;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          color: var(--text-primary);
          text-transform: uppercase;
        }
        
        .account-nav {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        
        .nav-item {
          text-align: left;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          color: var(--text-primary);
          opacity: 0.6;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          display: inline-block;
          width: fit-content;
          text-decoration: none;
        }
        
        .nav-item:hover {
          opacity: 1;
        }
        
        .nav-item.active {
          opacity: 1;
          font-weight: 500;
        }
        
        .nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--text-primary);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-item.active::after,
        .nav-item:hover::after {
          transform: scaleX(1);
        }

        /* Content Styles */
        .account-content {
          flex: 1;
          min-width: 0;
        }
        
        .content-header {
          margin-bottom: 32px;
        }

        .page-heading {
          font-family: var(--font-display);
          font-size: 2.2rem;
          font-weight: 400;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        
        .page-subheading {
          font-size: 0.95rem;
          color: var(--overlay-scrim);
        }
        
        .section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          margin-bottom: 24px;
          color: var(--text-primary);
        }
        
        .section-subtitle {
          font-size: 0.9rem;
          color: var(--overlay-scrim);
          margin-bottom: 32px;
        }
        
        .empty-state {
          padding: 48px 0;
          text-align: left;
        }

        .empty-state-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .empty-state-text {
          font-size: 0.95rem;
          color: var(--overlay-scrim);
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};
