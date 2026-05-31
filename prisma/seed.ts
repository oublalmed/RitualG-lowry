/**
 * Prisma seed — Ritual Glowry
 *
 * Run with:  npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 * Or add to package.json:
 *   "prisma": { "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts" }
 *
 * NOTE: Run `prisma generate` before seeding to have a fully-typed client.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const prefix = "RG";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🌱 Starting seed...");

  // ── 1. Hash passwords ────────────────────────────────────────────────────

  const SALT_ROUNDS = 12;
  const [adminHash, customer1Hash, customer2Hash] = await Promise.all([
    bcrypt.hash("Admin@RitualGlowry2024!", SALT_ROUNDS) as Promise<string>,
    bcrypt.hash("Customer1@Glowry!", SALT_ROUNDS) as Promise<string>,
    bcrypt.hash("Customer2@Glowry!", SALT_ROUNDS) as Promise<string>,
  ]);

  // ── 2. Users ─────────────────────────────────────────────────────────────

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@ritualglowry.ma" },
    update: {},
    create: {
      email: "admin@ritualglowry.ma",
      name: "Fatima Admin",
      hashedPassword: adminHash,
      emailVerified: new Date(),
      role: "ADMIN",
      loyaltyPoints: 0,
      loyaltyTier: "PLATINUM",
      newsletterOptIn: true,
      lastLoginAt: new Date(),
    },
  });

  const customer1 = await prisma.user.upsert({
    where: { email: "sara.benali@example.ma" },
    update: {},
    create: {
      email: "sara.benali@example.ma",
      name: "Sara Benali",
      hashedPassword: customer1Hash,
      emailVerified: new Date(),
      role: "CUSTOMER",
      loyaltyPoints: 750,
      loyaltyTier: "SILVER",
      newsletterOptIn: true,
      lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "nadia.alaoui@example.ma" },
    update: {},
    create: {
      email: "nadia.alaoui@example.ma",
      name: "Nadia Alaoui",
      hashedPassword: customer2Hash,
      emailVerified: new Date(),
      role: "CUSTOMER",
      loyaltyPoints: 150,
      loyaltyTier: "BRONZE",
      newsletterOptIn: false,
      lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  });

  console.log(
    `✅ Created users: ${adminUser.email}, ${customer1.email}, ${customer2.email}`
  );

  // ── 3. Addresses ─────────────────────────────────────────────────────────

  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: "Domicile",
      firstName: "Sara",
      lastName: "Benali",
      line1: "12 Rue Al Majd",
      line2: "Appartement 4",
      city: "Casablanca",
      postalCode: "20000",
      country: "MA",
      isDefault: true,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer1.id,
      label: "Bureau",
      firstName: "Sara",
      lastName: "Benali",
      line1: "45 Boulevard Mohammed V",
      city: "Casablanca",
      postalCode: "20200",
      country: "MA",
      isDefault: false,
    },
  });

  const address3 = await prisma.address.create({
    data: {
      userId: customer2.id,
      label: "Domicile",
      firstName: "Nadia",
      lastName: "Alaoui",
      line1: "8 Rue Ibn Battouta",
      city: "Rabat",
      postalCode: "10000",
      country: "MA",
      isDefault: true,
    },
  });

  const address4 = await prisma.address.create({
    data: {
      userId: customer2.id,
      label: "Parent",
      firstName: "Nadia",
      lastName: "Alaoui",
      line1: "22 Avenue Hassan II",
      city: "Marrakech",
      postalCode: "40000",
      country: "MA",
      isDefault: false,
    },
  });

  await prisma.address.create({
    data: {
      userId: adminUser.id,
      label: "Bureau",
      firstName: "Fatima",
      lastName: "Admin",
      line1: "Siege Social Ritual Glowry, Technopolis",
      city: "Rabat",
      postalCode: "11100",
      country: "MA",
      isDefault: true,
    },
  });

  // suppress unused-variable lint for address2/4 (kept for realistic data variety)
  void address2;
  void address4;

  console.log(`✅ Created 5 addresses`);

  // ── 4. Orders ─────────────────────────────────────────────────────────────

  const order1 = await prisma.order.create({
    data: {
      userId: customer1.id,
      orderNumber: generateOrderNumber(),
      status: "DELIVERED",
      subtotal: 650.0,
      shipping: 0.0,
      discount: 65.0,
      tax: 0.0,
      total: 585.0,
      currency: "MAD",
      stripePaymentIntentId: "pi_test_seed_001",
      shippingAddressId: address1.id,
      billingAddressId: address1.id,
      shippingMethod: "STANDARD",
      promoCode: "BIENVENUE10",
      trackingNumber: "MA123456789",
      paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      shippedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            sanityProductId: "product-seed-extensions-01",
            sanityVariantId: "variant-seed-ext-lisse-40cm",
            productName: "Extensions Naturelles Lisse",
            variantLabel: "Lisse - 40cm - Chatain Moyen",
            quantity: 1,
            unitPrice: 450.0,
            totalPrice: 450.0,
          },
          {
            sanityProductId: "product-seed-accessoire-01",
            productName: "Kit Entretien Premium",
            quantity: 2,
            unitPrice: 100.0,
            totalPrice: 200.0,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: customer2.id,
      orderNumber: generateOrderNumber(),
      status: "PROCESSING",
      subtotal: 320.0,
      shipping: 30.0,
      discount: 0.0,
      tax: 0.0,
      total: 350.0,
      currency: "MAD",
      stripePaymentIntentId: "pi_test_seed_002",
      shippingAddressId: address3.id,
      billingAddressId: address3.id,
      shippingMethod: "STANDARD",
      paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      items: {
        create: [
          {
            sanityProductId: "product-seed-perruque-01",
            sanityVariantId: "variant-seed-perruque-bouclee-18",
            productName: "Perruque Full Lace Bouclee",
            variantLabel: "Bouclee - 18 pouces - Noir Naturel",
            quantity: 1,
            unitPrice: 320.0,
            totalPrice: 320.0,
          },
        ],
      },
    },
  });

  console.log(
    `✅ Created orders: ${order1.orderNumber}, ${order2.orderNumber}`
  );

  // ── 5. Loyalty transactions ───────────────────────────────────────────────

  await prisma.loyaltyTransaction.createMany({
    data: [
      {
        userId: customer1.id,
        type: "EARNED",
        points: 585,
        orderId: order1.id,
        description: `Points gagnes sur commande #${order1.orderNumber}`,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer1.id,
        type: "REFERRAL",
        points: 150,
        description: "Bonus parrainage - invite accepte",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        userId: customer2.id,
        type: "EARNED",
        points: 150,
        description: "Bonus inscription newsletter",
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log(`✅ Created loyalty transactions`);

  // ── 6. Wishlist items ─────────────────────────────────────────────────────

  await prisma.wishlistItem.createMany({
    data: [
      {
        userId: customer1.id,
        sanityProductId: "product-seed-perruque-01",
      },
      {
        userId: customer2.id,
        sanityProductId: "product-seed-extensions-01",
      },
      {
        userId: customer2.id,
        sanityProductId: "product-seed-accessoire-01",
      },
    ],
  });

  console.log(`✅ Created wishlist items`);

  // ── 7. Newsletter subscribers ────────────────────────────────────────────

  await prisma.newsletter.createMany({
    skipDuplicates: true,
    data: [
      { email: "sara.benali@example.ma", source: "checkout", isActive: true },
      { email: "newsletter1@example.ma", source: "popup", isActive: true },
      { email: "newsletter2@example.ma", source: "footer", isActive: true },
      { email: "newsletter3@example.ma", source: "footer", isActive: true },
      {
        email: "unsubscribed@example.ma",
        source: "popup",
        isActive: false,
        unsubscribedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log(`✅ Created newsletter subscribers`);

  // ── 8. Promo codes ────────────────────────────────────────────────────────

  await prisma.promoCode.createMany({
    skipDuplicates: true,
    data: [
      {
        code: "BIENVENUE10",
        type: "PERCENTAGE",
        value: 10,
        minAmount: 200,
        maxUses: 1000,
        currentUses: 1,
        isActive: true,
        startsAt: new Date("2024-01-01"),
        expiresAt: new Date("2025-12-31"),
      },
      {
        code: "GLOWRY50",
        type: "FIXED",
        value: 50,
        minAmount: 500,
        maxUses: 200,
        currentUses: 0,
        isActive: true,
        startsAt: new Date("2024-06-01"),
        expiresAt: new Date("2025-06-30"),
      },
      {
        code: "ETE2024",
        type: "PERCENTAGE",
        value: 15,
        minAmount: 300,
        maxUses: 500,
        currentUses: 45,
        isActive: false,
        expiresAt: new Date("2024-09-01"),
        conditions: { productTypes: ["perruque", "extensions"] },
      },
      {
        code: "VIPPLATINUM",
        type: "PERCENTAGE",
        value: 20,
        minAmount: 1000,
        maxUses: 50,
        currentUses: 3,
        isActive: true,
        conditions: { loyaltyTier: "PLATINUM" },
      },
    ],
  });

  console.log(`✅ Created promo codes`);

  // ── 9. Admin log entries ──────────────────────────────────────────────────

  await prisma.adminLog.createMany({
    data: [
      {
        adminId: adminUser.id,
        action: "CREATE",
        resourceType: "PromoCode",
        metadata: { code: "BIENVENUE10" },
        createdAt: new Date("2024-01-01"),
      },
      {
        adminId: adminUser.id,
        action: "UPDATE",
        resourceType: "Order",
        resourceId: order1.id,
        metadata: { previousStatus: "SHIPPED", newStatus: "DELIVERED" },
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log(`✅ Created admin log entries`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e: unknown) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
