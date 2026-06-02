import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  adminReply: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Avis introuvable' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { status: parsed.data.status };
    if (parsed.data.adminReply !== undefined) {
      updateData.adminReply = parsed.data.adminReply;
    }

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: `review_${parsed.data.status.toLowerCase()}`,
        resourceType: 'Review',
        resourceId: id,
        metadata: JSON.stringify({ status: parsed.data.status }),
      },
    });

    return NextResponse.json({ data: updated });
  } catch (err) {
    console.error('[admin/reviews PATCH]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
