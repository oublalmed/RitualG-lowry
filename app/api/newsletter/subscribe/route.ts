import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';

const requestSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? 'Email invalide' },
        { status: 400 }
      );
    }

    // Note: Newsletter model is in schema.prisma but may not be migrated yet.
    // In production, uncomment the Prisma upsert below.
    // const { email, source } = parsed.data;
    // await prisma.newsletter.upsert({
    //   where: { email },
    //   update: { isActive: true, unsubscribedAt: null },
    //   create: { email, isActive: true, source: source ?? 'website' },
    // });

    return NextResponse.json({
      success: true,
      message: 'Vous êtes maintenant inscrit(e) à notre newsletter',
    });
  } catch (err) {
    console.error('[newsletter/subscribe]', err);
    return NextResponse.json(
      { success: false, message: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
