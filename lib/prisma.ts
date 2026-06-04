import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  // Production: Turso / libsql — PrismaLibSql takes config directly
  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    const adapter = new PrismaLibSql({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter, log: ["error"] });
  }

  // Development: local SQLite file
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const dbPath = url.startsWith("file:")
    ? path.resolve(url.replace("file:", "").replace("./", ""))
    : path.resolve(process.cwd(), "dev.db");
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: `file:${dbPath}` }),
    log: ["error", "warn"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
