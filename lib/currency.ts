/**
 * Central currency formatting for Ritual Glowry (Belgium — EUR)
 * Change CURRENCY and LOCALE here to update the entire app.
 */
export const CURRENCY = 'EUR';
export const CURRENCY_SYMBOL = '€';
export const LOCALE = 'fr-BE';

/**
 * Format a price amount as a localized currency string.
 * e.g. formatPrice(89) → "89,00 €"
 */
export function formatPrice(amount: number | string | null | undefined): string {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

/**
 * Format a date in Belgian French.
 * e.g. formatDate('2026-06-04') → "4 juin 2026"
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
  return new Date(date).toLocaleDateString(LOCALE, options);
}
