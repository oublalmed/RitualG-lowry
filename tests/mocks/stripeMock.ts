import { vi } from 'vitest';
import { createHmac } from 'crypto';

export const mockPaymentIntent = {
  id: 'pi_test_mock123456789',
  client_secret: 'pi_test_mock123456789_secret_abc',
  amount: 58500,
  currency: 'mad',
  status: 'requires_payment_method' as const,
  metadata: {},
};

export const stripeMock = {
  paymentIntents: {
    create: vi.fn(async () => mockPaymentIntent),
    retrieve: vi.fn(async () => mockPaymentIntent),
    cancel: vi.fn(async () => ({ ...mockPaymentIntent, status: 'canceled' })),
  },
  refunds: {
    create: vi.fn(async (params: { payment_intent: string; amount?: number }) => ({
      id: `re_test_${Date.now()}`,
      payment_intent: params.payment_intent,
      amount: params.amount ?? mockPaymentIntent.amount,
      status: 'succeeded',
    })),
  },
  webhooks: {
    constructEvent: vi.fn(),
  },
};

vi.mock('@/lib/stripe', () => ({
  stripe: stripeMock,
  formatAmountForStripe: (amount: number) => Math.round(amount * 100),
}));

vi.mock('stripe', () => ({
  default: vi.fn(() => stripeMock),
}));

/**
 * Generate a real Stripe webhook signature for testing the webhook endpoint.
 * Uses HMAC-SHA256 just like Stripe does.
 */
export function generateStripeSignature(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signed = `${timestamp}.${payload}`;
  const signature = createHmac('sha256', secret).update(signed).digest('hex');
  return `t=${timestamp},v1=${signature}`;
}

export function createStripeWebhookEvent(
  type: string,
  data: Record<string, unknown>
): Record<string, unknown> {
  return {
    id: `evt_test_${Date.now()}`,
    type,
    data: { object: data },
    created: Math.floor(Date.now() / 1000),
  };
}
