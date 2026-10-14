/**
 * Route-to-Title mapping for Aurelia page transition overlay.
 * Specifically configured for the primary navigation pages:
 * - Home
 * - Collections (All Collections, Men, Women)
 * - New Arrivals
 * - Shop by Category (Outerwear, Tailoring, Eveningwear, Knitwear, Leather Goods, Footwear, Fine Jewelry, Fragrances)
 */
export const ROUTE_TITLES: Record<string, string> = {
  '/': 'HOME',
  '/collections': 'COLLECTIONS',
  '/collections/men': 'MEN',
  '/collections/women': 'WOMEN',
  '/new-arrivals': 'NEW ARRIVALS',
  '/shop': 'ALL COLLECTIONS',
  '/category/men': 'MEN',
  '/category/women': 'WOMEN',
  '/category/outerwear': 'OUTERWEAR',
  '/category/tailoring': 'TAILORING',
  '/category/eveningwear': 'EVENINGWEAR',
  '/category/knitwear': 'KNITWEAR',
  '/category/leather-goods': 'LEATHER GOODS',
  '/category/footwear': 'FOOTWEAR',
  '/category/fine-jewelry': 'FINE JEWELRY',
  '/category/fragrances': 'FRAGRANCES',
};

/**
 * Checks if a route qualifies for the page transition animation.
 * Strictly limited to:
 * - Home (/)
 * - Collections (/collections, /collections/men, /collections/women)
 * - New Arrivals (/new-arrivals)
 * - Shop & Category pages (/shop, /shop?categorySlug=..., /category/...)
 */
export function isAllowedTransitionRoute(urlOrPath: string): boolean {
  try {
    const url = new URL(
      urlOrPath,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    );
    const pathname = url.pathname.replace(/\/$/, '') || '/';

    // 1. Home
    if (pathname === '/') return true;

    // 2. Collections & Departments
    if (
      pathname === '/collections' ||
      pathname === '/collections/men' ||
      pathname === '/collections/women'
    ) {
      return true;
    }

    // 3. New Arrivals
    if (pathname === '/new-arrivals') return true;

    // 4. Shop & Category pages
    if (pathname === '/shop' || pathname.startsWith('/category/')) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Prettifies the last URL segment (e.g. "men-wear" -> "MEN WEAR").
 */
export function prettifyUrlSegment(urlOrPath: string): string {
  try {
    const url = new URL(
      urlOrPath,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    );
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      return decodeURIComponent(last).replace(/[-_]/g, ' ').toUpperCase();
    }
  } catch {
    const clean = urlOrPath.split('?')[0].split('#')[0].replace(/\/$/, '');
    const segments = clean.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments[segments.length - 1].replace(/[-_]/g, ' ').toUpperCase();
    }
  }
  return 'AURELIA';
}

/**
 * Resolves destination page title according to priority:
 * 1. categorySlug search param if on /shop (e.g. /shop?categorySlug=outerwear -> OUTERWEAR)
 * 2. Exact match in ROUTE_TITLES map
 * 3. Link's `data-transition-title` attribute
 * 4. Link's text content
 * 5. Prettified last URL segment
 */
export function getDestinationTitle(
  urlOrPath: string,
  element?: HTMLElement | null
): string {
  let title = '';

  try {
    const url = new URL(
      urlOrPath,
      typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
    );
    const pathname = url.pathname.replace(/\/$/, '') || '/';

    // 1. Category search parameter on shop
    if (url.searchParams.has('categorySlug')) {
      const slug = url.searchParams.get('categorySlug');
      if (slug) {
        title = slug.replace(/[-_]/g, ' ').toUpperCase();
      }
    }

    // 2. Exact match in ROUTE_TITLES
    if (!title && ROUTE_TITLES[pathname]) {
      title = ROUTE_TITLES[pathname].toUpperCase();
    }

    // 3. Link's data-transition-title attribute
    if (!title && element) {
      const dataTitle = element.getAttribute('data-transition-title');
      if (dataTitle && dataTitle.trim()) {
        title = dataTitle.trim().toUpperCase();
      }
    }

    // 4. Link's text content
    if (!title && element) {
      const linkText = element.textContent?.trim();
      if (linkText && linkText.length > 0 && linkText.length < 50) {
        title = linkText.replace(/\s+/g, ' ').toUpperCase();
      }
    }

    // 5. Prettified last URL segment
    if (!title) {
      title = prettifyUrlSegment(urlOrPath);
    }
  } catch {
    title = prettifyUrlSegment(urlOrPath);
  }

  if (!title || !title.trim()) {
    console.warn('pt: empty title for', urlOrPath);
    title = prettifyUrlSegment(urlOrPath);
  }

  return title.trim() || 'AURELIA';
}
