import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import {
  sendOrderConfirmation,
  sendPaymentFailureEmail,
  sendAdminNotification,
} from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set, skipping verification');
    return NextResponse.json({ received: true });
  }

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSucceeded(pi);
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(pi);
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] Handler error:', err);
    // Return 200 to avoid Stripe retries on logic errors
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSucceeded(pi: Stripe.PaymentIntent) {
  const orderId = pi.metadata?.orderId;
  if (!orderId) {
    console.warn('[stripe-webhook] payment_intent.succeeded: no orderId in metadata');
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, user: true },
  });

  if (!order) {
    console.warn(`[stripe-webhook] Order not found: ${orderId}`);
    return;
  }

  // Idempotency: check paymentStatus
  if (order.paymentStatus === 'PAID') {
    console.info(`[stripe-webhook] Order ${orderId} already PAID, skipping`);
    return;
  }

  // Update order to CONFIRMED + PAID
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      stripePaymentId: pi.id,
    },
  });

  // Loyalty points (1 per 10 MAD) — if user model supports it
  if (order.userId) {
    const points = Math.floor(order.total / 10);
    if (points > 0) {
      await prisma.user
        .update({
          where: { id: order.userId },
          data: {
            loyaltyPoints: { increment: points },
          } as Parameters<typeof prisma.user.update>[0]['data'],
        })
        .catch(() => {/* loyalty field may not exist yet */});
    }
  }

  // Send confirmation email
  const recipientEmail = order.email;
  if (recipientEmail && recipientEmail !== 'guest@checkout.local') {
    try {
      await sendOrderConfirmation(recipientEmail, {
        orderNumber: order.id,
        items: order.items.map((i) => ({
          name: i.name,
          variant: '',
          quantity: i.quantity,
          price: i.price,
        })),
        total: order.total,
        shippingMethod: 'STANDARD',
      });
    } catch (err) {
      console.error('[stripe-webhook] Failed to send confirmation email:', err);
    }
  }

  // Admin notification
  try {
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ritualglowry.com';
    await sendAdminNotification(adminEmail, {
      orderNumber: order.id,
      total: order.total,
      customerEmail: recipientEmail,
    });
  } catch (err) {
    console.error('[stripe-webhook] Failed to send admin notification:', err);
  }
}

async function handlePaymentFailed(pi: Stripe.PaymentIntent) {
  const orderId = pi.metadata?.orderId;
  if (!orderId) return;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true },
  });

  if (!order || order.status === 'CANCELLED') return;

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'CANCELLED',
      paymentStatus: 'FAILED',
    },
  });

  const recipientEmail = order.email;
  if (recipientEmail && recipientEmail !== 'guest@checkout.local') {
    try {
      await sendPaymentFailureEmail(recipientEmail, {
        orderNumber: order.id,
      });
    } catch (err) {
      console.error('[stripe-webhook] Failed to send failure email:', err);
    }
  }
}
