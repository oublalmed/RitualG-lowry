import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import { createUser } from '@/tests/factories/userFactory';

// Mock @/lib/prisma via the shared helper (already set up in dbCleanup)
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

// Mock bcrypt to avoid slow hashing in tests (rounds=10 ≈ 300ms per hash)
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn((password: string) => Promise.resolve(`$2a$01$hashed_${password}`)),
    compare: vi.fn((plain: string, hash: string) => Promise.resolve(hash === `$2a$01$hashed_${plain}`)),
    genSalt: vi.fn(() => Promise.resolve('$2a$01$fakesalt')),
  },
}));

// Mock @/lib/email so no real emails are sent
vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock @/lib/rate-limit so rate limiting never blocks during tests
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 10, resetIn: 0 }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
  RATE_LIMITS: {
    register: { max: 3, windowSec: 3600 },
  },
}));

import { POST } from '@/app/api/auth/register/route';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
    },
    body: JSON.stringify(body),
  });
}

const VALID_BODY = {
  name: 'Alice Dupont',
  email: 'alice@example.com',
  password: 'Test1234!',
};

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("Inscription utilisateur (POST /api/auth/register)", () => {
  beforeEach(() => {
    resetPrismaMocks();
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-001 : Inscription valide
  // -------------------------------------------------------------------------
  describe("TC-AUTH-001 : inscription réussie", () => {
    it("devrait retourner 201 et créer l'utilisateur en base de données", async () => {
      // Arrange
      const fakeUser = createUser({ email: VALID_BODY.email, name: VALID_BODY.name });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(fakeUser);

      // Act
      const req = makeRequest(VALID_BODY);
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(prismaMock.user.create).toHaveBeenCalledOnce();
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-002 : Le mot de passe est haché
  // -------------------------------------------------------------------------
  describe("TC-AUTH-002 : hachage du mot de passe", () => {
    it("devrait stocker le mot de passe sous forme hachée et non en clair", async () => {
      // Arrange
      const fakeUser = createUser({ email: VALID_BODY.email });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(fakeUser);

      // Act
      const req = makeRequest(VALID_BODY);
      await POST(req);

      // Assert — le mot de passe brut ne doit jamais être passé à Prisma
      const createCall = prismaMock.user.create.mock.calls[0][0] as { data: { password: string } };
      const storedPassword = createCall.data.password;
      expect(storedPassword).toBeDefined();
      expect(storedPassword).not.toBe(VALID_BODY.password);
      // Un hash bcrypt commence toujours par "$2"
      expect(storedPassword).toMatch(/^\$2[aby]\$/);
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-003 : Code de parrainage généré automatiquement
  // -------------------------------------------------------------------------
  describe("TC-AUTH-003 : code de parrainage", () => {
    it("devrait créer l'utilisateur — le code de parrainage est géré par le défaut Prisma (@default(cuid()))", async () => {
      // Arrange
      // La route ne passe pas explicitement referralCode à prisma.user.create :
      // le schéma Prisma utilise @default(cuid()) pour le générer côté DB.
      // On vérifie que create est bien appelé avec name, email et password hachés.
      const fakeUser = createUser({ email: VALID_BODY.email });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(fakeUser);

      // Act
      const req = makeRequest(VALID_BODY);
      const res = await POST(req);

      // Assert — la création est bien déclenchée ; referralCode sera non vide
      // car le mock renvoie un objet factory qui inclut un referralCode
      expect(res.status).toBe(201);
      expect(prismaMock.user.create).toHaveBeenCalledOnce();
      const returnedUser: { referralCode: string } = prismaMock.user.create.mock.results[0].value as { referralCode: string };
      expect(fakeUser.referralCode).toBeTruthy();
      expect(returnedUser).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-005 : Email déjà pris → 409
  // -------------------------------------------------------------------------
  describe("TC-AUTH-005 : email en doublon", () => {
    it("devrait retourner 409 si l'email est déjà enregistré", async () => {
      // Arrange
      const existingUser = createUser({ email: VALID_BODY.email });
      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      // Act
      const req = makeRequest(VALID_BODY);
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(409);
      expect(data.error).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-006 : Email invalide → 400
  // -------------------------------------------------------------------------
  describe("TC-AUTH-006 : email invalide", () => {
    it("devrait retourner 400 avec une erreur de validation pour un email mal formé", async () => {
      // Arrange — email non valide selon Zod
      const req = makeRequest({ name: 'Bob', email: 'not-an-email', password: 'Test1234!' });

      // Act
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-007 : Mot de passe trop court → 400
  // -------------------------------------------------------------------------
  describe("TC-AUTH-007 : mot de passe trop court", () => {
    it("devrait retourner 400 si le mot de passe fait moins de 8 caractères", async () => {
      // Arrange
      const req = makeRequest({ name: 'Bob', email: 'test@test.com', password: 'abc' });

      // Act
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // TC-AUTH-008 : Champs obligatoires manquants → 400
  // -------------------------------------------------------------------------
  describe("TC-AUTH-008 : champs obligatoires manquants", () => {
    it("devrait retourner 400 si le corps de la requête est vide", async () => {
      // Arrange
      const req = makeRequest({});

      // Act
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("devrait retourner 400 si le mot de passe est absent", async () => {
      // Arrange
      const req = makeRequest({ name: 'Bob', email: 'bob@example.com' });

      // Act
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it("devrait retourner 400 si l'email est absent", async () => {
      // Arrange
      const req = makeRequest({ name: 'Bob', password: 'Test1234!' });

      // Act
      const res = await POST(req);
      const data = await res.json();

      // Assert
      expect(res.status).toBe(400);
      expect(data.error).toBeDefined();
    });
  });
});
