// Prisma v7 configuration
// Connection URL is provided via DATABASE_URL environment variable
// For Prisma Migrate, configure the adapter in this file if using edge runtime
// See: https://www.prisma.io/docs/concepts/database-connectors

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
