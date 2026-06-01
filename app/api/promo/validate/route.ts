import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

const requestSchema = z.object({
  code: z.string().min(1),
  total: z.number().min(0),
});

type DiscountType = 'PERCENTAGE' | 'FIXED';

interface PromoConfig {
  type: DiscountType;
  value: number;
  minAmount: number;
  label: string;
}

// Mock promo codes — in production, query the PromoCode table in Prisma
const MOCK_PROMOS: Record<string, PromoConfig> = {
  GLOWRY10: {
    type: 'PERCENTAGE',
    value: 10,
    minAmount: 0,
    label: '10% de réduction',
  },
  BIENVENUE: {
    type: 'PERCENTAGE',
    value: 15,
    minAmount: 500,
    label: '15% de réduction',
  },
  LUXE200: {
    type: 'FIXED',
    value: 200,
    minAmount: 1000,
    label: '200 MAD de réduction',
  },
};

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
      return NextResponse.json(
        { isValid: false, message: 'Données invalides' },
        { status: 400 }
      );
    }

    const { code, total } = parsed.data;
    const upperCode = code.toUpperCase();
    const promo = MOCK_PROMOS[upperCode];

    if (!promo) {
      return NextResponse.json({
        isValid: false,
        discountType: null,
        discountValue: 0,
        discountAmount: 0,
        message: 'Code promo invalide',
      });
    }

    if (total < promo.minAmount) {
      return NextResponse.json({
        isValid: false,
        discountType: promo.type,
        discountValue: promo.value,
        discountAmount: 0,
        message: `Montant minimum requis : ${promo.minAmount.toLocaleString('fr-MA')} MAD`,
      });
    }

    const discountAmount =
      promo.type === 'PERCENTAGE'
        ? Math.round((total * promo.value) / 100)
        : promo.value;

    return NextResponse.json({
      isValid: true,
      discountType: promo.type,
      discountValue: promo.value,
      discountAmount,
      message: promo.label,
    });
  } catch (err) {
    console.error('[promo/validate]', err);
    return NextResponse.json(
      { isValid: false, message: 'Erreur interne' },
      { status: 500 }
    );
  }
}
