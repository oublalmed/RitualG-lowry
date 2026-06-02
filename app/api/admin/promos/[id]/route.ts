import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;

    const existing = await prisma.promoCode.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Code promo introuvable' }, { status: 404 });
    }

    await prisma.promoCode.delete({ where: { id } });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'promo_deleted',
        resourceType: 'PromoCode',
        resourceId: id,
        metadata: JSON.stringify({ code: existing.code }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/promos DELETE]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
