import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const schema = z.object({
  token: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Données invalides' }, { status: 400 });

    const { token, email, password } = parsed.data;

    const record = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier: email, token } },
    });

    if (!record) return NextResponse.json({ error: 'Lien invalide ou déjà utilisé' }, { status: 400 });
    if (record.expires < new Date()) return NextResponse.json({ error: 'Lien expiré. Faites une nouvelle demande.' }, { status: 400 });

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { email }, data: { password: hashed } });
    await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
