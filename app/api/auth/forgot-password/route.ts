import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

const schema = z.object({ email: z.string().email() });

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const limiter = rateLimit(`forgot:${ip}`, RATE_LIMITS.register);
  if (!limiter.success) {
    return NextResponse.json({ error: 'Trop de tentatives.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Email invalide' }, { status: 400 });

    const { email } = parsed.data;

    // Always return success to prevent user enumeration
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store token in VerificationToken table (reusing NextAuth table)
      await prisma.verificationToken.upsert({
        where: { identifier_token: { identifier: email, token } },
        update: { expires },
        create: { identifier: email, token, expires },
      });

      const resetUrl = `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
      await sendPasswordResetEmail(email, { resetUrl, name: user.name ?? undefined });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[forgot-password]', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
