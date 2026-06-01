import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    return NextResponse.json({ data: items });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

const addSchema = z.object({ sanityProductId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = addSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_sanityProductId: {
          userId: session.user.id,
          sanityProductId: parsed.data.sanityProductId,
        },
      },
      update: {},
      create: {
        userId: session.user.id,
        sanityProductId: parsed.data.sanityProductId,
      },
    }).catch(() => null);

    return NextResponse.json({ data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sanityProductId = searchParams.get('sanityProductId');
    if (!sanityProductId) {
      return NextResponse.json({ error: 'sanityProductId requis' }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { userId: session.user.id, sanityProductId },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
