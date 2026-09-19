/**
 * Single source of truth for price formatting across the entire application.
 * Formats values in INR (₹) with Indian numbering grouping (lakhs/crores).
 */
export function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
