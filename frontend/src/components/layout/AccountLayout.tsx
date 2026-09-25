'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowRight } from 'lucide-react';

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
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/signout');
  };

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
          
          <div className="sidebar-footer">
            <button className="signout-link" onClick={handleLogout}>
              Sign Out <ArrowRight size={14} />
            </button>
          </div>
        </aside>

        {/* Mobile Nav */}
        <nav className="account-mobile-nav">
          <div className="mobile-nav-scroll">
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

          <div className="mobile-signout">
             <button className="signout-link" onClick={handleLogout}>
              Sign Out <ArrowRight size={14} />
            </button>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .account-page {
          padding-top: 80px;
          padding-bottom: 80px;
          min-height: 100vh;
          background-color: #fff;
          color: #1D1A39;
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
          .account-sidebar {
            display: none;
          }
          
          .account-container {
            flex-direction: column;
            gap: 24px;
          }

          .account-mobile-nav {
            display: block;
            width: 100%;
            border-bottom: 1px solid rgba(29, 26, 57, 0.1);
            margin-bottom: 24px;
            overflow: hidden;
          }

          .mobile-nav-scroll {
            display: flex;
            overflow-x: auto;
            gap: 24px;
            padding-bottom: 12px;
            scrollbar-width: none; /* Firefox */
          }
          
          .mobile-nav-scroll::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
          }

          .mobile-nav-item {
            font-size: 0.9rem;
            color: #1D1A39;
            opacity: 0.6;
            white-space: nowrap;
            text-decoration: none;
            transition: opacity 0.2s ease;
          }

          .mobile-nav-item.active {
            opacity: 1;
            font-weight: 500;
            border-bottom: 1px solid #1D1A39;
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
          color: #1D1A39;
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
          color: #1D1A39;
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
          background-color: #1D1A39;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-item.active::after,
        .nav-item:hover::after {
          transform: scaleX(1);
        }
        
        .sidebar-footer {
          padding-top: 32px;
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }
        
        .signout-link {
          background: none;
          border: none;
          padding: 0;
          font-size: 0.95rem;
          color: #1D1A39;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }
        
        .signout-link:hover {
          opacity: 1;
        }
        
        .signout-link svg {
          transition: transform 0.2s ease;
        }
        
        .signout-link:hover svg {
          transform: translateX(4px);
        }

        .mobile-signout {
          display: none;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(29, 26, 57, 0.1);
        }

        @media (max-width: 768px) {
          .mobile-signout {
            display: block;
          }
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
          color: #1D1A39;
        }
        
        .page-subheading {
          font-size: 0.95rem;
          color: rgba(29, 26, 57, 0.6);
        }
        
        .section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 500;
          margin-bottom: 24px;
          color: #1D1A39;
        }
        
        .section-subtitle {
          font-size: 0.9rem;
          color: rgba(29, 26, 57, 0.6);
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
          color: #1D1A39;
        }

        .empty-state-text {
          font-size: 0.95rem;
          color: rgba(29, 26, 57, 0.6);
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};
