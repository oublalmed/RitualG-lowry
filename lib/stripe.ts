import Stripe from "stripe";

// Lazy singleton — only instantiated when first used, so missing key
// in dev doesn't crash module import for non-checkout pages.
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("STRIPE_SECRET_KEY is required in production");
    }
    // In dev: return a dummy client that won't actually call Stripe
    // Real calls will fail gracefully with a clear error
    console.warn("[stripe] STRIPE_SECRET_KEY not set — Stripe features disabled in dev");
  }

  _stripe = new Stripe(key ?? "sk_test_placeholder", {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
  });
  return _stripe;
}

// Named export for backwards compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}
