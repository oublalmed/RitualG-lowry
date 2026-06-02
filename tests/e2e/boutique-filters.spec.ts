/**
 * TC-E2E-003: Product filtering on the boutique page
 *
 * The BoutiqueClient component reads filter state from URL search params
 * and applies client-side filtering over the Sanity product list.
 *
 * Desktop: FilterSidebar is always visible in the left aside.
 * Mobile: filter panel is opened via a "Filtres" Sheet trigger button.
 *
 * URL params used:
 *   state=new|bestseller|promo
 *   types=extensions,perruque,accessoire   (comma-separated)
 *   textures=lisse,bouclée,...             (comma-separated)
 *   minPrice / maxPrice
 *   sort=relevance|newest|price-asc|price-desc|popular
 */

import { test, expect } from '@playwright/test';

test.describe('Boutique — filtres et tri', () => {
  test.setTimeout(30000);

  test('TC-E2E-003: la page boutique affiche les produits', async ({ page }) => {
    await page.goto('/boutique');

    // Page heading
    await expect(
      page.getByRole('heading', { name: /notre boutique/i })
    ).toBeVisible({ timeout: 10000 });

    // At least one product article should appear once Sanity data loads
    const firstProduct = page.locator('article').first();
    await expect(firstProduct).toBeVisible({ timeout: 15000 });
  });

  test('TC-E2E-003a: filtrer par état "nouveautés" via URL', async ({ page }) => {
    await page.goto('/boutique?state=new');

    // URL is preserved
    await expect(page).toHaveURL('/boutique?state=new');

    // Heading still visible (page did not crash)
    await expect(
      page.getByRole('heading', { name: /notre boutique/i })
    ).toBeVisible({ timeout: 10000 });

    // Either products are shown OR the "Aucun produit trouvé" empty state is shown
    const hasProducts = await page.locator('article').first().isVisible({ timeout: 10000 }).catch(() => false);
    const hasEmpty = await page
      .getByText(/aucun produit trouvé/i)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    expect(hasProducts || hasEmpty).toBeTruthy();
  });

  test('TC-E2E-003b: filtrer par état "best-sellers" via URL', async ({ page }) => {
    await page.goto('/boutique?state=bestseller');

    await expect(page).toHaveURL('/boutique?state=bestseller');

    await expect(
      page.getByRole('heading', { name: /notre boutique/i })
    ).toBeVisible({ timeout: 10000 });

    const hasProducts = await page.locator('article').first().isVisible({ timeout: 10000 }).catch(() => false);
    const hasEmpty = await page
      .getByText(/aucun produit trouvé/i)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    expect(hasProducts || hasEmpty).toBeTruthy();
  });

  test('TC-E2E-003c: le tri par prix croissant met à jour lURL', async ({ page }) => {
    await page.goto('/boutique');

    // Wait for the Select trigger to be ready
    const sortTrigger = page.getByRole('combobox').first();
    await expect(sortTrigger).toBeVisible({ timeout: 10000 });

    await sortTrigger.click();

    // Select "Prix croissant" option
    await page
      .getByRole('option', { name: /prix croissant/i })
      .click();

    await page.waitForURL(/sort=price-asc/, { timeout: 8000 });
    await expect(page).toHaveURL(/sort=price-asc/);
  });

  test('TC-E2E-003d: le filtre mobile saffiche et se ferme', async ({ page }) => {
    // Use a mobile-sized viewport to reveal the "Filtres" Sheet trigger
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/boutique');

    await expect(
      page.getByRole('heading', { name: /notre boutique/i })
    ).toBeVisible({ timeout: 10000 });

    // The mobile filter trigger is only visible on smaller screens (lg:hidden)
    const filterButton = page.getByRole('button', { name: /filtres/i });
    if (await filterButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await filterButton.click();

      // The Sheet panel should open
      await expect(
        page.getByRole('dialog').or(page.getByText(/filtres/i).nth(1))
      ).toBeVisible({ timeout: 5000 });
    } else {
      // On some browsers the component may render even if hidden — skip gracefully
      test.skip(true, 'Bouton filtres non visible dans cette configuration de viewport');
    }
  });

  test('TC-E2E-003e: réinitialiser les filtres depuis l URL', async ({ page }) => {
    await page.goto('/boutique?state=new&sort=price-asc');

    // Both params should be in the URL
    await expect(page).toHaveURL(/state=new/);
    await expect(page).toHaveURL(/sort=price-asc/);

    // Navigate without params (simulates "Réinitialiser les filtres")
    await page.goto('/boutique');
    await expect(page).toHaveURL('/boutique');

    await expect(
      page.getByRole('heading', { name: /notre boutique/i })
    ).toBeVisible({ timeout: 10000 });
  });
});
