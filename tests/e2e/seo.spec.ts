import { test, expect } from '@playwright/test';

test.describe('SEO', () => {
  test('TC-SEO-001: sitemap.xml accessible', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<urlset');
  });

  test('TC-SEO-003: page accueil a un meta title', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
  });

  test('TC-SEO-003b: page boutique a un title unique', async ({ page }) => {
    await page.goto('/boutique');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
  });

  test('TC-SEO-004: meta description présente sur la page accueil', async ({ page }) => {
    await page.goto('/');
    const metaDesc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDesc).toBeTruthy();
    expect(metaDesc!.length).toBeLessThanOrEqual(160);
  });

  test('TC-SEO-006: Open Graph image configurée', async ({ page }) => {
    await page.goto('/');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('TC-SEO-009: page FAQ a Schema.org FAQPage', async ({ page }) => {
    await page.goto('/faq');
    const schema = await page.locator('script[type="application/ld+json"]').textContent();
    if (schema) {
      const parsed = JSON.parse(schema);
      const types = Array.isArray(parsed) ? parsed.map(s => s['@type']) : [parsed['@type']];
      expect(types.some((t: string) => t === 'FAQPage' || t?.includes('FAQ'))).toBe(true);
    }
  });
});
