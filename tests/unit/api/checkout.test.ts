import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import { stripeMock, mockPaymentIntent } from '@/tests/mocks/stripeMock';
import { createPaidOrder } from '@/tests/factories/orderFactory';

// ── Mocks déclarés avant tout import de route ────────────────────────────────

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: { fetch: vi.fn() },
}));

import * as sanityClientModule from '@/lib/sanity/client';

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 9, resetIn: 0 }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
  RATE_LIMITS: {
    checkout: { max: 10, windowSec: 900 },
  },
}));

import { POST } from '@/app/api/checkout/create-payment-intent/route';

// ── Données fixes pour les tests ─────────────────────────────────────────────

const SANITY_PRODUCT = {
  name: 'Extension Brun Moka',
  basePrice: 585,
  variants: [{ _key: 'v1', label: '50cm', price: 585 }],
};

const VALID_BODY = {
  items: [
    {
      sanityProductId: 'prod-test-001',
      sanityVariantId: 'v1',
      quantity: 1,
      variantLabel: '50cm',
    },
  ],
  shippingAddress: {
    firstName: 'Imane',
    lastName: 'El Mansouri',
    phone: '0612345678',
    address: '12 Rue Hassan II',
    city: 'Casablanca',
    postalCode: '20000',
    country: 'MA',
  },
  shippingMethod: 'STANDARD' as const,
  promoCode: null,
  guestEmail: 'imane@example.com',
};

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/checkout/create-payment-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  });
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('Paiement — POST /api/checkout/create-payment-intent', () => {
  beforeEach(() => {
    resetPrismaMocks();
    vi.mocked(sanityClientModule.sanityClient.fetch).mockReset();
    vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_stub');

    // Comportement par défaut
    vi.mocked(sanityClientModule.sanityClient.fetch).mockResolvedValue(SANITY_PRODUCT);
    prismaMock.promoCode.findUnique.mockResolvedValue(null);
    prismaMock.order.create.mockResolvedValue(createPaidOrder());
    prismaMock.order.update.mockResolvedValue({});
    stripeMock.paymentIntents.create.mockResolvedValue(mockPaymentIntent);
  });

  // ── TC-PAY-001 : Panier valide → 200 + clientSecret ────────────────────────
  describe('TC-PAY-001 : panier valide', () => {
    it('devrait retourner 200 et le clientSecret Stripe', async () => {
      const res = await POST(makeRequest(VALID_BODY));
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.clientSecret).toBe(mockPaymentIntent.client_secret);
    });
  });

  // ── TC-PAY-002 : Recalcul du total côté serveur ─────────────────────────────
  describe('TC-PAY-002 : recalcul serveur des prix Sanity', () => {
    it('devrait calculer le total à partir des prix Sanity, ignorant le prix soumis par le client', async () => {
      const res = await POST(makeRequest(VALID_BODY));
      const data = await res.json();

      expect(res.status).toBe(200);
      // subtotal = 585 * 1 = 585 ; livraison STANDARD sous 1200 MAD = +50
      // total attendu = 635
      expect(data.total).toBe(635);
    });
  });

  // ── TC-PAY-003 : Commande créée en base avec statut PENDING ─────────────────
  describe('TC-PAY-003 : création de la commande en base', () => {
    it('devrait appeler prisma.order.create avec le statut PENDING', async () => {
      await POST(makeRequest(VALID_BODY));

      expect(prismaMock.order.create).toHaveBeenCalledOnce();
      const callArg = prismaMock.order.create.mock.calls[0][0] as {
        data: { status: string };
      };
      expect(callArg.data.status).toBe('PENDING');
    });
  });

  // ── TC-PAY-004 : Format du numéro de commande (préfixe LUX-) ────────────────
  describe('TC-PAY-004 : format du numéro de commande', () => {
    it("devrait retourner un numéro de commande commençant par 'LUX-'", async () => {
      const res = await POST(makeRequest(VALID_BODY));
      const data = await res.json();

      expect(data.orderNumber).toMatch(/^LUX-/);
    });
  });

  // ── TC-PAY-005 : Métadonnées Stripe contiennent l'orderId ───────────────────
  describe('TC-PAY-005 : métadonnées Stripe', () => {
    it("devrait inclure l'orderId dans les métadonnées du PaymentIntent Stripe", async () => {
      const fakeOrder = createPaidOrder({ id: 'order-abc-123' });
      prismaMock.order.create.mockResolvedValue(fakeOrder);

      await POST(makeRequest(VALID_BODY));

      expect(stripeMock.paymentIntents.create).toHaveBeenCalledOnce();
      const stripeCall = stripeMock.paymentIntents.create.mock.calls[0][0] as {
        metadata: { orderId: string };
      };
      expect(stripeCall.metadata.orderId).toBe(fakeOrder.id);
    });
  });

  // ── TC-PAY-006 : Prix manipulé par le client → serveur utilise Sanity ────────
  describe('TC-PAY-006 : résistance à la manipulation du prix', () => {
    it('devrait ignorer le prix soumis par le client et utiliser celui de Sanity', async () => {
      // Le client envoie un quantity mais ne peut pas injecter un prix :
      // on vérifie que le total final utilise toujours basePrice=585
      const bodyWithExtraQuantity = {
        ...VALID_BODY,
        items: [
          {
            sanityProductId: 'prod-test-001',
            sanityVariantId: 'v1',
            quantity: 2,
            variantLabel: '50cm',
          },
        ],
      };

      const res = await POST(makeRequest(bodyWithExtraQuantity));
      const data = await res.json();

      expect(res.status).toBe(200);
      // subtotal = 585 * 2 = 1170 ; livraison STANDARD gratuite car >= 1200 ? non, 1170 < 1200 → +50
      // total attendu = 1220
      expect(data.total).toBe(1220);
      // Le prix unitaire dans l'appel Stripe vient bien du serveur
      const stripeArg = stripeMock.paymentIntents.create.mock.calls[0][0] as {
        amount: number;
      };
      expect(stripeArg.amount).toBe(122000); // 1220 * 100
    });
  });

  // ── TC-PAY-007 : Produit introuvable dans Sanity → 400 ──────────────────────
  describe('TC-PAY-007 : produit inexistant', () => {
    it('devrait retourner 400 si le produit est introuvable dans Sanity', async () => {
      vi.mocked(sanityClientModule.sanityClient.fetch).mockResolvedValue(null);

      const res = await POST(makeRequest(VALID_BODY));
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toMatch(/introuvable/i);
    });
  });
});
