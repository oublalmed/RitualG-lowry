/**
 * TC-E2E-001: Guest purchase happy path
 *
 * Covers the full funnel: boutique → product page → add to cart →
 * checkout identification (guest mode) → shipping form → payment step.
 * The payment step itself is skipped when Stripe keys are absent.
 */

import { test, expect } from '@playwright/test';
import { PRODUCT_SLUGS } from './fixtures';

test.describe('Achat invité', () => {
  test.setTimeout(45000);

  test('TC-E2E-001: une visiteuse achète un produit sans créer de compte', async ({ page }) => {
    // ── 1. Navigate to boutique ──────────────────────────────────────────────
    await page.goto('/boutique');

    // Wait for at least one product to be visible
    const productArticle = page
      .locator('article')
      .first();
    await expect(productArticle).toBeVisible({ timeout: 15000 });

    // ── 2. Navigate to a known product page ─────────────────────────────────
    // Direct navigation is more reliable than clicking when Sanity may not be seeded.
    await page.goto(`/produit/${PRODUCT_SLUGS.extensionLisse}`);
    await expect(page).toHaveURL(/\/produit\//);

    // ── 3. Select a variant if present ──────────────────────────────────────
    // Variant buttons are rendered as role=radio or labelled buttons on the product page.
    const variantButton = page
      .locator('[data-testid="variant-button"], [role="radio"]')
      .first();
    if (await variantButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await variantButton.click();
    }

    // ── 4. Add to cart ───────────────────────────────────────────────────────
    await page
      .getByRole('button', { name: /ajouter au panier/i })
      .click();

    // Cart drawer / dialog should open
    await expect(
      page.getByRole('dialog').or(page.locator('[data-testid="cart-drawer"]'))
    ).toBeVisible({ timeout: 8000 });

    // ── 5. Go to checkout ────────────────────────────────────────────────────
    await page
      .getByRole('link', { name: /passer commande|commander|voir mon panier/i })
      .first()
      .click();

    // Allow a redirect via cart page or straight to checkout
    await page.waitForURL(/\/(checkout|panier)/, { timeout: 10000 });

    // If we land on a cart page, click checkout from there
    if (page.url().includes('/panier')) {
      await page
        .getByRole('link', { name: /passer commande|finaliser/i })
        .click();
      await page.waitForURL(/\/checkout/, { timeout: 10000 });
    }

    await expect(page).toHaveURL(/\/checkout/);

    // ── 6. Identification step — guest mode ──────────────────────────────────
    // The checkout renders three mode tabs: "J'ai un compte" / "Invité" / "Créer un compte".
    // Default is "Invité" so the email field should already be visible.
    // If there are mode tabs, ensure "Invité" is selected.
    const inviteTab = page.getByRole('button', { name: /invité/i });
    if (await inviteTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await inviteTab.click();
    }

    await page.getByLabel(/email/i).fill('test.guest@example.com');

    // Click the "Continuer" button for step 1
    await page
      .getByRole('button', { name: /continuer/i })
      .click();

    // ── 7. Shipping form ─────────────────────────────────────────────────────
    // Wait for the shipping step to appear (looks for "Prénom" label)
    await expect(
      page.getByText(/prénom|livraison/i).first()
    ).toBeVisible({ timeout: 8000 });

    // Fill the required shipping fields by their visible labels (uppercase in UI)
    await page.getByLabel(/prénom/i).fill('Fatima');
    await page.getByLabel(/^nom\s*\*/i).fill('Alami');
    await page.getByLabel(/téléphone/i).fill('+212 6 00 00 00 00');
    await page.getByLabel(/^adresse\s*\*/i).fill('123 Rue Mohammed V');
    await page.getByLabel(/ville/i).fill('Casablanca');
    await page.getByLabel(/code postal/i).fill('20000');

    // Country defaults to "Maroc" — leave as-is.

    // ── 8. Continue to payment step ──────────────────────────────────────────
    await page
      .getByRole('button', { name: /continuer/i })
      .click();

    // ── 9. Assert payment step is visible ────────────────────────────────────
    // The payment step shows "Paiement" in the progress bar and either
    // the Stripe PaymentElement or a "Mode démo" notice when no Stripe key is set.
    await expect(
      page.getByText(/paiement|mode démo|stripe non configuré/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Skip actual payment — Stripe live keys are not available in test environment.
    test.info().annotations.push({
      type: 'note',
      description: 'Paiement Stripe ignoré : clés non configurées en environnement de test.',
    });
  });
});
