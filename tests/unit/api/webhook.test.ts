import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import {
  stripeMock,
  generateStripeSignature,
  createStripeWebhookEvent,
} from '@/tests/mocks/stripeMock';
import { createOrder, createPaidOrder } from '@/tests/factories/orderFactory';

// ── Mocks déclarés avant tout import de route ────────────────────────────────

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue({ success: true }),
  sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
  sendAdminNotification: vi.fn().mockResolvedValue({ success: true }),
}));

import * as emailModule from '@/lib/email';

// next/headers est mocké globalement dans setup.ts avec new Map().
// On le remplace ici pour contrôler la valeur de 'stripe-signature' par test.
const mockHeadersMap = new Map<string, string>();
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => mockHeadersMap),
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

import { POST } from '@/app/api/webhook/stripe/route';

// ── Constantes ────────────────────────────────────────────────────────────────

const WEBHOOK_SECRET = 'whsec_test_secret';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makePendingOrder(overrides: Record<string, unknown> = {}) {
  const base = createOrder({
    id: 'order-webhook-test-001',
    guestEmail: 'client@example.com',
    status: 'PENDING',
    items: [
      {
        id: 'item-001',
        orderId: 'order-webhook-test-001',
        sanityProductId: 'prod-001',
        sanityVariantId: null,
        productName: 'Extension Brun Moka — 50cm',
        variantLabel: '50cm',
        quantity: 1,
        unitPrice: 585,
        totalPrice: 585,
        imageUrl: null,
      },
    ],
    ...overrides,
  } as Parameters<typeof createOrder>[0]);
  // Ajout de user:null pour satisfaire l'interface Prisma incluant la relation user
  return { ...base, user: null };
}

/**
 * Construit la requête webhook avec une signature Stripe valide.
 * `webhooks.constructEvent` est un mock : il retourne `event` si on le configure ainsi.
 */
function makeWebhookRequest(event: Record<string, unknown>, sig: string): Request {
  const payload = JSON.stringify(event);
  return new Request('http://localhost/api/webhook/stripe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': sig,
    },
    body: payload,
  });
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('Webhook Stripe — POST /api/webhook/stripe', () => {
  beforeEach(() => {
    resetPrismaMocks();
    mockHeadersMap.clear();
    vi.mocked(emailModule.sendOrderConfirmation).mockClear();
    vi.mocked(emailModule.sendPaymentFailureEmail).mockClear();
    vi.mocked(emailModule.sendAdminNotification).mockClear();

    vi.stubEnv('STRIPE_WEBHOOK_SECRET', WEBHOOK_SECRET);
    vi.stubEnv('ADMIN_EMAIL', 'admin@ritualglowry.com');

    // Par défaut : la vérification de signature réussit
    stripeMock.webhooks.constructEvent.mockImplementation(
      (_payload: string, _sig: string, _secret: string) => {
        return JSON.parse(_payload as string);
      }
    );
  });

  // ── TC-WH-001 : Signature valide + payment_intent.succeeded → 200 + PAID ────
  describe('TC-WH-001 : paiement réussi avec signature valide', () => {
    it('devrait retourner 200 et mettre à jour la commande en statut PAID', async () => {
      const pendingOrder = makePendingOrder();
      prismaMock.order.findUnique.mockResolvedValue(pendingOrder);
      prismaMock.order.update.mockResolvedValue({ ...pendingOrder, status: 'PAID' });

      const piData = {
        id: 'pi_test_001',
        metadata: { orderId: pendingOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.succeeded', piData);
      const payload = JSON.stringify(event);
      const sig = generateStripeSignature(payload, WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      const req = makeWebhookRequest(event, sig);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.received).toBe(true);
      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: pendingOrder.id },
          data: expect.objectContaining({ status: 'PAID' }),
        })
      );
    });
  });

  // ── TC-WH-002 : Signature invalide → 400 + aucune mise à jour ───────────────
  describe('TC-WH-002 : signature invalide', () => {
    it('devrait retourner 400 et ne pas mettre à jour la commande', async () => {
      const event = createStripeWebhookEvent('payment_intent.succeeded', {
        id: 'pi_bad',
        metadata: { orderId: 'order-fake' },
      });
      const payload = JSON.stringify(event);
      const sig = 'sig_invalide_totalement_fausse';

      mockHeadersMap.set('stripe-signature', sig);
      // Simuler l'échec de vérification de signature Stripe
      stripeMock.webhooks.constructEvent.mockImplementation(() => {
        throw new Error('No signatures found matching the expected signature for payload.');
      });

      const req = makeWebhookRequest(event, sig);
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });
  });

  // ── TC-WH-004 : En-tête stripe-signature absent → 400 ───────────────────────
  describe('TC-WH-004 : en-tête stripe-signature manquant', () => {
    it("devrait retourner 400 si l'en-tête stripe-signature est absent", async () => {
      const event = createStripeWebhookEvent('payment_intent.succeeded', {
        id: 'pi_no_sig',
        metadata: { orderId: 'order-no-sig' },
      });

      // Ne pas définir stripe-signature dans mockHeadersMap
      mockHeadersMap.delete('stripe-signature');

      const req = new Request('http://localhost/api/webhook/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toMatch(/signature/i);
    });
  });

  // ── TC-WH-005 : payment_intent.succeeded → statut PAID ──────────────────────
  describe('TC-WH-005 : statut mis à jour à PAID', () => {
    it("devrait mettre le statut de la commande à 'PAID' après un paiement réussi", async () => {
      const pendingOrder = makePendingOrder();
      prismaMock.order.findUnique.mockResolvedValue(pendingOrder);
      prismaMock.order.update.mockResolvedValue({ ...pendingOrder, status: 'PAID' });

      const piData = {
        id: 'pi_test_pay005',
        metadata: { orderId: pendingOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.succeeded', piData);
      const sig = generateStripeSignature(JSON.stringify(event), WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      await POST(makeWebhookRequest(event, sig));

      const updateCall = prismaMock.order.update.mock.calls[0][0] as {
        data: { status: string };
      };
      expect(updateCall.data.status).toBe('PAID');
    });
  });

  // ── TC-WH-007 : Email de confirmation envoyé après paiement ─────────────────
  describe("TC-WH-007 : envoi de l'email de confirmation", () => {
    it("devrait envoyer un email de confirmation à l'acheteur après un paiement réussi", async () => {
      const pendingOrder = makePendingOrder({ guestEmail: 'client@example.com' });
      prismaMock.order.findUnique.mockResolvedValue(pendingOrder);
      prismaMock.order.update.mockResolvedValue({ ...pendingOrder, status: 'PAID' });

      const piData = {
        id: 'pi_test_email',
        metadata: { orderId: pendingOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.succeeded', piData);
      const sig = generateStripeSignature(JSON.stringify(event), WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      await POST(makeWebhookRequest(event, sig));

      expect(vi.mocked(emailModule.sendOrderConfirmation)).toHaveBeenCalledOnce();
      expect(vi.mocked(emailModule.sendOrderConfirmation)).toHaveBeenCalledWith(
        'client@example.com',
        expect.objectContaining({ orderNumber: pendingOrder.orderNumber })
      );
    });
  });

  // ── TC-WH-011 : Idempotence — commande déjà PAID non retraitée ──────────────
  describe('TC-WH-011 : idempotence pour commande déjà payée', () => {
    it("ne devrait pas mettre à jour une commande dont le statut est déjà 'PAID'", async () => {
      const alreadyPaidOrder = createPaidOrder({
        id: 'order-already-paid',
        guestEmail: 'client@example.com',
      });
      prismaMock.order.findUnique.mockResolvedValue(alreadyPaidOrder);

      const piData = {
        id: 'pi_test_idem',
        metadata: { orderId: alreadyPaidOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.succeeded', piData);
      const sig = generateStripeSignature(JSON.stringify(event), WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      const res = await POST(makeWebhookRequest(event, sig));
      expect(res.status).toBe(200);
      // Aucune mise à jour ne doit être déclenchée
      expect(prismaMock.order.update).not.toHaveBeenCalled();
    });
  });

  // ── TC-WH-013 : payment_intent.payment_failed → statut CANCELLED ────────────
  describe('TC-WH-013 : paiement échoué → commande annulée', () => {
    it("devrait mettre le statut de la commande à 'CANCELLED' après un échec de paiement", async () => {
      const pendingOrder = makePendingOrder();
      prismaMock.order.findUnique.mockResolvedValue(pendingOrder);
      prismaMock.order.update.mockResolvedValue({ ...pendingOrder, status: 'CANCELLED' });

      const piData = {
        id: 'pi_test_fail',
        metadata: { orderId: pendingOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.payment_failed', piData);
      const sig = generateStripeSignature(JSON.stringify(event), WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      await POST(makeWebhookRequest(event, sig));

      expect(prismaMock.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: pendingOrder.id },
          data: expect.objectContaining({ status: 'CANCELLED' }),
        })
      );
    });
  });

  // ── TC-WH-016 : Retourne toujours 200 même en cas d'erreur interne ───────────
  describe('TC-WH-016 : réponse 200 même si le traitement interne échoue', () => {
    it('devrait retourner 200 même si la mise à jour de la commande lève une exception', async () => {
      const pendingOrder = makePendingOrder();
      prismaMock.order.findUnique.mockResolvedValue(pendingOrder);
      prismaMock.order.update.mockRejectedValue(new Error('Erreur DB simulée'));

      const piData = {
        id: 'pi_test_error',
        metadata: { orderId: pendingOrder.id },
      };
      const event = createStripeWebhookEvent('payment_intent.succeeded', piData);
      const sig = generateStripeSignature(JSON.stringify(event), WEBHOOK_SECRET);

      mockHeadersMap.set('stripe-signature', sig);
      stripeMock.webhooks.constructEvent.mockReturnValue(event);

      const res = await POST(makeWebhookRequest(event, sig));
      expect(res.status).toBe(200);
    });
  });
});
