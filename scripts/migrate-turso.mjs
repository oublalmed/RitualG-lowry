import { createClient } from '@libsql/client';
import { readFileSync } from 'fs';

const TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODA1OTIzNzksImlkIjoiMDE5ZTkzOTAtM2EwMS03NTQ0LTgxZjUtZGMyZmM3NWI3YzFiIiwicmlkIjoiNzI2ZTVhNzktMjI2My00OWViLTlmOGEtODEwODA4MGM2NzYwIn0.HIvVIlCGdiRc3eElk5IH3OHmW6Aguh4LS_Jq3UBsJ69NNFr9-TdN8_HcVr4XEoIvyR6T_90pss7Byb6aD2ePDw';
const DB_URL = 'libsql://ritual-glowry-meedoublal.aws-eu-west-1.turso.io';

const client = createClient({ url: DB_URL, authToken: TOKEN });

const sql = readFileSync('prisma/migrations/20260601191158_init/migration.sql', 'utf-8');
const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);

let ok = 0, skip = 0, failed = 0;
for (const stmt of statements) {
  try {
    await client.execute(stmt + ';');
    ok++;
  } catch (e) {
    if (e.message.includes('already exists')) {
      skip++;
    } else {
      console.error('FAILED:', stmt.substring(0, 60), '->', e.message);
      failed++;
    }
  }
}

console.log(`\n✅ Migration complete: ${ok} applied, ${skip} already existed, ${failed} failed`);

// Verify tables
const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;");
console.log('Tables in Turso:', tables.rows.map(r => r.name).join(', '));
