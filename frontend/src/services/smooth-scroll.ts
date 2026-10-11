import Lenis from 'lenis';

export type ScrollToTarget = number | string | HTMLElement;
export type ScrollToOptions = Parameters<Lenis['scrollTo']>[1];

export interface ISmoothScrollService {
  start(): void;
  destroy(): void;
  scrollTo(target: ScrollToTarget, options?: ScrollToOptions): void;
  getLenis(): Lenis | null;
}

/**
 * Singleton service for momentum-style inertia smooth scrolling powered by Lenis.
 * Configured with lerp: 0.08, wheelMultiplier: 1, smoothWheel: true.
 * Respects 'prefers-reduced-motion: reduce'.
 */
class SmoothScrollService implements ISmoothScrollService {
  private static instance: SmoothScrollService | null = null;
  private lenis: Lenis | null = null;
  private rafId: number | null = null;

  public constructor() {}

  public static getInstance(): SmoothScrollService {
    if (!SmoothScrollService.instance) {
      SmoothScrollService.instance = new SmoothScrollService();
    }
    return SmoothScrollService.instance;
  }

  /**
   * Initializes and starts Lenis with inertia smooth scrolling.
   * Skips initialization if user prefers reduced motion or if window is unavailable.
   */
  public start(): void {
    if (typeof window === 'undefined') return;

    // Check if the user has requested reduced motion
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      return;
    }

    // If already running, ensure loop is active and return
    if (this.lenis) {
      this.lenis.start();
      if (this.rafId === null) {
        this.runRafLoop();
      }
      return;
    }

    // Initialize Lenis with exact configuration
    this.lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothWheel: true,
    } as any);

    this.runRafLoop();
  }

  private runRafLoop = (): void => {
    const onFrame = (time: number) => {
      if (this.lenis) {
        this.lenis.raf(time);
        this.rafId = requestAnimationFrame(onFrame);
      }
    };
    this.rafId = requestAnimationFrame(onFrame);
  };

  /**
   * Destroys the Lenis instance and cancels any active requestAnimationFrame to prevent leaks.
   */
  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
  }

  /**
   * Smoothly scrolls to the given target (number, selector, or element).
   */
  public scrollTo(target: ScrollToTarget, options?: ScrollToOptions): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      const behavior: ScrollBehavior = options?.immediate ? 'instant' : 'auto';
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior });
      } else if (typeof target === 'string') {
        const element = document.querySelector(target);
        element?.scrollIntoView({ behavior });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior });
      }
    }
  }

  /**
   * Returns current underlying Lenis instance (or null if not running).
   */
  public getLenis(): Lenis | null {
    return this.lenis;
  }
}

export const smoothScrollService = SmoothScrollService.getInstance();
export const start = () => smoothScrollService.start();
export const destroy = () => smoothScrollService.destroy();
export const scrollTo = (target: ScrollToTarget, options?: ScrollToOptions) =>
  smoothScrollService.scrollTo(target, options);

export default smoothScrollService;
