/**
 * Luxury Asset Preloading Engine
 * Provides network-aware, deduplicated in-memory background image preloading.
 */

// Global deduplication cache
const preloadedUrls = new Set<string>();

/**
 * Checks if the patron's network environment is suitable for background prefetching.
 * Respects Save-Data preference and avoids aggressive fetching on slow 2G connections.
 */
export function shouldPerformPreload(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  const nav = navigator as unknown as {
    connection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
    mozConnection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
    webkitConnection?: {
      saveData?: boolean;
      effectiveType?: string;
    };
  };

  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (connection) {
    // If user explicitly enabled Data Saver in browser/OS settings
    if (connection.saveData === true) {
      return false;
    }
    // Avoid aggressive lookahead preloading on severely constrained networks
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return false;
    }
  }

  return true;
}

/**
 * Preloads a single image URL into browser cache without rendering to DOM.
 * Decodes the image in the background thread when supported.
 */
export function preloadImage(src?: string | null): Promise<void> {
  if (!src || typeof window === 'undefined') {
    return Promise.resolve();
  }

  // Already preloaded or in progress
  if (preloadedUrls.has(src)) {
    return Promise.resolve();
  }

  if (!shouldPerformPreload()) {
    return Promise.resolve();
  }

  preloadedUrls.add(src);

  return new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.src = src;

      // Decode on off-screen thread if available for zero jank when later mounted
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode()
          .then(() => resolve())
          .catch(() => resolve()); // Fallback silently on decode error
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    } catch {
      resolve();
    }
  });
}

/**
 * Preloads multiple image URLs in parallel.
 */
export function preloadImages(srcs: (string | undefined | null)[]): Promise<void[]> {
  const validUrls = srcs.filter((s): s is string => Boolean(s));
  return Promise.all(validUrls.map((url) => preloadImage(url)));
}
