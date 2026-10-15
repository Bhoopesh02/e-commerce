'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useReducedMotion, Variants } from 'framer-motion';
import styles from './BrandStory.module.css';

const easeEditorial = [0.16, 1, 0.3, 1] as const;

export interface BrandStoryProps {
  eyebrow?: string;
  headline?: string;
  paragraph1?: string;
  paragraph2?: string;
  readMoreText?: string;
  readMoreHref?: string;
  portraitImage?: string;
  stillLifeImage?: string;
  landscapeImage?: string;
}

export const BrandStory: React.FC<BrandStoryProps> = ({
  eyebrow = 'THE DRESSING RITUAL',
  headline = 'We believe clothing is a daily practice, not a performance.',
  paragraph1 = 'Every morning begins with a small ritual. A texture chosen by feeling. A layer added for comfort. A silhouette that changes with the weather, the body, and the mood of the day.',
  paragraph2 = 'Aurelia was created from this belief. That getting dressed can be intimate, instinctive, and deeply personal. Our garments are designed to support that rhythm, giving you the freedom to build a wardrobe that feels like your own language.',
  readMoreText = 'Read more',
  readMoreHref = '/about',
  portraitImage = '/images/brand-story/ritual-balance.webp',
  stillLifeImage = '/images/brand-story/botanical-still-life.webp',
  landscapeImage = '/images/brand-story/ritual-drape.webp',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15 });
  const shouldReduceMotion = useReducedMotion();

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: easeEditorial },
    },
  };

  return (
    <section
      ref={containerRef}
      className={styles.section}
      id="brand-story"
      aria-labelledby="brand-story-headline"
    >
      <div className={styles.container}>
        <motion.div
          className={styles.grid}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ staggerChildren: 0.14 }}
        >
          {/* Left Column: Portrait photo + Story paragraphs + Read More Link */}
          <div className={styles.leftCol}>
            <motion.div
              className={styles.portraitWrapper}
              variants={fadeVariants}
            >
              <Image
                src={portraitImage}
                alt="The Dressing Ritual - Editorial Portrait"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 400px"
                className={styles.portraitImage}
                quality={90}
              />
            </motion.div>

            <motion.div
              className={styles.storyCopyBlock}
              variants={fadeVariants}
            >
              <p className={styles.storyParagraph}>{paragraph1}</p>
              <p className={styles.storyParagraph}>{paragraph2}</p>

              <Link
                href={readMoreHref}
                className={styles.readMoreLink}
                aria-label={`${readMoreText} about our philosophy and atelier`}
              >
                <span>{readMoreText}</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Eyebrow + Manifesto Headline + Still Life (Top) & Wide Landscape (Bottom) */}
          <div className={styles.rightCol}>
            <div className={styles.headerArea}>
              <motion.div
                className={styles.headlineGroup}
                variants={fadeVariants}
              >
                <p className={styles.eyebrow}>
                  {eyebrow} <span className={styles.eyebrowSquare} aria-hidden="true" />
                </p>
                <h2
                  id="brand-story-headline"
                  className={styles.manifestoHeadline}
                >
                  {headline}
                </h2>
              </motion.div>

              <motion.div
                className={styles.stillLifeWrapper}
                variants={fadeVariants}
              >
                <Image
                  src={stillLifeImage}
                  alt="Minimalist botanical still life"
                  fill
                  sizes="(max-width: 768px) 140px, 165px"
                  className={styles.stillLifeImage}
                  quality={88}
                />
              </motion.div>
            </div>

            <motion.div
              className={styles.landscapeWrapper}
              variants={fadeVariants}
            >
              {/* Corner contact-sheet indicators */}
              <span className={styles.cornerMarkerTopLeft} aria-hidden="true" />
              <span className={styles.cornerMarkerTopRight} aria-hidden="true" />

              <Image
                src={landscapeImage}
                alt="Aurelia draped knitwear editorial movement"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 65vw, 850px"
                className={styles.landscapeImage}
                quality={90}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
