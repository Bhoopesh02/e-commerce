'use client';

import React from 'react';
import Link from 'next/link';
import styles from './AnnouncementBar.module.css';

interface AnnouncementBarProps {
  isScrolled?: boolean;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  isScrolled = false,
}) => {
  // Bar collapses gracefully when scrolling down
  const isOpen = !isScrolled;

  const renderGroup = (isAriaHidden = false) => (
    <div
      className={styles.marqueeGroup}
      aria-hidden={isAriaHidden ? 'true' : undefined}
    >
      <div className={styles.marqueeItem}>
        <span className={styles.starSeparator}>✦</span>
        <Link href="/shop" className={styles.promoLink}>
          <span>Complimentary Worldwide Express Shipping on Orders Over $300</span>
        </Link>
      </div>

      <div className={styles.marqueeItem}>
        <span className={styles.starSeparator}>✦</span>
        <Link href="/new-arrivals" className={styles.promoLink}>
          <span>Autumn / Winter 2026 Editorial Runway — Discover New Arrivals</span>
        </Link>
      </div>

      <div className={styles.marqueeItem}>
        <span className={styles.starSeparator}>✦</span>
        <Link href="/shop" className={styles.promoLink}>
          <span>Private Client Privilege: Enjoy 10% Off Your Inaugural Order</span>
        </Link>
      </div>

      <div className={styles.marqueeItem}>
        <span className={styles.starSeparator}>✦</span>
        <Link href="/collections" className={styles.promoLink}>
          <span>Bespoke Monogramming & Complimentary 30-Day Concierge Returns</span>
        </Link>
      </div>

      <div className={styles.marqueeItem}>
        <span className={styles.starSeparator}>✦</span>
        <Link href="/collections" className={styles.promoLink}>
          <span>Haute Couture Atelier Appointments Now Open</span>
        </Link>
      </div>
    </div>
  );

  return (
    <aside
      className={`${styles.announcementBar} ${isOpen ? styles.open : styles.collapsed}`}
      role="region"
      aria-label="Promotional Announcement Bar"
      aria-hidden={!isOpen}
    >
      <div className={styles.marqueeContainer}>
        <div className={styles.marqueeTrack}>
          {renderGroup(false)}
          {renderGroup(true)}
        </div>
      </div>
    </aside>
  );
};

