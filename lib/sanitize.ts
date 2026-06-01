/**
 * Sanitize user input to prevent XSS when interpolated into HTML emails.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Strip any HTML tags from a string (for plain-text contexts).
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
