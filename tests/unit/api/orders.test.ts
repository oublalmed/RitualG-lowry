import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import { createPaidOrder } from '@/tests/factories/orderFactory';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

vi.mock('@/lib/email', () => ({
  sendOrderConfirmation: vi.fn().mockResolvedValue({ success: true }),
  sendAdminNotification: vi.fn().mockResolvedValue({ success: true }),
}));

// next-auth mock contrôlé par chaque test via mockReturnValue
const mockGetServerSession = vi.fn();
vi.mock('next-auth', () => ({
  getServerSession: (...args: unknown[]) => mockGetServerSession(...args),
}));

vi.mock('@/lib/auth', () => ({ authOptions: {} }));

// ─── Import des routes après les mocks ────────────────────────────────────────

import { GET as adminGetOrders } from '@/app/api/admin/orders/route';
import { GET as adminGetOrderById } from '@/app/api/admin/orders/[id]/route';

// ─── Sessions ─────────────────────────────────────────────────────────────────

const SESSION_ADMIN = { user: { id: 'admin-1', role: 'ADMIN' } };
const SESSION_CUSTOMER = { user: { id: 'user-1', role: 'CUSTOMER' } };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeGetRequest(url = 'http://localhost/api/admin/orders') {
  return new Request(url, { method: 'GET' });
}

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('Routes de commandes — /api/admin/orders', () => {
  beforeEach(() => {
    resetPrismaMocks();
    mockGetServerSession.mockReset();
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ORDER-006 : GET /api/admin/orders avec session ADMIN → retourne les commandes
  // ───────────────────────────────────────────────────────────────────────────
  describe('TC-ORDER-006 : liste des commandes accessibles par un administrateur', () => {
    it("devrait retourner 200 avec la liste de toutes les commandes sans filtre d'utilisateur", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);
      const paidOrder = createPaidOrder();
      prismaMock.order.findMany.mockResolvedValue([paidOrder] as never);
      prismaMock.order.count.mockResolvedValue(1 as never);

      // Act
      const req = makeGetRequest();
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].id).toBe(paidOrder.id);
      expect(body.total).toBe(1);

      // Vérifier que le filtre userId n'est pas appliqué (admin voit tout)
      const callArgs = prismaMock.order.findMany.mock.calls[0][0] as { where?: Record<string, unknown> };
      expect(callArgs?.where?.userId).toBeUndefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ORDER-007 : GET /api/admin/orders sans session → 403
  // ───────────────────────────────────────────────────────────────────────────
  describe('TC-ORDER-007 : accès non authentifié refusé', () => {
    it('devrait retourner 403 si aucune session active', async () => {
      // Arrange — pas de session
      mockGetServerSession.mockResolvedValue(null);

      // Act
      const req = makeGetRequest();
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });

    it('devrait retourner 403 si la session appartient à un client ordinaire', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = makeGetRequest();
      const res = await adminGetOrders(req);
      const body = await res.json();

      // Assert
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ORDER-013 : Un administrateur peut accéder au détail de n'importe quelle commande
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-ORDER-013 : détail d'une commande accessible par l'administrateur", () => {
    it('devrait retourner 200 avec les données de la commande pour un administrateur', async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);
      const paidOrder = createPaidOrder({ id: 'order-xyz' });
      prismaMock.order.findUnique.mockResolvedValue(paidOrder as never);

      // Act
      const req = makeGetRequest('http://localhost/api/admin/orders/order-xyz');
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'order-xyz' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(200);
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe('order-xyz');
    });

    it("devrait retourner 404 si la commande n'existe pas", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_ADMIN);
      prismaMock.order.findUnique.mockResolvedValue(null as never);

      // Act
      const req = makeGetRequest('http://localhost/api/admin/orders/unknown');
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'unknown' }) });
      const body = await res.json();

      // Assert
      expect(res.status).toBe(404);
      expect(body.error).toBeDefined();
    });
  });

  // ───────────────────────────────────────────────────────────────────────────
  // TC-ORDER-005 : Un client ne peut pas accéder aux commandes via la route admin
  // ───────────────────────────────────────────────────────────────────────────
  describe("TC-ORDER-005 : un client ne peut pas accéder aux commandes d'un autre utilisateur via la route admin", () => {
    it("devrait retourner 403 lorsqu'un client tente d'accéder à /api/admin/orders", async () => {
      // Arrange
      mockGetServerSession.mockResolvedValue(SESSION_CUSTOMER);

      // Act
      const req = makeGetRequest('http://localhost/api/admin/orders/other-order-id');
      const res = await adminGetOrderById(req, { params: Promise.resolve({ id: 'other-order-id' }) });
      const body = await res.json();

      // Assert — la route admin renvoie 403 pour tout rôle non-ADMIN
      expect(res.status).toBe(403);
      expect(body.error).toBeDefined();
    });
  });
});
