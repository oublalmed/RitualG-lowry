import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";

  // Production: Turso / libsql (url starts with libsql:// or https://)
  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    const client = createClient({
      url,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    return new PrismaClient({
      adapter: new PrismaLibSql(client),
      log: ["error"],
    });
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
