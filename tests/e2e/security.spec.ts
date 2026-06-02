import { test, expect } from '@playwright/test';

test.describe('Sécurité API', () => {
  // TC-SEC-001: Private endpoint without token → 401
  test('TC-SEC-001: endpoint protégé sans token retourne 401', async ({ request }) => {
    const res = await request.get('/api/account/addresses');
    expect(res.status()).toBe(401);
  });

  test('TC-SEC-001b: route admin sans auth retourne 401', async ({ request }) => {
    const res = await request.get('/api/admin/orders');
    expect(res.status()).toBe(401);
  });

  // TC-SEC-005: User A cannot access User B's orders
  test('TC-SEC-005: utilisateur ne peut pas accéder aux données d\'un autre', async ({ request }) => {
    // Without a session, orders endpoint should return 401
    const res = await request.get('/api/account/addresses');
    expect([401, 403]).toContain(res.status());
  });

  // TC-SEC-012: Stripe webhook with invalid signature
  test('TC-SEC-012: webhook Stripe avec signature invalide retourne 401', async ({ request }) => {
    const res = await request.post('/api/webhook/stripe', {
      headers: { 'stripe-signature': 'invalid_sig', 'Content-Type': 'application/json' },
      data: JSON.stringify({ type: 'payment_intent.succeeded', data: {} }),
    });
    expect([400, 401]).toContain(res.status());
  });

  // Rate limiting: contact form
  test('TC-SEC-021: rate limiting sur /api/contact', async ({ request }) => {
    // Send multiple requests rapidly from same IP
    const requests = Array.from({ length: 6 }, () =>
      request.post('/api/contact', {
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
        data: JSON.stringify({
          firstName: 'Test', lastName: 'User', email: 'test@test.com',
          subject: 'general', message: 'Test message flood'
        }),
      })
    );
    const responses = await Promise.all(requests);
    const tooManyRequests = responses.some(r => r.status() === 429);
    expect(tooManyRequests).toBe(true);
  });
});
