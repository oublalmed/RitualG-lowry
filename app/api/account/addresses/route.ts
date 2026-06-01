import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  postalCode: z.string().min(4),
  country: z.string().min(2).default('MA'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
  label: z.string().optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    }).catch(() => []);

    return NextResponse.json({ data: addresses });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = addressSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 });
    }

    const data = parsed.data;

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }).catch(() => {});
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        isDefault: data.isDefault ?? false,
        label: data.label ?? 'Domicile',
      },
    }).catch(() => null);

    if (!address) {
      return NextResponse.json({ error: "Impossible de créer l'adresse" }, { status: 500 });
    }

    return NextResponse.json({ data: address }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
