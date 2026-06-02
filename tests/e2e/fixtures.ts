/**
 * Shared test data constants for E2E tests.
 * Users and promo codes match the seed data in scripts/seed-data.ndjson.
 */

export const TEST_USERS = {
  customer: { email: 'sara.benali@example.ma', password: 'Password123!' },
  admin: { email: 'admin@ritualglowry.ma', password: 'Admin1234!' },
};

/**
 * WELCOME15 is the active promo from seed data (15% off, min 500 MAD).
 * ETE2026 is the summer promo (20% off, min 800 MAD, active Jun–Aug 2026).
 */
export const TEST_PROMO = { code: 'WELCOME15', discount: 15 };

export const TEST_CARD = {
  number: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123',
};

/** Known product slugs from seed data — used to navigate directly to product pages. */
export const PRODUCT_SLUGS = {
  extensionLisse: 'extension-lisse-naturelle',
  extensionBouclee: 'extension-bouclee-sublime',
  perruqueLaceFront: 'perruque-lace-front',
  bonnetSatin: 'bonnet-satin-premium',
} as const;
