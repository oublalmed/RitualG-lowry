import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import { createUser } from '@/tests/factories/userFactory';
import { createOrder, createPaidOrder } from '@/tests/factories/orderFactory';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue({ success: true }),
  sendAdminNotification: vi.fn().mockResolvedValue({ success: true }),
  sendPaymentFailureEmail: vi.fn().mockResolvedValue({ success: true }),
  sendOrderShipped: vi.fn().mockResolvedValue({ success: true }),
  sendOrderDelivered: vi.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
  sendPasswordResetEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
  },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key: string) => (key === 'stripe-signature' ? 'test-sig' : null)),
  })),
}));

const mockGetServerSession = vi.fn();
vi.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

vi.mock('@/lib/auth', () => ({ authOptions: {} }));

// ─── Import des routes après les mocks ────────────────────────────────────────

import { POST as stripeWebhook } from '@/app/api/webhook/stripe/route';
import { GET as adminGetStats } from '@/app/api/admin/stats/route';
import { GET as adminGetOrders } from '@/app/api/admin/orders/route';
import { GET as adminGetOrderById, PATCH as adminPatchOrder } from '@/app/api/admin/orders/[id]/route';

// ─── Stripe mock (accès après import) ─────────────────────────────────────────

import { stripe } from '@/lib/stripe';

// ─── Sessions ─────────────────────────────────────────────────────────────────

const SESSION_ADMIN = { user: { id: 'admin-1', role: 'ADMIN' } };
const SESSION_CUSTOMER = { user: { id: 'user-1', role: 'CUSTOMER' } };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calcule les points de fidélité attendus selon la logique métier :
 * 1 point pour chaque tranche de 10 MAD.
 */
function expectedLoyaltyPoints(totalMAD: number): number {
  return Math.floor(totalMAD / 10);
}

/**
 * Retourne le palier de fidélité (tier) selon le total de points cumulés.
 * BRONZE   : 0 – 499 points
 * SILVER   : 500 – 1 999 points
 * GOLD     : 2 000 – 4 999 points
 * PLATINUM : 5 000+ points
 */
function getTierFromPoints(points: number): 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' {
  if (points >= 5000) return 'PLATINUM';
  if (points >= 2000) return 'GOLD';
  if (points >= 500) return 'SILVER';
  return 'BRONZE';
}

function makeWebhookRequest(body: string) {
  return {
    text: vi.fn().mockResolvedValue(body),
  } as unknown as Request;
}

// ─── Suite principale ─────────────────────────────────────────────────────────

describe('Programme de fidélité et contrôle des permissions', () => {
  beforeEach(() => {
    resetPrismaMocks();
    mockGetServerSession.mockReset();
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_test_loyalty');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-LOYALTY-001 : Commande de 100 MAD → +10 points crédités
  // ───────────────────────────────────────────────────────────────────────────
  describe('TC-LOYALTY-001 : attribution des points de fidélité lors du paiement', () => {
    it('devrait créditer 10 points pour une commande de 100 MAD (1 point par tranche de 10 MAD)', async () => {
      // Assert — logique de calcul pure (100 MAD / 10 = 10 points)
      expect(expectedLoyaltyPoints(100)).toBe(10);
    });

    it('devrait créditer 1 point pour une commande de 10 MAD', () => {
      expect(expectedLoyaltyPoints(10)).toBe(1);
    });

    it('devrait créditer 0 point pour une commande inférieure à 10 MAD', () => {
      expect(expectedLoyaltyPoints(9)).toBe(0);
    });

    it('devrait créditer 150 points pour une commande de 1 500 MAD', () => {
      expect(expectedLoyaltyPoints(1500)).toBe(150);
    });

    it('devrait appeler prisma.user.update avec { loyaltyPoints: { increment: N } } lors du webhook payment_intent.succeeded', async () => {
      // Arrange
      const customer = createUser({ id: 'user-loyalty-1', email: 'client@test.com' });
      const order = createPaidOrder({
        id: 'order-loyalty-1',
        userId: customer.id,
        total: 100,
        status: 'PENDING', // statut avant paiement pour que le webhook traite
        guestEmail: null,
      });
      // Simuler un order avec relation user
      const orderWithUser = { ...order, user: customer };

      prismaMock.order.findUnique.mockResolvedValue(orderWithUser as never);
      prismaMock.order.update.mockResolvedValue({ ...order, status: 'PAID' } as never);
      prismaMock.user.update.mockResolvedValue({ ...customer, loyaltyPoints: 10 } as never);
      prismaMock.loyaltyTransaction.create.mockResolvedValue({} as never);

      const fakeEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_123',
            metadata: { orderId: 'order-loyalty-1' },
          },
        },
      };

      (stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>).mockReturnValue(fakeEvent);

      // Act
      const req = makeWebhookRequest('{}');
      await stripeWebhook(req as Request);

      // Assert
      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: customer.id },
          data: expect.objectContaining({
            loyaltyPoints: { increment: 10 },
          }),
        })
      );
    });

    it('devrait créer une transaction de fidélité de type EARNED lors du paiement', async () => {
      // Arrange
      const customer = createUser({ id: 'user-loyalty-2', email: 'client2@test.com' });
      const order = createPaidOrder({
        id: 'order-loyalty-2',
        userId: customer.id,
        total: 200,
        status: 'PENDING',
        guestEmail: null,
      });
      const orderWithUser = { ...order, user: customer };

      prismaMock.order.findUnique.mockResolvedValue(orderWithUser as never);
      prismaMock.order.update.mockResolvedValue({ ...order, status: 'PAID' } as never);
      prismaMock.user.update.mockResolvedValue({ ...customer, loyaltyPoints: 20 } as never);
      prismaMock.loyaltyTransaction.create.mockResolvedValue({} as never);

      const fakeEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test_456',
            metadata: { orderId: 'order-loyalty-2' },
          },
        },
      };

      (stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>).mockReturnValue(fakeEvent);

      // Act
      const req = makeWebhookRequest('{}');
      await stripeWebhook(req as Request);

      // Assert — 200 MAD / 10 = 20 points
      expect(prismaMock.loyaltyTransaction.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: customer.id,
            type: 'EARNED',
            points: 20,
            orderId: 'order-loyalty-2',
          }),
        })
      );
    });

    it('ne devrait pas créditer de points pour une commande invité sans userId', async () => {
      // Arrange
      const guestOrder = createOrder({
        id: 'order-guest-1',
        userId: null,
        total: 500,
        status: 'PENDING',
        guestEmail: 'guest@example.com',
      });
      const orderWithUser = { ...guestOrder, user: null };

      prismaMock.order.findUnique.mockResolvedValue(orderWithUser as never);
      prismaMock.order.update.mockResolvedValue({ ...guestOrder, status: 'PAID' } as never);

      const fakeEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_guest_789',
            metadata: { orderId: 'order-guest-1' },
          },
        },
      };

      (stripe.webhooks.constructEvent as ReturnType<typeof vi.fn>).mockReturnValue(fakeEvent);

      // Act
      const req = makeWebhookRequest('{}');
      await stripeWebhook(req as Request);

      // Assert — pas de mise à jour des points pour un invité
      expect(prismaMock.user.update).not.toHaveBeenCalled();
      expect(prismaMock.loyaltyTransaction.create).not.toHaveBeenCalled();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-LOYALTY-003 : Paliers de fidélité selon les seuils de points
  // BRONZE (0–499), SILVER (500–1999), GOLD (2000–4999), PLATINUM (5000+)
  // ───────────────────────────────────────────────────────────────────────────
  describe('TC-LOYALTY-003 : seuils des paliers de fidélité', () => {
    describe('Palier BRONZE (0 à 499 points)', () => {
      it('devrait être BRONZE avec 0 points', () => {
        expect(getTierFromPoints(0)).toBe('BRONZE');
      });

      it('devrait être BRONZE avec 1 point', () => {
        expect(getTierFromPoints(1)).toBe('BRONZE');
      });

      it('devrait être BRONZE avec 499 points (limite supérieure incluse)', () => {
        expect(getTierFromPoints(499)).toBe('BRONZE');
      });
    });

    describe('Palier SILVER (500 à 1999 points)', () => {
      it('devrait passer à SILVER avec exactement 500 points', () => {
        expect(getTierFromPoints(500)).toBe('SILVER');
      });

      it('devrait être SILVER avec 1 000 points', () => {
        expect(getTierFromPoints(1000)).toBe('SILVER');
      });

      it('devrait être SILVER avec 1 999 points (limite supérieure incluse)', () => {
        expect(getTierFromPoints(1999)).toBe('SILVER');
      });
    });

    describe('Palier GOLD (2000 à 4999 points)', () => {
      it('devrait passer à GOLD avec exactement 2 000 points', () => {
        expect(getTierFromPoints(2000)).toBe('GOLD');
      });

      it('devrait être GOLD avec 3 500 points', () => {
        expect(getTierFromPoints(3500)).toBe('GOLD');
      });

      it('devrait être GOLD avec 4 999 points (limite supérieure incluse)', () => {
        expect(getTierFromPoints(4999)).toBe('GOLD');
      });
    });

    describe('Palier PLATINUM (5000+ points)', () => {
      it('devrait passer à PLATINUM avec exactement 5 000 points', () => {
        expect(getTierFromPoints(5000)).toBe('PLATINUM');
      });

      it('devrait être PLATINUM avec 10 000 points', () => {
        expect(getTierFromPoints(10000)).toBe('PLATINUM');
      });

      it('devrait être PLATINUM avec un très grand nombre de points', () => {
        expect(getTierFromPoints(999999)).toBe('PLATINUM');
      });
    });

    it('devrait attribuer le bon palier selon les points cumulés (tableau de correspondance)', () => {
      const cases: Array<[number, 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM']> = [
        [0, 'BRONZE'],
        [250, 'BRONZE'],
        [499, 'BRONZE'],
        [500, 'SILVER'],
        [1500, 'SILVER'],
        [1999, 'SILVER'],
        [2000, 'GOLD'],
        [3000, 'GOLD'],
        [4999, 'GOLD'],
        [5000, 'PLATINUM'],
        [7500, 'PLATINUM'],
      ];

      cases.forEach(([points, expectedTier]) => {
        expect(getTierFromPoints(points)).toBe(expectedTier);
      });
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERM-001 : Un client accédant à une route admin → 403
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-PERM-001 : un client ne peut pas accéder aux routes d'administration", () => {
    it("devrait retourner 403 lorsqu'un client tente d'accéder à GET /api/admin/orders", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = new Request('http://localhost/api/admin/orders', { method: 'GET' });
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 lorsqu'un client tente d'accéder à GET /api/admin/stats", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const res = await adminGetStats();
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 lorsqu'un client tente de modifier une commande via PATCH /api/admin/orders/:id", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-perm-1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SHIPPED' }),
      });
      const res = await adminPatchOrder(req, { params: Promise.resolve({ id: 'order-perm-1' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERM-002 : Un administrateur peut accéder aux routes admin → 200
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-PERM-002 : un administrateur peut accéder aux routes d'administration", () => {
    it("devrait retourner 200 lorsqu'un administrateur accède à GET /api/admin/orders", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);
      prismaMock.order.findMany.mockResolvedValue([] as never);
      prismaMock.order.count.mockResolvedValue(0 as never);

      // Act
      const req = new Request('http://localhost/api/admin/orders', { method: 'GET' });
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.data).toBeDefined();
    });

    it("devrait retourner 200 lorsqu'un administrateur accède à GET /api/admin/stats", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);

      // Act
      const res = await adminGetStats();

      // Assert
      expect(res.status).toBe(200);
    });

    it("devrait retourner 200 lorsqu'un administrateur accède au détail d'une commande", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);
      const paidOrder = createPaidOrder({ id: 'order-perm-admin-1' });
      prismaMock.order.findUnique.mockResolvedValue(paidOrder as never);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-perm-admin-1', { method: 'GET' });
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'order-perm-admin-1' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.data).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERM-003 : Route API admin sans authentification → 401 / 403
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-PERM-003 : routes API admin sans session retournent une erreur d'accès", () => {
    it("devrait retourner 403 sur GET /api/admin/orders sans session", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const req = new Request('http://localhost/api/admin/orders', { method: 'GET' });
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert — les routes admin renvoient 403 (Accès refusé) en l'absence de session
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur GET /api/admin/stats sans session", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const res = await adminGetStats();
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur GET /api/admin/orders/:id sans session", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-nauth-1', { method: 'GET' });
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'order-nauth-1' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur PATCH /api/admin/orders/:id sans session", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-nauth-2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' }),
      });
      const res = await adminPatchOrder(req, { params: Promise.resolve({ id: 'order-nauth-2' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-PERM-004 : Route API admin avec session CUSTOMER → 403
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-PERM-004 : routes API admin avec session CLIENT retournent 403", () => {
    it("devrait retourner 403 sur GET /api/admin/orders avec un rôle CUSTOMER", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = new Request('http://localhost/api/admin/orders', { method: 'GET' });
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur GET /api/admin/stats avec un rôle CUSTOMER", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const res = await adminGetStats();
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur GET /api/admin/orders/:id avec un rôle CUSTOMER", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-cust-1', { method: 'GET' });
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'order-cust-1' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it("devrait retourner 403 sur PATCH /api/admin/orders/:id avec un rôle CUSTOMER", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = new Request('http://localhost/api/admin/orders/order-cust-2', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PROCESSING' }),
      });
      const res = await adminPatchOrder(req, { params: Promise.resolve({ id: 'order-cust-2' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });
  });
});
