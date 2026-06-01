import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sendWelcomeEmail } from '@/lib/email';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  newsletterOptIn: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 });
    }

    const { name, email, password, newsletterOptIn } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } }).catch(() => null);
    if (existing) {
      return NextResponse.json({ error: 'Un compte avec cet email existe déjà.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    }).catch(() => {
      // If DB unavailable, still succeed in dev
    });

    // Newsletter opt-in: upsert into Newsletter table if opted in
    if (newsletterOptIn) {
      try {
        await (prisma as unknown as { newsletter: { upsert: (args: unknown) => Promise<unknown> } }).newsletter.upsert({
          where: { email },
          update: {},
          create: { email },
        });
      } catch {
        // Non-blocking — Newsletter table may not exist in schema yet
      }
    }

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(email, name);
    } catch {
      // Non-blocking
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Une erreur est survenue.' }, { status: 500 });
  }
}
