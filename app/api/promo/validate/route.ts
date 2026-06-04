import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';
import { prisma } from '@/lib/prisma';

const requestSchema = z.object({
  code: z.string().min(1),
  total: z.number().min(0),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limiter = rateLimit(`promo:${ip}`, RATE_LIMITS.promo);
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Trop de requêtes. Réessayez plus tard.' },
      { status: 429, headers: { 'Retry-After': String(limiter.resetIn) } }
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ isValid: false, message: 'Données invalides' }, { status: 400 });
    }

    const { code, total } = parsed.data;
    const upperCode = code.toUpperCase();

    const promo = await prisma.promoCode.findUnique({ where: { code: upperCode } });

    if (!promo) {
      return NextResponse.json({ isValid: false, discountAmount: 0, message: 'Code promo invalide' });
    }

    if (!promo.isActive) {
      return NextResponse.json({ isValid: false, discountAmount: 0, message: 'Ce code promo n\'est plus actif' });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ isValid: false, discountAmount: 0, message: 'Ce code promo a expiré' });
    }

    if (promo.startsAt && promo.startsAt > new Date()) {
      return NextResponse.json({ isValid: false, discountAmount: 0, message: 'Ce code promo n\'est pas encore actif' });
    }

    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return NextResponse.json({ isValid: false, discountAmount: 0, message: 'Ce code promo a atteint son nombre d\'utilisations maximum' });
    }

    const minAmount = promo.minAmount ? Number(promo.minAmount) : 0;
    if (total < minAmount) {
      return NextResponse.json({
        isValid: false,
        discountAmount: 0,
        message: `Montant minimum requis : ${minAmount.toLocaleString('fr-MA')} MAD`,
      });
    }

    const discountAmount =
      promo.type === 'PERCENTAGE'
        ? Math.round((total * Number(promo.value)) / 100)
        : Math.min(Number(promo.value), total);

    const label = promo.type === 'PERCENTAGE'
      ? `${Number(promo.value)}% de réduction`
      : `${Number(promo.value)} MAD de réduction`;

    return NextResponse.json({
      isValid: true,
      code: upperCode,
      discountType: promo.type,
      discountValue: Number(promo.value),
      discountAmount,
      message: label,
    });
  } catch (err) {
    console.error('[promo/validate]', err);
    return NextResponse.json({ isValid: false, message: 'Erreur interne' }, { status: 500 });
  }
}
