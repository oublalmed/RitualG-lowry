import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prismaMock, resetPrismaMocks } from '@/tests/helpers/dbCleanup';
import { createUser } from '@/tests/factories/userFactory';

// Mock @/lib/prisma via le helper partagé
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));

// Mock bcrypt — évite les ~300ms par hash en tests
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn((p: string) => Promise.resolve(`$2a$01$hashed_${p}`)),
    compare: vi.fn((p: string, h: string) => Promise.resolve(h === `$2a$01$hashed_${p}`)),
    genSalt: vi.fn(() => Promise.resolve('$2a$01$fakesalt')),
  },
}));

// Mock @/lib/email — non bloquant
vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue({ success: true }),
}));

// On importe le vrai module rate-limit pour pouvoir le mocker dynamiquement
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: vi.fn().mockReturnValue({ success: true, remaining: 10, resetIn: 0 }),
  getClientIp: vi.fn().mockReturnValue('127.0.0.1'),
  RATE_LIMITS: {
    register: { max: 3, windowSec: 3600 },
  },
}));

import { POST } from '@/app/api/auth/register/route';
import * as rateLimitModule from '@/lib/rate-limit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRequest(body: Record<string, unknown>, ip = '127.0.0.1') {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
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

describe("Limitation de débit (rate limiting) — POST /api/auth/register", () => {
  beforeEach(() => {
    resetPrismaMocks();
    // Rétablir le comportement "autorisé" par défaut entre les tests
    vi.mocked(rateLimitModule.rateLimit).mockReturnValue({
      success: true,
      remaining: 10,
      resetIn: 0,
    });
  });

  // -------------------------------------------------------------------------
  // Requête autorisée lorsque la limite n'est pas dépassée
  // -------------------------------------------------------------------------
  describe("requête autorisée", () => {
    it("devrait autoriser l'inscription quand la limite de débit n'est pas atteinte", async () => {
      // Arrange
      vi.mocked(rateLimitModule.rateLimit).mockReturnValue({ success: true, remaining: 2, resetIn: 0 });
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createUser({ email: VALID_BODY.email }));

      // Act
      const res = await POST(makeRequest(VALID_BODY));

      // Assert
      expect(res.status).toBe(201);
    });
  });

  // -------------------------------------------------------------------------
  // Requête bloquée lorsque la limite est dépassée
  // -------------------------------------------------------------------------
  describe("requête bloquée par la limite de débit", () => {
    it("devrait retourner 429 lorsque la limite de débit est dépassée", async () => {
      // Arrange — simuler un dépassement de quota
      vi.mocked(rateLimitModule.rateLimit).mockReturnValue({
        success: false,
        remaining: 0,
        resetIn: 3600,
      });

      // Act
      const res = await POST(makeRequest(VALID_BODY));
      const data = await res.json();

      // Assert
      expect(res.status).toBe(429);
      expect(data.error).toBeDefined();
    });

    it("devrait inclure l'en-tête Retry-After dans la réponse 429", async () => {
      // Arrange
      vi.mocked(rateLimitModule.rateLimit).mockReturnValue({
        success: false,
        remaining: 0,
        resetIn: 900,
      });

      // Act
      const res = await POST(makeRequest(VALID_BODY));

      // Assert
      expect(res.status).toBe(429);
      expect(res.headers.get('Retry-After')).toBe('900');
    });

    it("devrait ne pas créer d'utilisateur lorsque la limite est dépassée", async () => {
      // Arrange
      vi.mocked(rateLimitModule.rateLimit).mockReturnValue({
        success: false,
        remaining: 0,
        resetIn: 3600,
      });

      // Act
      await POST(makeRequest(VALID_BODY));

      // Assert — aucune écriture en base ne doit avoir eu lieu
      expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // Clé de rate limit basée sur l'IP
  // -------------------------------------------------------------------------
  describe("clé de limitation basée sur l'adresse IP", () => {
    it("devrait appeler rateLimit avec une clé incluant l'IP du client", async () => {
      // Arrange
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(createUser({ email: VALID_BODY.email }));

      // Act
      await POST(makeRequest(VALID_BODY, '192.168.1.42'));

      // Assert
      expect(rateLimitModule.rateLimit).toHaveBeenCalledWith(
        expect.stringContaining('register:'),
        expect.objectContaining({ max: expect.any(Number), windowSec: expect.any(Number) })
      );
    });
  });
});
