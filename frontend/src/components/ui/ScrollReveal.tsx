'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScrollReveal: High-performance entrance animation using Framer Motion.
 * Configured strictly with `viewport={{ once: true }}` to guarantee animations
 * play only once upon initial scroll-down and NEVER re-trigger or thrash on reverse scroll.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  yOffset = 24,
  className = '',
  style = {},
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Editorial luxury ease curve
      }}
      className={className}
      style={{
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
