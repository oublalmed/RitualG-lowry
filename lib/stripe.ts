import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === "production") {
  throw new Error("STRIPE_SECRET_KEY is required in production");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
});

/**
 * Convert MAD amount (e.g. 585.00) to the smallest currency unit (centimes).
 * Stripe expects amounts in the smallest unit for zero-decimal currencies.
 * MAD is NOT zero-decimal, so we multiply by 100.
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}
