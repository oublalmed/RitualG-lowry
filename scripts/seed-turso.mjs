import { createClient } from '@libsql/client';
import { createId } from '@paralleldrive/cuid2';
import bcrypt from 'bcryptjs';

const TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA1OTIzNzksImlkIjoiMDE5ZTkzOTAtM2EwMS03NTQ0LTgxZjUtZGMyZmM3NWI3YzFiIiwicmlkIjoiNzI2ZTVhNzktMjI2My00OWViLTlmOGEtODEwODA4MGM2NzYwIn0.HIvVIlCGdiRc3eElk5IH3OHmW6Aguh4LS_Jq3UBsJ69NNFr9-TdN8_HcVr4XEoIvyR6T_90pss7Byb6aD2ePDw';
const DB_URL = 'libsql://ritual-glowry-meedoublal.aws-eu-west-1.turso.io';

const client = createClient({ url: DB_URL, authToken: TOKEN });

const now = new Date().toISOString();
const SALT = 12;

console.log('🌱 Seeding Turso production database...\n');

// ── 1. Users ─────────────────────────────────────────────────────────────────
const adminHash = await bcrypt.hash('Admin@RitualGlowry2024!', SALT);
const customerHash = await bcrypt.hash('Customer1@Glowry!', SALT);

const adminId = 'admin-ritual-glowry-001';
const customer1Id = 'customer-sara-001';
const customer2Id = 'customer-nadia-001';

await client.execute({
  sql: `INSERT OR IGNORE INTO User (id, email, name, password, role, loyaltyPoints, loyaltyTier, referralCode, newsletterOptIn, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, 'ADMIN', 0, 'BRONZE', ?, 0, ?, ?)`,
  args: [adminId, 'admin@ritualglowry.ma', 'Fatima Admin', adminHash, 'REF-ADMIN-001', now, now],
});

await client.execute({
  sql: `INSERT OR IGNORE INTO User (id, email, name, password, role, loyaltyPoints, loyaltyTier, referralCode, newsletterOptIn, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, 'CUSTOMER', 500, 'SILVER', ?, 1, ?, ?)`,
  args: [customer1Id, 'sara.benali@example.ma', 'Sara Benali', customerHash, 'REF-SARA-001', now, now],
});

await client.execute({
  sql: `INSERT OR IGNORE INTO User (id, email, name, password, role, loyaltyPoints, loyaltyTier, referralCode, newsletterOptIn, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, 'CUSTOMER', 120, 'BRONZE', ?, 0, ?, ?)`,
  args: [customer2Id, 'nadia.alaoui@example.ma', 'Nadia Alaoui', customerHash, 'REF-NADIA-001', now, now],
});

console.log('✅ Users created: admin@ritualglowry.ma, sara.benali@example.ma, nadia.alaoui@example.ma');

// ── 2. Promo codes ────────────────────────────────────────────────────────────
const promos = [
  { id: 'promo-welcome-001', code: 'BIENVENUE15', type: 'PERCENTAGE', value: 15, minAmount: 500, maxUses: 1000, isActive: 1 },
  { id: 'promo-vip-001',     code: 'VIP50',       type: 'FIXED',      value: 50, minAmount: 800, maxUses: 500,  isActive: 1 },
  { id: 'promo-glowry-001',  code: 'GLOWRY10',    type: 'PERCENTAGE', value: 10, minAmount: 300, maxUses: 2000, isActive: 1 },
  { id: 'promo-luxe-001',    code: 'LUXE200',      type: 'FIXED',      value: 200, minAmount: 1000, maxUses: 200, isActive: 1 },
];

for (const p of promos) {
  await client.execute({
    sql: `INSERT OR IGNORE INTO PromoCode (id, code, type, value, minAmount, maxUses, currentUses, isActive, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    args: [p.id, p.code, p.type, p.value, p.minAmount, p.maxUses, p.isActive, now],
  });
}
console.log('✅ Promo codes: BIENVENUE15, VIP50, GLOWRY10, LUXE200');

// ── 3. Newsletter subscribers ─────────────────────────────────────────────────
await client.execute({
  sql: `INSERT OR IGNORE INTO Newsletter (id, email, source, isActive, createdAt)
        VALUES (?, ?, 'homepage', 1, ?)`,
  args: ['nl-sara-001', 'sara.benali@example.ma', now],
});
console.log('✅ Newsletter subscriber added');

// ── 4. Admin log ──────────────────────────────────────────────────────────────
await client.execute({
  sql: `INSERT OR IGNORE INTO AdminLog (id, adminId, action, resourceType, createdAt)
        VALUES (?, ?, 'SYSTEM_INIT', 'DATABASE', ?)`,
  args: ['log-init-001', adminId, now],
});

// ── 5. Verify ─────────────────────────────────────────────────────────────────
const users = await client.execute('SELECT email, role, loyaltyPoints FROM User');
const promoCount = await client.execute('SELECT COUNT(*) as n FROM PromoCode');

console.log('\n📊 Database summary:');
console.log('  Users:', users.rows.length);
users.rows.forEach(u => console.log(`    - ${u.email} (${u.role}, ${u.loyaltyPoints} pts)`));
console.log('  Promo codes:', promoCount.rows[0].n);
console.log('\n🎉 Turso production database ready!');
