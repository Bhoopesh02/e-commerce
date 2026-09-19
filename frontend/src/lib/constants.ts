export const BRAND_NAME = 'AURELIA';
export const BRAND_TAGLINE = 'Haute Couture & Ready-to-Wear Atelier';

/**
 * Return window configuration in days.
 * Returns can be requested only when status is 'Delivered', within this window.
 */
export const RETURN_WINDOW_DAYS = 7;

/**
 * Customer order cancellation eligibility:
 * Only allowed when status is 'Placed' or 'Confirmed'.
 */
export const CUSTOMER_CANCELLABLE_STATUSES = ['Placed', 'Confirmed'] as const;

/**
 * Admin order cancellation eligibility:
 * Allowed up to 'Packed' (never after 'Shipped').
 */
export const ADMIN_CANCELLABLE_STATUSES = ['Placed', 'Confirmed', 'Packed'] as const;

/**
 * Low stock threshold warning
 */
export const LOW_STOCK_THRESHOLD = 3;

/**
 * Notification channels supported (Strictly email only per specification)
 */
export const SUPPORTED_NOTIFICATION_CHANNELS = ['email'] as const;

/**
 * Standard simulated network latency in milliseconds
 */
export const MOCK_API_DELAY_MS = 200;
