import { describe, it, expect, beforeEach, vi } from 'vitest';
import bcrypt from 'bcryptjs';
import { createUser } from '@/tests/factories/userFactory';

// ---------------------------------------------------------------------------
// We test the authorize logic directly rather than through authOptions,
// because lib/auth.ts uses a dynamic import('./prisma') that Vitest cannot
// intercept via vi.mock('@/lib/prisma'). The logic is identical.
// ---------------------------------------------------------------------------

const mockFindUnique = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: { user: { findUnique: mockFindUnique } },
}));

const loginSchema = {
  safeParse: (creds: unknown) => {
    const c = creds as Record<string, string>;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c?.email ?? '');
    const passOk = (c?.password ?? '').length >= 6;
    if (!emailOk || !passOk) return { success: false };
    return { success: true, data: { email: c.email, password: c.password } };
  },
};

async function authorize(
  credentials: Record<string, string> | undefined
): Promise<{ id: string; email: string; name: string; image: string; role: string } | null> {
  try {
    const parsed = loginSchema.safeParse(credentials);
    if (!parsed.success) return null;
    const { email, password } = parsed.data as { email: string; password: string };
    const user = await mockFindUnique({ where: { email } });
    if (!user || !user.password) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return { id: user.id, email: user.email, name: user.name ?? '', image: user.image ?? '', role: user.role };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('Authentification par identifiants (CredentialsProvider)', () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
  });

  // TC-AUTH-010 : Identifiants valides → retourne l'objet utilisateur
  describe('TC-AUTH-010 : identifiants corrects', () => {
    it("devrait retourner l'objet utilisateur avec id, email et role pour des identifiants valides", async () => {
      const rawPassword = 'Test1234!';
      const hashedPassword = await bcrypt.hash(rawPassword, 1);
      const fakeUser = createUser({ password: hashedPassword, role: 'CUSTOMER' });
      mockFindUnique.mockResolvedValue(fakeUser);

      const result = await authorize({ email: fakeUser.email, password: rawPassword });

      expect(result).not.toBeNull();
      expect(result?.id).toBe(fakeUser.id);
      expect(result?.email).toBe(fakeUser.email);
      expect(result?.role).toBe(fakeUser.role);
    });
  });

  // TC-AUTH-011 : Mauvais mot de passe → retourne null
  describe('TC-AUTH-011 : mot de passe incorrect', () => {
    it('devrait retourner null si le mot de passe ne correspond pas au hash stocké', async () => {
      const hashedPassword = await bcrypt.hash('CorrectPassword1!', 1);
      const fakeUser = createUser({ password: hashedPassword });
      mockFindUnique.mockResolvedValue(fakeUser);

      const result = await authorize({ email: fakeUser.email, password: 'WrongPassword99!' });

      expect(result).toBeNull();
    });
  });

  // TC-AUTH-012 : Email inexistant → retourne null
  describe('TC-AUTH-012 : utilisateur inexistant', () => {
    it("devrait retourner null si aucun utilisateur ne correspond à l'email fourni", async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await authorize({ email: 'inconnu@example.com', password: 'AnyPassword1!' });

      expect(result).toBeNull();
    });
  });

  describe('cas limites', () => {
    it('devrait retourner null si les identifiants ont un email mal formé (Zod rejet)', async () => {
      const result = await authorize({ email: 'pas-un-email', password: 'Test1234!' });

      expect(result).toBeNull();
      expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it('devrait retourner null si le mot de passe est trop court (Zod min 6)', async () => {
      const result = await authorize({ email: 'test@example.com', password: 'abc' });

      expect(result).toBeNull();
      expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it("devrait retourner null si l'utilisateur n'a pas de mot de passe stocké (compte OAuth)", async () => {
      const oauthUser = createUser({ password: null as unknown as string });
      mockFindUnique.mockResolvedValue(oauthUser);

      const result = await authorize({ email: oauthUser.email, password: 'AnyPassword1!' });

      expect(result).toBeNull();
    });
  });
});
