import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const IN_SCOPE_CATEGORY_SLUGS = [
  'outerwear',
  'tailoring',
  'eveningwear',
  'knitwear',
  'leather-goods',
  'footwear',
  'fine-jewelry',
  'fragrances',
] as const;

/**
 * Checks if the current route is strictly in scope for the top banner entrance animation:
 * - /shop?categorySlug=outerwear
 * - /shop?categorySlug=tailoring
 * - /shop?categorySlug=eveningwear
 * - /shop?categorySlug=knitwear
 * - /shop?categorySlug=leather-goods
 * - /shop?categorySlug=footwear
 * - /shop?categorySlug=fine-jewelry
 * - /shop?categorySlug=fragrances
 * - /collections/men
 * - /collections/women
 * All other routes (including /shop with no categorySlug) return false.
 */
export function isBannerAnimationInScope(
  pathname: string,
  categorySlugParam?: string | null
): boolean {
  const cleanPath = pathname.replace(/\/$/, '') || '/';

  // 1. /collections/men or /collections/women
  if (cleanPath === '/collections/men' || cleanPath === '/collections/women') {
    return true;
  }

  // 2. /shop with an explicit in-scope categorySlug
  if (cleanPath === '/shop') {
    if (!categorySlugParam) return false;
    return (IN_SCOPE_CATEGORY_SLUGS as readonly string[]).includes(categorySlugParam);
  }

  return false;
}

/**
 * Waits for the page transition overlay reveal to finish if active.
 */
function waitForTransitionOverlay(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      return resolve();
    }

    const overlay = document.getElementById('aurelia-page-transition-overlay');
    // If overlay doesn't exist or is not actively covering, proceed immediately
    if (!overlay || !overlay.classList.contains('is-active')) {
      return resolve();
    }

    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('aurelia:page-transition-complete', finish);
      resolve();
    };

    window.addEventListener('aurelia:page-transition-complete', finish);

    // Backup safety check: observer or timeout if event missed
    const timeout = setTimeout(() => {
      finish();
    }, 2200);

    const checkInterval = setInterval(() => {
      if (!overlay.classList.contains('is-active')) {
        clearInterval(checkInterval);
        clearTimeout(timeout);
        finish();
      }
    }, 50);
  });
}

/**
 * Waits for the banner image to decode before starting the animation.
 */
async function waitForImageDecode(imageWrapper: HTMLElement | null): Promise<void> {
  if (!imageWrapper) return;
  const img = imageWrapper.querySelector('img');
  if (!img) return;

  try {
    if (img.complete && img.naturalWidth > 0) {
      await img.decode();
    } else {
      await new Promise<void>((resolve) => {
        let isDone = false;
        const done = () => {
          if (isDone) return;
          isDone = true;
          img.removeEventListener('load', done);
          img.removeEventListener('error', done);
          img.decode().catch(() => {}).finally(() => resolve());
        };

        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        // Safety timeout so slow networks never block indefinitely
        setTimeout(done, 1500);
      });
    }
  } catch {
    // Decoding failed or unsupported — proceed without blocking
  }
}

interface SplitTitleResult {
  maskContainers: HTMLElement[];
  innerSpans: HTMLElement[];
}

/**
 * Splits a title element into actual rendered lines using offsetTop grouping.
 * Each line is wrapped in an overflow:hidden mask (padding-bottom: .12em; margin-bottom: -.12em)
 * with an inner span for translation.
 */
function splitTitleIntoRenderedLines(
  titleEl: HTMLElement,
  rawTitleText: string
): SplitTitleResult {
  const words = rawTitleText.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return { maskContainers: [], innerSpans: [] };
  }

  // Preserve full accessibility label on the heading
  titleEl.setAttribute('aria-label', rawTitleText);

  // Render probes to measure rendered lines based on real layout
  titleEl.innerHTML = words
    .map(
      (word) =>
        `<span class="banner-title-word-probe" style="display:inline-block;white-space:nowrap;">${word}&nbsp;</span>`
    )
    .join('');

  const probes = titleEl.querySelectorAll<HTMLSpanElement>('.banner-title-word-probe');
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let currentTop = -999999;

  probes.forEach((probe, i) => {
    const top = probe.offsetTop;
    if (i === 0 || Math.abs(top - currentTop) < 6) {
      currentLine.push(words[i]);
      currentTop = top;
    } else {
      lines.push(currentLine);
      currentLine = [words[i]];
      currentTop = top;
    }
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Replace with mask structure
  titleEl.innerHTML = lines
    .map((lineWords) => {
      const lineText = lineWords.join(' ');
      return `<div class="banner-title-line-mask" style="overflow:hidden;padding-bottom:0.12em;margin-bottom:-0.12em;" aria-hidden="true"><span class="banner-title-line-inner" style="display:block;">${lineText}</span></div>`;
    })
    .join('');

  const maskContainers = Array.from(
    titleEl.querySelectorAll<HTMLElement>('.banner-title-line-mask')
  );
  const innerSpans = Array.from(
    titleEl.querySelectorAll<HTMLElement>('.banner-title-line-inner')
  );

  return { maskContainers, innerSpans };
}

export interface UseBannerAnimationOptions {
  containerRef: React.RefObject<HTMLElement | null>;
  imageWrapperRef: React.RefObject<HTMLElement | null>;
  tagRef: React.RefObject<HTMLElement | null>;
  titleRef: React.RefObject<HTMLElement | null>;
  footerRef?: React.RefObject<HTMLElement | null>;
  isInScope: boolean;
  identityKey: string;
  tagText: string;
  titleText: string;
  footerText?: string | null;
}

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook to manage GSAP timeline entrance animation for Aurelia top banners.
 */
export function useBannerAnimation(options: UseBannerAnimationOptions) {
  const {
    imageWrapperRef,
    tagRef,
    titleRef,
    footerRef,
    isInScope,
    identityKey,
    tagText,
    titleText,
    footerText,
  } = options;
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore final state helper
  const restoreFinalState = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isAnimatingRef.current = false;

    const imgWrapper = imageWrapperRef.current;
    if (imgWrapper) {
      gsap.set(imgWrapper, {
        clipPath: 'none',
        clearProps: 'clipPath,willChange',
      });
      const imgEl = imgWrapper.querySelector<HTMLImageElement>('img');
      if (imgEl) {
        gsap.set(imgEl, {
          xPercent: 0,
          scale: 1,
          clearProps: 'transform,willChange',
        });
      }
    }

    const tagEl = tagRef.current;
    if (tagEl && tagText) {
      tagEl.textContent = tagText;
      tagEl.style.minWidth = '';
      tagEl.removeAttribute('aria-hidden');
    }

    const titleEl = titleRef.current;
    if (titleEl && titleText) {
      titleEl.setAttribute('aria-label', titleText);
      const innerSpans = titleEl.querySelectorAll<HTMLElement>('.banner-title-line-inner');
      if (innerSpans.length > 0) {
        gsap.set(innerSpans, { yPercent: 0, clearProps: 'willChange' });
      } else {
        titleEl.textContent = titleText;
      }
    }
  };

  useIsomorphicLayoutEffect(() => {
    // If route is not in scope, do nothing and ensure clean state
    if (!isInScope) {
      restoreFinalState();
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      restoreFinalState();
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    let isCancelled = false;

    // Kill any active timeline on new identity/categorySlug change
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    isAnimatingRef.current = false;

    const imgWrapper = imageWrapperRef.current;
    const tagEl = tagRef.current;
    const titleEl = titleRef.current;

    if (!imgWrapper || !titleEl) {
      return;
    }

    const imgEl = imgWrapper.querySelector<HTMLImageElement>('img');

    // SET START STATES BEFORE FIRST PAINT
    // 1. Image wrapper & inner <img> start state:
    // Opens from the right edge toward its original position: inset(0 0 0 100%) -> inset(0 0 0 0%)
    gsap.set(imgWrapper, {
      clipPath: 'inset(0 0 0 100%)',
    });

    if (imgEl) {
      gsap.set(imgEl, {
        xPercent: isMobile ? 16 : 12,
        scale: 1.06,
        transformOrigin: 'center center',
      });
    }

    // 2. Tag typing preparation:
    const rawTag = tagText.trim();
    if (tagEl && rawTag) {
      if (!isMobile) {
        // First ensure it's rendered with full text to measure final width
        tagEl.textContent = rawTag;
        const measuredWidth = tagEl.getBoundingClientRect().width;
        if (measuredWidth > 0) {
          tagEl.style.minWidth = `${Math.ceil(measuredWidth)}px`;
        }
        tagEl.setAttribute('aria-label', rawTag);
        // Mask all characters except spaces with '_'
        tagEl.textContent = rawTag.replace(/[^\s]/g, '_');
      } else {
        tagEl.textContent = rawTag;
        tagEl.removeAttribute('aria-hidden');
      }
    }

    // 3. Title split into rendered lines
    let innerSpans: HTMLElement[] = [];
    if (titleEl && titleText) {
      if (!isMobile) {
        const splitRes = splitTitleIntoRenderedLines(titleEl, titleText);
        innerSpans = splitRes.innerSpans;
        gsap.set(innerSpans, { yPercent: 110 });
      } else {
        titleEl.textContent = titleText;
        titleEl.setAttribute('aria-label', titleText);
      }
    }

    // Run async trigger sequence: wait for page transition overlay, then wait for image decode
    (async () => {
      await waitForTransitionOverlay();
      if (isCancelled) return;

      await waitForImageDecode(imgWrapper);
      if (isCancelled) return;

      // Construct and start the single GSAP entrance timeline (~1.2s total)
      const tl = gsap.timeline({
        onStart: () => {
          isAnimatingRef.current = true;
          if (imgWrapper) imgWrapper.style.willChange = 'clip-path';
          if (imgEl) imgEl.style.willChange = 'transform';
          innerSpans.forEach((s) => (s.style.willChange = 'transform'));
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          if (imgWrapper) {
            imgWrapper.style.willChange = 'auto';
            gsap.set(imgWrapper, { clipPath: 'none', clearProps: 'clipPath' });
          }
          if (imgEl) {
            imgEl.style.willChange = 'auto';
            gsap.set(imgEl, { xPercent: 0, scale: 1, clearProps: 'transform,willChange' });
          }
          if (tagEl && rawTag) {
            tagEl.textContent = rawTag;
            gsap.set(tagEl, { clearProps: 'opacity,transform' });
          }
          if (titleEl) {
            gsap.set(titleEl, { clearProps: 'opacity,transform' });
          }
          if (footerRef?.current) {
            gsap.set(footerRef.current, { clearProps: 'opacity,transform' });
          }
          innerSpans.forEach((s) => {
            s.style.willChange = 'auto';
            gsap.set(s, { yPercent: 0 });
          });
        },
      });

      timelineRef.current = tl;

      // Step 1: IMAGE REVEAL (from RIGHT to LEFT across both desktop and mobile full-width)
      // Wrapper: overflow hidden. Animate clip-path so it opens from the right edge toward the left:
      // inset(0 0 0 100%) -> inset(0 0 0 0%), 0.9s, ease expo.out, at t=0
      tl.to(
        imgWrapper,
        {
          clipPath: 'inset(0 0 0 0%)',
          duration: 0.9,
          ease: 'expo.out',
        },
        0
      );

      // Inner <img> slides from right to left with parallax depth:
      // xPercent 16/12 -> 0, 0.9s, ease expo.out, at t=0
      // scale 1.06 -> 1 over 1.2s, ease power2.out (transform only)
      if (imgEl) {
        tl.to(
          imgEl,
          {
            xPercent: 0,
            duration: 0.9,
            ease: 'expo.out',
          },
          0
        );

        tl.to(
          imgEl,
          {
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
          },
          0
        );
      }

      // Step 2: TAG & TITLE
      if (isMobile) {
        // Mobile typography sequence: smooth right-to-left / fade-up entrance
        if (tagEl) {
          tl.fromTo(
            tagEl,
            { opacity: 0, x: 25 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
            0.1
          );
        }
        if (titleEl) {
          tl.fromTo(
            titleEl,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            0.15
          );
        }
        const footerEl = footerRef?.current;
        if (footerEl) {
          tl.fromTo(
            footerEl,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
            0.2
          );
        }
      } else {
        // Desktop tag typing (0.5s, linear)
        if (tagEl && rawTag) {
          const proxy = { progress: 0 };
          const rawChars = rawTag.split('');
          tl.to(
            proxy,
            {
              progress: 1,
              duration: 0.5,
              ease: 'none',
              onUpdate: () => {
                const count = Math.floor(proxy.progress * rawChars.length);
                const rendered = rawChars
                  .map((ch, idx) => {
                    if (idx < count) return ch;
                    if (ch === ' ' || ch === '\t') return ch;
                    return '_';
                  })
                  .join('');
                tagEl.textContent = rendered;
              },
              onComplete: () => {
                tagEl.textContent = rawTag;
              },
            },
            0
          );
        }

        // Desktop title line masks (yPercent 110 -> 0)
        if (innerSpans.length > 0) {
          tl.to(
            innerSpans,
            {
              yPercent: 0,
              duration: 0.55,
              ease: 'power3.out',
              stagger: 0.1,
            },
            0.05
          );
        }
      }

      // Step 4: Footer animation skipped for real banners without footer slot
    })();

    return () => {
      isCancelled = true;
      restoreFinalState();
    };
  }, [isInScope, identityKey, tagText, titleText, footerText]);

  // Window resize handler: re-split title lines debounced ~200ms when not animating
  useEffect(() => {
    if (!isInScope) return;

    const handleResize = () => {
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      resizeTimerRef.current = setTimeout(() => {
        // Only re-split if timeline is not actively playing
        if (isAnimatingRef.current) return;
        if (typeof window !== 'undefined' && window.innerWidth <= 768) {
          const titleEl = titleRef.current;
          if (titleEl && titleText) {
            titleEl.textContent = titleText;
            titleEl.setAttribute('aria-label', titleText);
          }
          return;
        }
        const titleEl = titleRef.current;
        if (titleEl && titleText) {
          const splitRes = splitTitleIntoRenderedLines(titleEl, titleText);
          if (splitRes.innerSpans.length > 0) {
            gsap.set(splitRes.innerSpans, { yPercent: 0 });
          }
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [isInScope, titleRef, titleText]);
}
