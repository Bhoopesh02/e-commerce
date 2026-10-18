import { Product, Category } from '@/types';

export function areCategoriesEqual(a?: Category[] | null, b?: Category[] | null): boolean {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

export function areProductsEqual(a?: Product[] | null, b?: Product[] | null): boolean {
  if (a === b) return true;
  if (!a || !b) return a === b;
  if (a.length !== b.length) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}
