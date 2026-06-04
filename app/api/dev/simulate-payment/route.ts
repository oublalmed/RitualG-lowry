import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DEV-ONLY endpoint — simulate Stripe payment success for testing
// NEVER deployed to production (blocked by NODE_ENV check)
export async function POST(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  const { orderNumber, action = 'pay' } = await req.json();

  const order = await prisma.order.findFirst({ where: { orderNumber }, include: { user: true, items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  if (action === 'pay') {
    // Simulate payment_intent.succeeded
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID', paidAt: new Date(), stripePaymentIntentId: `pi_test_simulated_${Date.now()}` },
    });

    // Increment promo code usage
    if (order.promoCode) {
      await prisma.promoCode.update({
        where: { code: order.promoCode },
        data: { currentUses: { increment: 1 } },
      }).catch(() => {});
    }

    // Loyalty points (1 per 10 €)
    if (order.userId) {
      const points = Math.floor(Number(order.total) / 10);
      if (points > 0) {
        await prisma.user.update({ where: { id: order.userId }, data: { loyaltyPoints: { increment: points } } });
        await prisma.loyaltyTransaction.create({
          data: { userId: order.userId, type: 'EARNED', points, orderId: order.id, description: `Commande ${order.orderNumber}` },
        });
      }
    }
    return NextResponse.json({ success: true, status: 'PAID', orderNumber: order.orderNumber });
  }

  if (action === 'process') {
    await prisma.order.update({ where: { id: order.id }, data: { status: 'PROCESSING' } });
    return NextResponse.json({ success: true, status: 'PROCESSING' });
  }

  if (action === 'ship') {
    const { trackingNumber = 'TRACK123456' } = await req.json().catch(() => ({}));
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'SHIPPED', shippedAt: new Date(), trackingNumber },
    });
    return NextResponse.json({ success: true, status: 'SHIPPED', trackingNumber });
  }

  if (action === 'deliver') {
    await prisma.order.update({ where: { id: order.id }, data: { status: 'DELIVERED', deliveredAt: new Date() } });
    return NextResponse.json({ success: true, status: 'DELIVERED' });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
