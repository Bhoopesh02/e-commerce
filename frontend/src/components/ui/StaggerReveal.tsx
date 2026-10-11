'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from 'framer-motion';

/**
 * Editorial luxury cubic-bezier easing curve:
 * Starts fast and decelerates smoothly over an extended period.
 */
export const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface StaggerRevealOptions {
  delayChildren?: number;
  staggerChildren?: number;
  duration?: number;
  yOffset?: number;
  ease?: [number, number, number, number];
}

export interface StaggerVariantsBundle {
  containerVariants: Variants;
  fadeUpVariants: Variants;
  lineRevealVariants: Variants;
  scaleBackgroundVariants: Variants;
  shouldReduceMotion: boolean;
  ease: [number, number, number, number];
}

/**
 * Hook to generate staggered entrance animation variants for Framer Motion.
 * Supports OS-level reduced motion preferences automatically.
 */
export function useStaggerReveal(options: StaggerRevealOptions = {}): StaggerVariantsBundle {
  const {
    delayChildren = 0.3,
    staggerChildren = 0.14,
    duration = 1.0,
    yOffset = 24,
    ease = LUXURY_EASE,
  } = options;

  const shouldReduceMotion = Boolean(useReducedMotion());
  const effectiveDuration = shouldReduceMotion ? 0.2 : duration;

  return useMemo<StaggerVariantsBundle>(() => {
    const containerVariants: Variants = {
      hidden: {},
      show: {
        transition: {
          delayChildren: shouldReduceMotion ? 0 : delayChildren,
          staggerChildren: shouldReduceMotion ? 0 : staggerChildren,
        },
      },
    };

    const fadeUpVariants: Variants = {
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : yOffset,
      },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: effectiveDuration,
          ease,
        },
      },
    };

    const lineRevealVariants: Variants = {
      hidden: {
        y: shouldReduceMotion ? '0%' : '110%',
        opacity: shouldReduceMotion ? 0 : 1,
      },
      show: {
        y: '0%',
        opacity: 1,
        transition: {
          duration: effectiveDuration,
          ease,
        },
      },
    };

    const scaleBackgroundVariants: Variants = {
      hidden: {
        scale: shouldReduceMotion ? 1 : 1.08,
      },
      show: {
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0.2 : 2.4,
          ease,
        },
      },
    };

    return {
      containerVariants,
      fadeUpVariants,
      lineRevealVariants,
      scaleBackgroundVariants,
      shouldReduceMotion,
      ease,
    };
  }, [delayChildren, staggerChildren, effectiveDuration, yOffset, ease, shouldReduceMotion]);
}

const StaggerContext = createContext<StaggerVariantsBundle | null>(null);

export function useStaggerContext(): StaggerVariantsBundle {
  const ctx = useContext(StaggerContext);
  if (!ctx) {
    // Sensible fallback bundle if used outside StaggerContainer
    return {
      containerVariants: { hidden: {}, show: {} },
      fadeUpVariants: {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 1.0, ease: LUXURY_EASE } },
      },
      lineRevealVariants: {
        hidden: { y: '110%', opacity: 1 },
        show: { y: '0%', opacity: 1, transition: { duration: 1.0, ease: LUXURY_EASE } },
      },
      scaleBackgroundVariants: {
        hidden: { scale: 1.08 },
        show: { scale: 1, transition: { duration: 2.4, ease: LUXURY_EASE } },
      },
      shouldReduceMotion: false,
      ease: LUXURY_EASE,
    };
  }
  return ctx;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * Declarative Components
 * ────────────────────────────────────────────────────────────────────────── */

export interface StaggerContainerProps extends StaggerRevealOptions {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'header';
  customVariants?: Variants;
  initial?: string | boolean;
  animate?: string | boolean;
  triggerOnView?: boolean;
  viewport?: { once?: boolean; amount?: number | 'some' | 'all'; margin?: string };
}

/**
 * Parent container that coordinates the stagger timing of its child elements.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  delayChildren = 0.3,
  staggerChildren = 0.14,
  duration = 1.0,
  yOffset = 24,
  ease = LUXURY_EASE,
  className = '',
  style = {},
  as = 'div',
  customVariants,
  initial = 'hidden',
  animate = 'show',
  triggerOnView = false,
  viewport = { once: true, amount: 0.25 },
}) => {
  const bundle = useStaggerReveal({
    delayChildren,
    staggerChildren,
    duration,
    yOffset,
    ease,
  });

  const variants = customVariants || bundle.containerVariants;

  const motionComponents = {
    div: motion.div,
    section: motion.section,
    article: motion.article,
    header: motion.header,
  };

  const Component = motionComponents[as] || motion.div;

  const animationProps = triggerOnView
    ? {
        initial: (initial as any) || 'hidden',
        whileInView: 'show',
        viewport,
      }
    : {
        initial: initial as any,
        animate: animate as any,
      };

  return (
    <StaggerContext.Provider value={bundle}>
      <Component
        className={className}
        style={style}
        variants={variants}
        {...animationProps}
      >
        {children}
      </Component>
    </StaggerContext.Provider>
  );
};

export type StaggerFadeUpTag = 'div' | 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'section';

export interface StaggerFadeUpProps {
  children: React.ReactNode;
  as?: StaggerFadeUpTag;
  className?: string;
  style?: React.CSSProperties;
  customVariants?: Variants;
}

/**
 * Child element that rises slightly and fades in according to the parent stagger.
 */
export const StaggerFadeUp: React.FC<StaggerFadeUpProps> = ({
  children,
  as = 'div',
  className = '',
  style = {},
  customVariants,
}) => {
  const { fadeUpVariants } = useStaggerContext();

  const motionTagMap = {
    div: motion.div,
    span: motion.span,
    p: motion.p,
    h1: motion.h1,
    h2: motion.h2,
    h3: motion.h3,
    h4: motion.h4,
    section: motion.section,
  };

  const Component = motionTagMap[as] || motion.div;

  return (
    <Component
      className={className}
      style={style}
      variants={customVariants || fadeUpVariants}
    >
      {children}
    </Component>
  );
};

export interface LineRevealProps {
  children: React.ReactNode;
  bottomPadding?: string | number;
  className?: string;
  style?: React.CSSProperties;
  lineStyle?: React.CSSProperties;
  customVariants?: Variants;
}

/**
 * Headline line reveal using the overflow clipping mask trick.
 * The text emerges out of an invisible horizontal baseline.
 */
export const LineReveal: React.FC<LineRevealProps> = ({
  children,
  bottomPadding = '8px',
  className = '',
  style = {},
  lineStyle = {},
  customVariants,
}) => {
  const { lineRevealVariants } = useStaggerContext();

  return (
    <span
      className={className}
      style={{
        display: 'block',
        overflow: 'hidden',
        paddingBottom: bottomPadding,
        ...style,
      }}
    >
      <motion.span
        variants={customVariants || lineRevealVariants}
        style={{
          display: 'block',
          ...lineStyle,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export interface ScaleBackgroundProps {
  children: React.ReactNode;
  initialScale?: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
  ease?: [number, number, number, number];
  triggerOnView?: boolean;
  viewport?: { once?: boolean; amount?: number | 'some' | 'all'; margin?: string };
}

/**
 * Independent background scale animation that slowly settles to depth (e.g., 1.08 -> 1).
 */
export const ScaleBackground: React.FC<ScaleBackgroundProps> = ({
  children,
  initialScale = 1.08,
  duration = 2.4,
  className = '',
  style = {},
  ease = LUXURY_EASE,
  triggerOnView = false,
  viewport = { once: true, amount: 0.25 },
}) => {
  const shouldReduceMotion = Boolean(useReducedMotion());

  const animationProps = triggerOnView
    ? {
        initial: { scale: shouldReduceMotion ? 1 : initialScale },
        whileInView: { scale: 1 },
        viewport,
      }
    : {
        initial: { scale: shouldReduceMotion ? 1 : initialScale },
        animate: { scale: 1 },
      };

  return (
    <motion.div
      className={className}
      {...animationProps}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        ease,
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
