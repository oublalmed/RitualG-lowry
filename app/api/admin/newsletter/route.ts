import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const [total, active, recentSubscribers] = await Promise.all([
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { isActive: true } }),
      prisma.newsletter.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          email: true,
          source: true,
          isActive: true,
          createdAt: true,
          unsubscribedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: {
        total,
        active,
        unsubscribed: total - active,
        recentSubscribers,
      },
    });
  } catch (err) {
    console.error('[admin/newsletter]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
