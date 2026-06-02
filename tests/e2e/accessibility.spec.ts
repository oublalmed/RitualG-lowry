import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibilité WCAG 2.1 AA', () => {
  test('TC-A11Y-001: page accueil sans violations critiques', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')).toHaveLength(0);
  });

  test('TC-A11Y-001b: page boutique sans violations critiques', async ({ page }) => {
    await page.goto('/boutique');
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude(['[data-nextjs-scroll-focus-boundary]'])
      .analyze();
    const serious = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(serious).toHaveLength(0);
  });

  test('TC-A11Y-004: navigation au clavier sur la page accueil', async ({ page }) => {
    await page.goto('/');
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(['A', 'BUTTON', 'INPUT']).toContain(focused);
  });

  test('TC-A11Y-009: modal se ferme avec Escape', async ({ page }) => {
    await page.goto('/boutique');
    // Try to open search modal
    const searchTrigger = page.getByRole('button', { name: /recherche|search/i });
    if (await searchTrigger.isVisible()) {
      await searchTrigger.click();
      await page.keyboard.press('Escape');
      // Modal should be closed
      await expect(page.getByRole('dialog')).not.toBeVisible();
    } else {
      test.skip();
    }
  });
});
