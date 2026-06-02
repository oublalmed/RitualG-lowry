import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    const where: Record<string, unknown> = { role: 'CUSTOMER' };

    if (search) {
      where.OR = [
        { email: { contains: search } },
        { name: { contains: search } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          loyaltyPoints: true,
          loyaltyTier: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Compute total spent per customer
    const customerIds = customers.map((c) => c.id);
    const spentAgg = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        userId: { in: customerIds },
        status: { in: ['PAID', 'DELIVERED'] },
      },
      _sum: { total: true },
    });

    const spentMap: Record<string, number> = {};
    for (const row of spentAgg) {
      if (row.userId) {
        spentMap[row.userId] = Math.round(Number(row._sum.total ?? 0));
      }
    }

    const data = customers.map((c) => ({
      ...c,
      totalOrders: c._count.orders,
      totalSpent: spentMap[c.id] ?? 0,
    }));

    return NextResponse.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('[admin/customers]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
