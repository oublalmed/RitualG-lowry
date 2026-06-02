import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createSchema = z.object({
  code: z.string().min(1).max(50).transform((v) => v.toUpperCase()),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minAmount: z.number().nonnegative().optional(),
  maxUses: z.number().int().positive().optional(),
  startsAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  conditions: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const promos = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: promos });
  } catch (err) {
    console.error('[admin/promos GET]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { code, type, value, minAmount, maxUses, startsAt, expiresAt, conditions } = parsed.data;

    // Check for duplicate code
    const existing = await prisma.promoCode.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: 'Ce code promo existe déjà' }, { status: 409 });
    }

    const promo = await prisma.promoCode.create({
      data: {
        code,
        type,
        value,
        minAmount: minAmount ?? null,
        maxUses: maxUses ?? null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        conditions: conditions ?? null,
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        adminId: session.user.id,
        action: 'promo_created',
        resourceType: 'PromoCode',
        resourceId: promo.id,
        metadata: JSON.stringify({ code: promo.code }),
      },
    });

    return NextResponse.json({ data: promo }, { status: 201 });
  } catch (err) {
    console.error('[admin/promos POST]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
