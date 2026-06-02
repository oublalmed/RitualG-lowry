import { vi } from 'vitest';

// Mock prisma for unit/integration tests — no real DB calls
export const prismaMock = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    deleteMany: vi.fn(),
    count: vi.fn(),
    upsert: vi.fn(),
  },
  order: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
    groupBy: vi.fn(),
  },
  orderItem: {
    create: vi.fn(),
    findMany: vi.fn(),
    createMany: vi.fn(),
    groupBy: vi.fn(),
  },
  address: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    delete: vi.fn(),
  },
  wishlistItem: {
    upsert: vi.fn(),
    findMany: vi.fn(),
    deleteMany: vi.fn(),
    create: vi.fn(),
    findUnique: vi.fn(),
  },
  review: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    aggregate: vi.fn(),
  },
  promoCode: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  loyaltyTransaction: {
    create: vi.fn(),
    findMany: vi.fn(),
    aggregate: vi.fn(),
  },
  newsletter: {
    upsert: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    count: vi.fn(),
  },
  adminLog: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  $transaction: vi.fn(async (fn: (tx: typeof prismaMock) => Promise<unknown>) => fn(prismaMock)),
  $disconnect: vi.fn(),
};

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

const ARRAY_METHODS = new Set(['findMany', 'groupBy']);
const COUNT_METHODS = new Set(['count']);
const AGGREGATE_METHODS = new Set(['aggregate']);

export function resetPrismaMocks() {
  Object.values(prismaMock).forEach((model) => {
    if (typeof model === 'object' && model !== null) {
      Object.entries(model).forEach(([name, fn]) => {
        if (typeof fn === 'function' && 'mockResolvedValue' in fn) {
          const mock = fn as ReturnType<typeof vi.fn>;
          if (ARRAY_METHODS.has(name)) {
            mock.mockResolvedValue([]);
          } else if (COUNT_METHODS.has(name)) {
            mock.mockResolvedValue(0);
          } else if (AGGREGATE_METHODS.has(name)) {
            mock.mockResolvedValue({ _sum: {}, _count: {}, _avg: {} });
          } else {
            mock.mockResolvedValue(undefined);
          }
        }
      });
    }
  });
}
