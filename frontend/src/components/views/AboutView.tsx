'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import styles from './AboutView.module.css';

const easeEditorial = [0.16, 1, 0.3, 1] as const;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeEditorial },
  },
};

export const AboutView: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={styles.pageRoot}>
      <div className={styles.container}>
        {/* =========================================================================
            SECTION 1: THE HOUSE OF AURELIA / HERITAGE & PHILOSOPHY
            ========================================================================= */}
        <header className={styles.heroHeader}>
          <motion.h1
            className={styles.mainTitle}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeEditorial }}
          >
            The House of Aurelia
          </motion.h1>
        </header>

        <section className={styles.heritageGrid} aria-label="Our House Philosophy and Heritage">
          {/* Left Column: Sizing Portrait & Tactile Tailoring Caption */}
          <motion.div
            className={styles.heritageLeft}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div className={styles.portraitWrapper}>
              <Image
                src="/images/about/journey-tailoring.webp"
                alt="Aurelia sartorial tailoring in charcoal virgin wool with bespoke shears and measuring tape in the atelier"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 520px"
                className={styles.portraitImage}
                quality={90}
              />
            </div>
            <p className={styles.leftCaption}>
              Garments engineered around human posture, tactile sensation, and the quiet dignity of unhurried craftsmanship.
            </p>
          </motion.div>

          {/* Right Column: Narrative Copy + House Philosophy + Runway Banner */}
          <motion.div
            className={styles.heritageRight}
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
          >
            <div className={styles.heritageRightTop}>
              <p className={styles.philosophyStory}>
                Aurelia was born from an unwavering conviction: that true luxury is not an ostentatious performance, but an intimate daily practice. Founded as an independent atelier spanning Bengaluru and Milan, we craft ready-to-wear and bespoke garments sculpted from architectural virgin wools, liquid mulberry silks, and Grade-A Mongolian cashmere.
              </p>
              <h2 className={styles.subHeadline}>
                Quiet Grandeur &amp; Sculptural Precision
              </h2>
              <span className={styles.atelierBadge}>
                Haute Couture &amp; Ready-to-Wear Atelier
              </span>
            </div>

            <div className={styles.runwayWrapper}>
              <Image
                src="/images/about/journey-runway.webp"
                alt="Aurelia nocturne eveningwear in midnight navy liquid silk draped across an Italian palazzo salon"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 760px"
                className={styles.runwayImage}
                quality={90}
              />
            </div>
          </motion.div>
        </section>

        {/* =========================================================================
            SECTION 2: CRAFTSMANSHIP DISCIPLINES & THE DRESSING RITUAL
            ========================================================================= */}
        <section className={styles.craftsmanshipSection} aria-label="Craftsmanship Disciplines and The Dressing Ritual">
          <div className={styles.craftsmanshipNavRow}>
            <span>The Atelier Disciplines</span>
            <span>The Permanent Wardrobe</span>
          </div>

          <div className={styles.craftsmanshipCanvas}>
            {/* Triptych of 3 Macro Craftsmanship Vignettes (Top Left of Big Typography) */}
            <div className={styles.triptychRow}>
              <div className={styles.triptychItem}>
                <Image
                  src="/images/about/vignette-tailoring.webp"
                  alt="Macro craftsmanship of hand-sewn Milanese buttonhole and pick-stitched lapel"
                  fill
                  sizes="104px"
                  className={styles.triptychImg}
                  quality={88}
                />
              </div>
              <div className={styles.triptychItem}>
                <Image
                  src="/images/about/vignette-silk.webp"
                  alt="Fluid swirl of golden 30-momme liquid mulberry silk charmeuse"
                  fill
                  sizes="104px"
                  className={styles.triptychImg}
                  quality={88}
                />
              </div>
              <div className={styles.triptychItem}>
                <Image
                  src="/images/about/vignette-jewelry.webp"
                  alt="Hand-sculpted molten gold vermeil bracelet on burnished leather"
                  fill
                  sizes="104px"
                  className={styles.triptychImg}
                  quality={88}
                />
              </div>
            </div>

            {/* Monumental Headline Rooted in Our Brand's Core Concept */}
            <h2 className={styles.monumentalHeadline}>
              The Dressing Ritual
            </h2>

            {/* Floating Iconic Tailored Silhouette */}
            <div className={styles.silhouetteWrapper}>
              <Image
                src="/images/about/about-hero-silhouette.webp"
                alt="Bespoke sculpted hourglass tailoring jacket on artisanal mannequin"
                fill
                priority
                sizes="(max-width: 768px) 240px, (max-width: 1200px) 360px, 440px"
                className={styles.silhouetteImg}
                quality={92}
              />
            </div>
          </div>

          {/* Bottom Narrative & Collections Link on the Right */}
          <div className={styles.craftsmanshipFooter}>
            <div />
            <div className={styles.craftsmanshipNarrative}>
              <span className={styles.atelierBadge}>Designed for Longevity</span>
              <p className={styles.missionCopy}>
                Every silhouette in the Aurelia collection is developed through iterative toile sculpting and pattern-drafting. From bias-cut evening silks that flow effortlessly with every stride to structured overcoats with featherweight chest canvasing, our garments are made to be lived in, season after season.
              </p>
              <Link
                href="/collections"
                className={styles.exploreButton}
                aria-label="Explore our full collection"
              >
                <span>Explore The Collections &gt;</span>
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: MONUMENTAL ATELIER DOSSIER & HOUSE SIGNATURE
            ========================================================================= */}
        <section className={styles.atelierDossierSection} aria-label="Atelier Dossier">
          <div className={styles.dossierMetaGrid}>
            <div>Flagship Salon: Penthouse 9, UB City, Bengaluru</div>
            <div className={styles.dossierMetaMiddle}>Private Concierge: concierge@aurelia-atelier.com</div>
            <div className={styles.dossierMetaRight}>Ateliers: Milan · Florence · Bengaluru</div>
          </div>

          <div className={styles.monumentalSignatureWrapper}>
            <span className={styles.monumentalSignature}>
              Aurelia
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
