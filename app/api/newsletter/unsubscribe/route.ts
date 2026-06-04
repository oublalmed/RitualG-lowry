import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/newsletter/unsubscribe?email=...  — one-click unsubscribe from email link
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

  await prisma.newsletter.updateMany({
    where: { email },
    data: { isActive: false, unsubscribedAt: new Date() },
  }).catch(() => {});

  // Redirect to a confirmation page
  return new NextResponse(null, {
    status: 302,
    headers: { Location: '/?unsubscribed=1' },
  });
}

// POST /api/newsletter/unsubscribe — unsubscribe from account settings
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email requis' }, { status: 400 });

    await prisma.newsletter.updateMany({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
