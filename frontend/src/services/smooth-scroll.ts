import Lenis from 'lenis';

export type ScrollToTarget = number | string | HTMLElement;
export type ScrollToOptions = Parameters<Lenis['scrollTo']>[1];

export interface ISmoothScrollService {
  start(): void;
  stop(): void;
  destroy(): void;
  scrollTo(target: ScrollToTarget, options?: ScrollToOptions): void;
  getLenis(): Lenis | null;
}

/**
 * Singleton service for momentum-style inertia smooth scrolling powered by Lenis.
 * Features:
 * - 1.2s smooth exponential deceleration curve for luxury fluidity.
 * - autoRaf enabled for native 60/120Hz display refresh synchronization.
 * - Explicit respectReducedMotion: false to guarantee silky momentum scrolling across all OS display configurations.
 * - Automatic prevention for nested scroll containers marked with data-lenis-prevent or .filter-scroll-container.
 */
class SmoothScrollService implements ISmoothScrollService {
  private static instance: SmoothScrollService | null = null;
  private lenis: Lenis | null = null;

  public constructor() {}

  public static getInstance(): SmoothScrollService {
    if (!SmoothScrollService.instance) {
      SmoothScrollService.instance = new SmoothScrollService();
    }
    return SmoothScrollService.instance;
  }

  /**
   * Initializes and starts Lenis with inertia smooth scrolling.
   */
  public start(): void {
    if (typeof window === 'undefined') return;

    // If already running, ensure active
    if (this.lenis) {
      this.lenis.start();
      return;
    }

    // Initialize Lenis with luxury smooth momentum configuration
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoRaf: true,
      respectReducedMotion: false,
      prevent: (node: HTMLElement) => {
        return (
          node.hasAttribute('data-lenis-prevent') ||
          Boolean(node.closest?.('[data-lenis-prevent]')) ||
          node.classList?.contains('filter-scroll-container') ||
          Boolean(node.closest?.('.filter-scroll-container'))
        );
      },
    } as any);

    if (process.env.NODE_ENV !== 'production') {
      (window as any).__lenis = this.lenis;
    }
  }

  /**
   * Pauses smooth scrolling (e.g. for modal overlays or drawers)
   */
  public stop(): void {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  /**
   * Destroys the Lenis instance and cleans up event listeners and RAF.
   */
  public destroy(): void {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      if (typeof window !== 'undefined' && (window as any).__lenis) {
        delete (window as any).__lenis;
      }
    }
  }

  /**
   * Smoothly scrolls to the given target (number, selector, or element).
   */
  public scrollTo(target: ScrollToTarget, options?: ScrollToOptions): void {
    if (this.lenis) {
      this.lenis.scrollTo(target, options);
    } else if (typeof window !== 'undefined') {
      const behavior: ScrollBehavior = options?.immediate ? 'instant' : 'smooth';
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
export const stop = () => smoothScrollService.stop();
export const destroy = () => smoothScrollService.destroy();
export const scrollTo = (target: ScrollToTarget, options?: ScrollToOptions) =>
  smoothScrollService.scrollTo(target, options);

export default smoothScrollService;

