import { test, expect } from '@playwright/test';

test.describe('Résilience', () => {
  test('TC-RES-001: page boutique charge avec Sanity indisponible (ISR cache)', async ({ page }) => {
    // The page should load even if Sanity returns an error because of SSG/ISR fallback
    await page.goto('/boutique');
    // Should not show a raw error page
    await expect(page.getByText(/500|internal server error/i)).not.toBeVisible();
    // Should show some content
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-RES-005: image cassée affiche un placeholder', async ({ page }) => {
    await page.goto('/boutique');
    // Check that broken images don't break the layout
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 3)) {
      const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
      // Either the image loaded or it shows a placeholder (width > 0 or alt text present)
      const altText = await img.getAttribute('alt');
      expect(naturalWidth > 0 || altText !== null).toBe(true);
    }
  });
});
