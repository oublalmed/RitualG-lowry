import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { prisma } from '@/lib/prisma';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { mockProducts } from '@/lib/mockData';

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const cartItemSchema = z.object({
  sanityProductId: z.string().min(1),
  sanityVariantId: z.string().optional(),
  quantity: z.int().min(1).max(100),
  variantLabel: z.string().min(1),
});

const shippingAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2).max(2).default('MA'),
});

const requestSchema = z.object({
  items: z.array(cartItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'PREMIUM']),
  promoCode: z.string().nullable().optional(),
  guestEmail: z.string().email().nullable().optional(),
});

// ─── Mock promo codes ──────────────────────────────────────────────────────────

const MOCK_PROMOS: Record<
  string,
  { type: 'PERCENTAGE' | 'FIXED'; value: number; minAmount: number }
> = {
  GLOWRY10: { type: 'PERCENTAGE', value: 10, minAmount: 0 },
  BIENVENUE: { type: 'PERCENTAGE', value: 15, minAmount: 500 },
  LUXE200: { type: 'FIXED', value: 200, minAmount: 1000 },
};

// ─── Shipping cost ─────────────────────────────────────────────────────────────

function computeShipping(method: 'STANDARD' | 'EXPRESS' | 'PREMIUM', subtotal: number): number {
  if (method === 'STANDARD') return subtotal >= 1200 ? 0 : 50;
  if (method === 'EXPRESS') return 100;
  return 200;
}

// ─── Generate order number ─────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LUX-${year}-${rand}`;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const { items, shippingAddress, shippingMethod, promoCode, guestEmail } = parsed.data;

    // ── Server-side price recalculation (anti-tampering) ──
    let subtotal = 0;

    interface ResolvedItem {
      name: string;
      price: number;
      quantity: number;
      image: string | null;
    }

    const resolvedItems: ResolvedItem[] = [];

    for (const item of items) {
      const product = mockProducts.find((p) => p._id === item.sanityProductId);
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.sanityProductId}` },
          { status: 400 }
        );
      }

      const variant = product.variants.find((v) => v.label === item.variantLabel);
      const unitPrice = variant ? variant.price : product.basePrice;

      subtotal += unitPrice * item.quantity;
      resolvedItems.push({
        name: `${product.name} — ${item.variantLabel}`,
        price: unitPrice,
        quantity: item.quantity,
        image: null,
      });
    }

    // ── Shipping ──
    const shippingCost = computeShipping(shippingMethod, subtotal);

    // ── Promo ──
    let discount = 0;
    if (promoCode) {
      const upperCode = promoCode.toUpperCase();
      const promo = MOCK_PROMOS[upperCode];
      if (promo && subtotal >= promo.minAmount) {
        discount =
          promo.type === 'PERCENTAGE'
            ? Math.round((subtotal * promo.value) / 100)
            : promo.value;
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discount);
    const orderNumber = generateOrderNumber();
    const email = guestEmail ?? 'guest@checkout.local';

    // ── Create Order in Prisma ──
    let dbOrderId: string | null = null;
    try {
      // Store items summary in notes as JSON (items are Sanity-based, not DB Product records)
      const itemsNote = JSON.stringify(resolvedItems.map((i) => ({
        name: i.name,
        price: i.price,
        qty: i.quantity,
      })));

      const order = await prisma.order.create({
        data: {
          email,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          subtotal,
          shipping: shippingCost,
          total,
          currency: 'MAD',
          shippingAddress: {
            ...shippingAddress,
            shippingMethod,
          },
          notes: [
            promoCode ? `Promo: ${promoCode}` : null,
            `Items: ${itemsNote}`,
          ]
            .filter(Boolean)
            .join(' | ') || null,
        },
      });
      dbOrderId = order.id;
    } catch {
      // Demo mode without DB — continue
      dbOrderId = `demo-${Date.now()}`;
    }

    // ── Stripe PaymentIntent ──
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({
        clientSecret: null,
        orderId: dbOrderId,
        orderNumber,
        total,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: formatAmountForStripe(total),
      currency: 'mad',
      metadata: {
        orderId: dbOrderId ?? '',
        orderNumber,
        guestEmail: email,
      },
      automatic_payment_methods: { enabled: true },
    });

    // ── Update order with Stripe PI id ──
    if (dbOrderId && !dbOrderId.startsWith('demo-')) {
      await prisma.order
        .update({
          where: { id: dbOrderId },
          data: { stripePaymentId: paymentIntent.id },
        })
        .catch(() => {/* ignore */});
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: dbOrderId,
      orderNumber,
      total,
    });
  } catch (err) {
    console.error('[create-payment-intent]', err);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
