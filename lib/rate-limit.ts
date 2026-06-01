/**
 * Simple in-memory rate limiter for API routes.
 * For production at scale, replace with Redis-based (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  max: number;
  /** Window duration in seconds */
  windowSec: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function rateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + config.windowSec * 1000 });
    return { success: true, remaining: config.max - 1, resetIn: config.windowSec };
  }

  if (entry.count >= config.max) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);
    return { success: false, remaining: 0, resetIn };
  }

  entry.count++;
  const resetIn = Math.ceil((entry.resetTime - now) / 1000);
  return { success: true, remaining: config.max - entry.count, resetIn };
}

/**
 * Extract client IP from request headers.
 * Works with Vercel, Cloudflare, and standard proxies.
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

/** Pre-configured limiters for common use cases */
export const RATE_LIMITS = {
  /** Auth: 5 attempts per 15 minutes */
  auth: { max: 5, windowSec: 15 * 60 },
  /** Registration: 3 per hour */
  register: { max: 3, windowSec: 60 * 60 },
  /** Contact form: 3 per 10 minutes */
  contact: { max: 3, windowSec: 10 * 60 },
  /** Newsletter: 3 per 10 minutes */
  newsletter: { max: 3, windowSec: 10 * 60 },
  /** Checkout: 10 per 15 minutes */
  checkout: { max: 10, windowSec: 15 * 60 },
  /** Promo validation: 10 per 5 minutes */
  promo: { max: 10, windowSec: 5 * 60 },
  /** General API: 60 per minute */
  api: { max: 60, windowSec: 60 },
} as const;
