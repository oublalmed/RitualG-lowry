import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod/v4';
import { prisma } from '@/lib/prisma';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { sanityClient } from '@/lib/sanity/client';
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit';

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const cartItemSchema = z.object({
  sanityProductId: z.string().min(1),
  sanityVariantId: z.string().nullish(),
  quantity: z.number().int().min(1).max(100),
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
  existingOrderId: z.string().optional(), // pass to UPDATE instead of create new order
});

// ─── Shipping cost ─────────────────────────────────────────────────────────────

function computeShipping(method: 'STANDARD' | 'EXPRESS' | 'PREMIUM', subtotal: number): number {
  if (method === 'STANDARD') return subtotal >= 120 ? 0 : 5;
  if (method === 'EXPRESS') return 10;
  return 20;
}

// ─── Generate order number ─────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `LUX-${year}-${rand}`;
}

// ─── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limiter = rateLimit(`checkout:${ip}`, RATE_LIMITS.checkout);
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
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    const { items, shippingAddress, shippingMethod, promoCode, guestEmail, existingOrderId } = parsed.data;

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
      const product = await sanityClient.fetch<{
        name: string;
        basePrice: number;
        variants: { _key: string; label: string; price: number }[] | null;
      } | null>(
        `*[_type == "product" && _id == $id][0]{ name, basePrice, "variants": variants[]{ _key, label, price } }`,
        { id: item.sanityProductId }
      );
      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.sanityProductId}` },
          { status: 400 }
        );
      }

      const variant = product.variants?.find((v) => v.label === item.variantLabel);
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
      try {
        const promo = await prisma.promoCode.findUnique({
          where: { code: upperCode },
        });
        if (
          promo &&
          promo.isActive &&
          (!promo.expiresAt || promo.expiresAt > new Date()) &&
          (!promo.startsAt || promo.startsAt <= new Date()) &&
          (!promo.maxUses || promo.currentUses < promo.maxUses) &&
          (!promo.minAmount || subtotal >= Number(promo.minAmount))
        ) {
          discount =
            promo.type === 'PERCENTAGE'
              ? Math.round((subtotal * Number(promo.value)) / 100)
              : Number(promo.value);
        }
      } catch {
        // If DB is unavailable, skip promo validation
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discount);
    const email = guestEmail ?? 'guest@checkout.local';
    let orderNumber = generateOrderNumber();

    // ── Create or Update Order in Prisma ──
    let dbOrderId: string | null = null;
    try {
      if (existingOrderId) {
        // Promo was applied after initial creation — update existing order
        const existing = await prisma.order.findUnique({ where: { id: existingOrderId }, select: { orderNumber: true } });
        if (existing) orderNumber = existing.orderNumber;
        await prisma.order.update({
          where: { id: existingOrderId },
          data: { subtotal, shipping: shippingCost, discount, total, promoCode: promoCode ?? null },
        });
        dbOrderId = existingOrderId;
      } else {
        const order = await prisma.order.create({
          data: {
            orderNumber,
            status: 'PENDING',
            subtotal,
            shipping: shippingCost,
            discount,
            total,
            currency: 'EUR',
            shippingMethod,
            guestEmail: email,
            promoCode: promoCode ?? undefined,
            notes: JSON.stringify({ shippingAddress }),
            items: {
              create: resolvedItems.map((ri, idx) => ({
                sanityProductId: items[idx].sanityProductId,
                sanityVariantId: items[idx].sanityVariantId ?? null,
                productName: ri.name,
                variantLabel: items[idx].variantLabel,
                quantity: ri.quantity,
                unitPrice: ri.price,
                totalPrice: ri.price * ri.quantity,
              })),
            },
          },
        });
        dbOrderId = order.id;
      }
    } catch {
      dbOrderId = existingOrderId ?? `demo-${Date.now()}`;
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
      currency: 'eur',
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
          data: { stripePaymentIntentId: paymentIntent.id },
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
