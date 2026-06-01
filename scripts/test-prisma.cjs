const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '..', 'dev.db');
const adapter = new PrismaBetterSqlite3({ url: 'file:' + dbPath });
const p = new PrismaClient({ adapter });

p.user.findMany()
  .then(r => console.log('Users:', r.length))
  .catch(e => console.error('Error:', e.message))
  .finally(() => p.$disconnect());
