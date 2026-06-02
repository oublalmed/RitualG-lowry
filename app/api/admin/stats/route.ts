import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalRevenueAgg,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      totalCustomers,
      newCustomers,
      recentOrdersRaw,
      allPaidOrdersSince,
      topProductsRaw,
    ] = await Promise.all([
      // Total revenue from completed orders
      prisma.order.aggregate({
        where: { status: { in: ['PAID', 'DELIVERED'] } },
        _sum: { total: true },
      }),
      // Total orders count
      prisma.order.count(),
      // Pending orders count
      prisma.order.count({ where: { status: 'PENDING' } }),
      // Processing orders count
      prisma.order.count({ where: { status: 'PROCESSING' } }),
      // Shipped orders count
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      // Total customers
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // New customers this month
      prisma.user.count({
        where: { role: 'CUSTOMER', createdAt: { gte: startOfMonth } },
      }),
      // Recent 5 orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      // Paid/delivered orders in last 6 months for monthly breakdown
      prisma.order.findMany({
        where: {
          status: { in: ['PAID', 'DELIVERED'] },
          createdAt: { gte: sixMonthsAgo },
        },
        select: { total: true, createdAt: true },
      }),
      // Top products by revenue
      prisma.orderItem.groupBy({
        by: ['sanityProductId', 'productName'],
        _sum: { totalPrice: true, quantity: true },
        orderBy: { _sum: { totalPrice: 'desc' } },
        take: 10,
      }),
    ]);

    // Build monthly revenue for last 6 months
    const monthlyMap: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyMap[key] = 0;
    }

    for (const order of allPaidOrdersSince) {
      const d = order.createdAt;
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (key in monthlyMap) {
        monthlyMap[key] += Number(order.total);
      }
    }

    const monthly = Object.entries(monthlyMap).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return { month: MONTH_NAMES[month], year, value: Math.round(value) };
    });

    const topProducts = topProductsRaw.map((p) => ({
      sanityProductId: p.sanityProductId,
      name: p.productName,
      revenue: Math.round(Number(p._sum.totalPrice ?? 0)),
      units: Number(p._sum.quantity ?? 0),
    }));

    const recentOrders = recentOrdersRaw.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
      user: o.user,
      guestEmail: o.guestEmail,
    }));

    return NextResponse.json({
      data: {
        revenue: {
          total: Math.round(Number(totalRevenueAgg._sum.total ?? 0)),
          monthly,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
        },
        customers: {
          total: totalCustomers,
          newThisMonth: newCustomers,
        },
        topProducts,
        recentOrders,
      },
    });
  } catch (err) {
    console.error('[admin/stats]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
