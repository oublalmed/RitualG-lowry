import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MOCK_ORDERS = [
  { id: '1', orderNumber: '#2025-089', status: 'DELIVERED', total: 1890, createdAt: new Date('2025-03-31'), guestEmail: null, userId: 'mock-1' },
  { id: '2', orderNumber: '#2025-090', status: 'SHIPPED', total: 950, createdAt: new Date('2025-03-31'), guestEmail: null, userId: 'mock-2' },
  { id: '3', orderNumber: '#2025-091', status: 'PROCESSING', total: 1450, createdAt: new Date('2025-03-31'), guestEmail: null, userId: 'mock-3' },
];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '20');

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { guestEmail: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { user: { select: { name: true, email: true } }, items: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]).catch(() => [MOCK_ORDERS, MOCK_ORDERS.length] as const);

    return NextResponse.json({ data: orders, total, page, limit, totalPages: Math.ceil(Number(total) / limit) });
  } catch {
    return NextResponse.json({ data: MOCK_ORDERS, total: MOCK_ORDERS.length });
  }
}
