'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { getDestinationTitle, isAllowedTransitionRoute } from '@/lib/route-titles';
import { smoothScrollService } from '@/services/smooth-scroll';
import './page-transition.css';

const SS_KEY = 'aurelia_transition_title';

/**
 * Injects staggered character markup into the container.
 * Words are kept together so they never break inappropriately on smaller viewports.
 */
function renderStaggeredTitle(container: HTMLElement, title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean);
  container.innerHTML = words
    .map((word) => {
      const chars = word
        .split('')
        .map(
          (char) =>
            `<span class="pt-char" style="display:inline-block;will-change:transform;">${char}</span>`
        )
        .join('');
      return `<span class="pt-word" style="display:inline-block;white-space:nowrap;">${chars}</span>`;
    })
    .join('');
}

export const PageTransitionOverlay: React.FC = () => {
  const router = useRouter();

  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isBusyRef = useRef<boolean>(false);

  /**
   * Resets scroll position to top across both native window and Lenis.
   */
  const resetScrollToTop = useCallback(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      smoothScrollService.scrollTo(0, { immediate: true });
    } catch {
      window.scrollTo(0, 0);
    }
  }, []);

  /**
   * Lock scroll and user interaction during transition.
   */
  const lockScroll = useCallback(() => {
    document.body.classList.add('page-transition-locked');
    try {
      smoothScrollService.getLenis()?.stop();
    } catch {
      // ignore
    }
  }, []);

  /**
   * Unlock scroll and user interaction after transition.
   */
  const unlockScroll = useCallback(() => {
    document.body.classList.remove('page-transition-locked');
    try {
      smoothScrollService.getLenis()?.start();
    } catch {
      // ignore
    }
  }, []);

  /**
   * Executes the full page transition sequence.
   */
  const executeTransition = useCallback(
    (targetHref: string, targetTitle: string, isPopstate = false) => {
      const overlay = overlayRef.current;
      const textEl = textRef.current;
      if (!overlay || !textEl) return;

      isBusyRef.current = true;

      // Render staggered character spans BEFORE building the timeline
      renderStaggeredTitle(textEl, targetTitle);
      const chars = textEl.querySelectorAll<HTMLSpanElement>('.pt-char');

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Ensure overlay is active
      overlay.classList.add('is-active');

      if (prefersReducedMotion) {
        // Reduced motion: 0.2s quick opacity crossfade, skip label translation
        overlay.style.willChange = 'opacity';
        overlay.style.clipPath = 'inset(0 0% 0 0)';

        gsap.fromTo(
          overlay,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
            onComplete: () => {
              lockScroll();
              if (!isPopstate) {
                try {
                  sessionStorage.setItem(SS_KEY, targetTitle);
                } catch {}
                router.push(targetHref);
              }

              setTimeout(() => {
                resetScrollToTop();
                try {
                  sessionStorage.removeItem(SS_KEY);
                } catch {}

                gsap.to(overlay, {
                  opacity: 0,
                  duration: 0.2,
                  ease: 'power2.in',
                  onComplete: () => {
                    overlay.classList.remove('is-active');
                    overlay.style.willChange = 'auto';
                    overlay.style.clipPath = 'inset(0 100% 0 0)';
                    unlockScroll();
                    isBusyRef.current = false;
                    try {
                      window.dispatchEvent(new CustomEvent('aurelia:page-transition-complete'));
                    } catch {}
                  },
                });
              }, 400);
            },
          }
        );
        return;
      }

      // Normal animation timeline
      overlay.style.willChange = 'clip-path';
      overlay.style.opacity = '1';

      // Reset initial overlay clip-path
      gsap.set(overlay, {
        clipPath: 'inset(0 100% 0 0)',
      });

      const tl = gsap.timeline();

      // 1. COVER: clip-path inset(0 100% 0 0) -> inset(0 0% 0 0), 0.45s, power3.inOut
      tl.to(
        overlay,
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.45,
          ease: 'power3.inOut',
        },
        0
      );

      // 2. STAGGERED LABEL IN: extended duration (0.55s) with silky smooth power4.out easing
      tl.fromTo(
        chars,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 0.55,
          ease: 'power4.out',
          stagger: 0.024,
        },
        0.04
      );

      // 3. SWAP: while fully covered, perform route change and hold
      tl.add(() => {
        lockScroll();

        if (!isPopstate) {
          try {
            sessionStorage.setItem(SS_KEY, targetTitle);
          } catch {}
          router.push(targetHref);
        }

        // Hold for 0.75s so title is admired comfortably
        setTimeout(() => {
          resetScrollToTop();
          try {
            sessionStorage.removeItem(SS_KEY);
          } catch {}

          // 4. LABEL OUT: smoother, fluid closing animation with power3.inOut
          const exitTl = gsap.timeline();

          exitTl.to(chars, {
            yPercent: -110,
            duration: 0.34,
            ease: 'power3.inOut',
            stagger: 0.016,
          });

          // 5. REVEAL: opens after the text has completely hidden (+ 0.2s pause)
          exitTl.to(
            overlay,
            {
              clipPath: 'inset(0 0 0 100%)',
              duration: 0.45,
              ease: 'power3.inOut',
              onComplete: () => {
                // Reset overlay and label clean for next transition
                overlay.classList.remove('is-active');
                overlay.style.willChange = 'auto';
                gsap.set(overlay, {
                  clipPath: 'inset(0 100% 0 0)',
                });
                gsap.set(chars, {
                  yPercent: 110,
                });

                unlockScroll();
                isBusyRef.current = false;
                try {
                  window.dispatchEvent(new CustomEvent('aurelia:page-transition-complete'));
                } catch {}
              },
            },
            '+=0.20'
          );
        }, 750);
      });
    },
    [router, lockScroll, unlockScroll, resetScrollToTop]
  );

  /**
   * Handle on-mount check for multi-page sites / hard reload:
   * Write title immediately into .pt-text and play the label-out step.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTitle = sessionStorage.getItem(SS_KEY);
      if (savedTitle) {
        sessionStorage.removeItem(SS_KEY);
        if (!isAllowedTransitionRoute(window.location.href)) return;

        const overlay = overlayRef.current;
        const textEl = textRef.current;
        if (!overlay || !textEl) return;

        // Render staggered character spans immediately before paint
        renderStaggeredTitle(textEl, savedTitle);
        const chars = textEl.querySelectorAll<HTMLSpanElement>('.pt-char');

        overlay.classList.add('is-active');
        overlay.style.willChange = 'clip-path';
        lockScroll();

        // Already covered state
        gsap.set(overlay, {
          clipPath: 'inset(0 0% 0 0)',
        });
        gsap.set(chars, {
          yPercent: 0,
        });

        setTimeout(() => {
          resetScrollToTop();

          const exitTl = gsap.timeline();
          exitTl.to(chars, {
            yPercent: -110,
            duration: 0.34,
            ease: 'power3.inOut',
            stagger: 0.016,
          });
          exitTl.to(
            overlay,
            {
              clipPath: 'inset(0 0 0 100%)',
              duration: 0.45,
              ease: 'power3.inOut',
              onComplete: () => {
                overlay.classList.remove('is-active');
                overlay.style.willChange = 'auto';
                gsap.set(overlay, {
                  clipPath: 'inset(0 100% 0 0)',
                });
                gsap.set(chars, {
                  yPercent: 110,
                });
                unlockScroll();
                try {
                  window.dispatchEvent(new CustomEvent('aurelia:page-transition-complete'));
                } catch {}
              },
            },
            '+=0.20'
          );
        }, 650);
      }
    } catch {
      // ignore
    }
  }, [lockScroll, unlockScroll, resetScrollToTop]);

  /**
   * Intercept clicks on internal links.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleAnchorClick = (e: MouseEvent) => {
      // Only handle left clicks without modifier keys
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      // Ignore links with target="_blank" etc.
      const targetAttr = anchor.getAttribute('target');
      if (targetAttr && targetAttr !== '_self') return;

      // Ignore download links
      if (anchor.hasAttribute('download')) return;

      const rawHref = anchor.getAttribute('href');
      if (!rawHref) return;

      // Ignore mailto, tel, javascript
      if (
        rawHref.startsWith('mailto:') ||
        rawHref.startsWith('tel:') ||
        rawHref.startsWith('javascript:')
      ) {
        return;
      }

      // Ignore hash-only links on current page
      if (rawHref.startsWith('#')) return;

      let targetUrl: URL;
      try {
        targetUrl = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      // Ignore external domains
      if (targetUrl.origin !== window.location.origin) return;

      const currentUrl = new URL(window.location.href);

      // Ignore links to the exact current URL (pathname + search)
      if (
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search
      ) {
        return;
      }

      // Only apply transition animation to the specified pages
      if (!isAllowedTransitionRoute(targetUrl.href)) {
        return;
      }

      // If transition is currently busy, ignore click
      if (isBusyRef.current) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Prevent default Next.js / browser instant navigation
      e.preventDefault();
      e.stopPropagation();

      const destinationTitle = getDestinationTitle(targetUrl.href, anchor);
      const targetPathWithSearch = targetUrl.pathname + targetUrl.search + targetUrl.hash;

      executeTransition(targetPathWithSearch, destinationTitle);
    };

    // Use capture phase to intercept before Next.js Link click handler triggers
    document.addEventListener('click', handleAnchorClick, true);

    return () => {
      document.removeEventListener('click', handleAnchorClick, true);
    };
  }, [executeTransition]);

  /**
   * Browser back/forward (popstate) handling.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      if (isBusyRef.current) return;
      if (!isAllowedTransitionRoute(window.location.href)) return;

      const targetTitle = getDestinationTitle(window.location.href);
      executeTransition(window.location.pathname + window.location.search, targetTitle, true);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [executeTransition]);

  return (
    <div
      ref={overlayRef}
      id="aurelia-page-transition-overlay"
      className="page-transition-overlay"
      aria-hidden="true"
    >
      <div className="pt-label">
        <span className="pt-line">
          <span ref={textRef} className="pt-text" />
        </span>
      </div>
    </div>
  );
};

export default PageTransitionOverlay;
