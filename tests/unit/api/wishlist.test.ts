import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';

// ── Mock next-auth : session contrôlée par chaque test ──────────────────────
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// ── Mock @/lib/auth (options next-auth) ────────────────────────────────────
vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Import des handlers APRÈS les mocks (les imports hoistés par vi.mock)
import { GET, POST, DELETE } from '@/app/api/account/wishlist/route';
import { getServerSession } from 'next-auth';

// ── Helpers ──────────────────────────────────────────────────────────────────

const SESSION_USER_ID = 'user-123';

function mockAuthenticatedSession() {
  (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
    user: { id: SESSION_USER_ID, email: 'test@example.com', name: 'Test User' },
    expires: new Date(Date.now() + 3600 * 1000).toISOString(),
  });
}

function mockUnauthenticatedSession() {
  (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);
}

function makeRequest(method: string, body?: unknown, url = 'http://localhost/api/account/wishlist'): Request {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.body = JSON.stringify(body);
    init.headers = { 'Content-Type': 'application/json' };
  }
  return new Request(url, init);
}

// ── Setup ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  resetPrismaMocks();
  vi.clearAllMocks();
});

// ── Tests ────────────────────────────────────────────────────────────────────

describe("API /account/wishlist — route handler", () => {

  // TC-WISH-001
  it('devrait créer ou retrouver un article favori (upsert) et retourner 201 pour un POST valide', async () => {
    // Arrange
    mockAuthenticatedSession();
    const sanityProductId = 'sanity-prod-abc';
    const expectedItem = { id: 1, userId: SESSION_USER_ID, sanityProductId, createdAt: new Date() };
    prismaMock.wishlistItem.upsert.mockResolvedValue(expectedItem);

    const req = makeRequest('POST', { sanityProductId });

    // Act
    const res = await POST(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(201);
    expect(prismaMock.wishlistItem.upsert).toHaveBeenCalledOnce();
    expect(prismaMock.wishlistItem.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_sanityProductId: {
            userId: SESSION_USER_ID,
            sanityProductId,
          },
        },
        create: expect.objectContaining({ userId: SESSION_USER_ID, sanityProductId }),
      })
    );
    expect(json.data).toEqual(expect.objectContaining({ sanityProductId }));
  });

  // TC-WISH-002
  it("devrait appeler upsert sans erreur en cas de doublon (contrainte @@unique gérée par l'upsert)", async () => {
    // Arrange
    mockAuthenticatedSession();
    const sanityProductId = 'sanity-prod-duplicate';
    // Upsert retourne simplement l'enregistrement existant (pas d'erreur de contrainte)
    prismaMock.wishlistItem.upsert.mockResolvedValue({
      id: 99,
      userId: SESSION_USER_ID,
      sanityProductId,
      createdAt: new Date(),
    });

    const req = makeRequest('POST', { sanityProductId });

    // Act — deuxième appel simulé
    const res = await POST(req);

    // Assert — toujours 201, upsert appelé sans lever d'exception
    expect(res.status).toBe(201);
    expect(prismaMock.wishlistItem.upsert).toHaveBeenCalledOnce();
  });

  // TC-WISH-003
  it("devrait supprimer l'article favori et retourner 200 pour un DELETE avec sanityProductId valide", async () => {
    // Arrange
    mockAuthenticatedSession();
    const sanityProductId = 'sanity-prod-to-delete';
    prismaMock.wishlistItem.deleteMany.mockResolvedValue({ count: 1 });

    const req = makeRequest(
      'DELETE',
      undefined,
      `http://localhost/api/account/wishlist?sanityProductId=${sanityProductId}`
    );

    // Act
    const res = await DELETE(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(prismaMock.wishlistItem.deleteMany).toHaveBeenCalledOnce();
    expect(prismaMock.wishlistItem.deleteMany).toHaveBeenCalledWith({
      where: { userId: SESSION_USER_ID, sanityProductId },
    });
    expect(json.success).toBe(true);
  });

  // TC-WISH-004
  it("devrait retourner uniquement les articles de l'utilisateur connecté (findMany filtré par userId)", async () => {
    // Arrange
    mockAuthenticatedSession();
    const items = [
      { id: 1, userId: SESSION_USER_ID, sanityProductId: 'prod-x', createdAt: new Date() },
      { id: 2, userId: SESSION_USER_ID, sanityProductId: 'prod-y', createdAt: new Date() },
    ];
    prismaMock.wishlistItem.findMany.mockResolvedValue(items);

    const req = makeRequest('GET');

    // Act
    const res = await GET();
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(prismaMock.wishlistItem.findMany).toHaveBeenCalledOnce();
    expect(prismaMock.wishlistItem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: SESSION_USER_ID },
      })
    );
    expect(json.data).toHaveLength(2);
  });

  // TC-WISH-005
  it("devrait retourner un tableau vide lorsque l'utilisateur n'a aucun article en favoris", async () => {
    // Arrange
    mockAuthenticatedSession();
    prismaMock.wishlistItem.findMany.mockResolvedValue([]);

    // Act
    const res = await GET();
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.data).toEqual([]);
  });
});
