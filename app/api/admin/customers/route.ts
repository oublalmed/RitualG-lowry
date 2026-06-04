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

    // Compute total spent per customer (include guest orders matched by email)
    const customerIds = customers.map((c) => c.id);
    const customerEmails = customers.map((c) => c.email);

    const allOrders = await prisma.order.findMany({
      where: {
        status: { in: ['PAID', 'DELIVERED', 'PROCESSING', 'SHIPPED'] },
        OR: [
          { userId: { in: customerIds } },
          { guestEmail: { in: customerEmails } },
        ],
      },
      select: { userId: true, guestEmail: true, total: true },
    });

    // Build maps by userId and by email
    const spentMap: Record<string, number> = {};
    const orderCountMap: Record<string, number> = {};

    for (const order of allOrders) {
      const key = order.userId ?? customers.find((c) => c.email === order.guestEmail)?.id;
      if (!key) continue;
      spentMap[key] = (spentMap[key] ?? 0) + Math.round(Number(order.total ?? 0));
      orderCountMap[key] = (orderCountMap[key] ?? 0) + 1;
    }

    const data = customers.map((c) => ({
      ...c,
      totalOrders: orderCountMap[c.id] ?? c._count.orders,
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
