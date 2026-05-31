import { Resend } from 'resend';
import { render } from '@react-email/render';
import OrderConfirmationEmail from '@/emails/OrderConfirmationEmail';
import WelcomeEmail from '@/emails/WelcomeEmail';
import OrderShippedEmail from '@/emails/OrderShippedEmail';
import OrderDeliveredEmail from '@/emails/OrderDeliveredEmail';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

const FROM_EMAIL = process.env.EMAIL_FROM ?? 'Ritual Glowry <noreply@ritualglowry.com>';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface OrderItemData {
  name: string;
  variant: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationData {
  orderNumber: string;
  items: OrderItemData[];
  total: number;
  shippingMethod: string;
  customerName?: string;
  subtotal?: number;
  shipping?: number;
  discount?: number;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface OrderShippedData {
  orderNumber: string;
  trackingNumber: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  shippingMethod?: string;
  customerName?: string;
}

interface OrderDeliveredData {
  orderNumber: string;
  customerName?: string;
  reviewUrl?: string;
}

interface AdminNotificationData {
  orderNumber: string;
  total: number;
  customerEmail: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function safeRender(component: React.ReactElement): Promise<string> {
  try {
    return await render(component);
  } catch {
    return '<p>Email non disponible</p>';
  }
}

// ─── Email functions ───────────────────────────────────────────────────────────

export async function sendOrderConfirmation(
  to: string,
  orderData: OrderConfirmationData
): Promise<void> {
  const html = await safeRender(
    OrderConfirmationEmail({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      items: orderData.items,
      subtotal: orderData.subtotal ?? orderData.total,
      shipping: orderData.shipping ?? 0,
      discount: orderData.discount ?? 0,
      total: orderData.total,
      shippingMethod: orderData.shippingMethod,
      shippingAddress: orderData.shippingAddress ?? {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'MA',
      },
    }) as React.ReactElement
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Commande confirmée — ${orderData.orderNumber}`,
    html,
  });
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const html = await safeRender(WelcomeEmail({ name }) as React.ReactElement);

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Bienvenue dans le Club Glowry ✨',
    html,
  });
}

export async function sendOrderShipped(
  to: string,
  trackingData: OrderShippedData
): Promise<void> {
  const html = await safeRender(
    OrderShippedEmail({
      orderNumber: trackingData.orderNumber,
      customerName: trackingData.customerName,
      trackingNumber: trackingData.trackingNumber,
      trackingUrl: trackingData.trackingUrl,
      estimatedDelivery: trackingData.estimatedDelivery,
      shippingMethod: trackingData.shippingMethod,
    }) as React.ReactElement
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Votre commande ${trackingData.orderNumber} est en route ! 🚚`,
    html,
  });
}

export async function sendOrderDelivered(
  to: string,
  orderData: OrderDeliveredData
): Promise<void> {
  const html = await safeRender(
    OrderDeliveredEmail({
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      reviewUrl: orderData.reviewUrl,
    }) as React.ReactElement
  );

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Votre commande ${orderData.orderNumber} est arrivée ! 🎉`,
    html,
  });
}

export async function sendPaymentFailureEmail(
  to: string,
  data: { orderNumber: string }
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Paiement échoué — Commande ${data.orderNumber}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #FAF6EF;">
        <h1 style="font-family: Georgia, serif; font-style: italic; color: #3D2B1F;">
          Paiement non abouti
        </h1>
        <p style="color: #3D2B1F;">
          Votre paiement pour la commande <strong>${data.orderNumber}</strong> n'a pas pu être traité.
        </p>
        <p style="color: #3D2B1F;">
          Veuillez réessayer ou utiliser un autre moyen de paiement.
        </p>
        <a href="https://ritualglowry.com/checkout"
           style="display: inline-block; background: #C9A875; color: #1A1410; padding: 14px 32px; text-decoration: none; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; font-size: 13px;">
          Réessayer le paiement
        </a>
      </div>
    `,
  });
}

export async function sendAdminNotification(
  to: string,
  data: AdminNotificationData
): Promise<void> {
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `[Admin] Nouvelle commande ${data.orderNumber} — ${data.total.toLocaleString('fr-MA')} MAD`,
    html: `
      <div style="font-family: Inter, sans-serif; padding: 24px;">
        <h2>Nouvelle commande reçue</h2>
        <table>
          <tr><td><strong>Numéro :</strong></td><td>${data.orderNumber}</td></tr>
          <tr><td><strong>Total :</strong></td><td>${data.total.toLocaleString('fr-MA')} MAD</td></tr>
          <tr><td><strong>Client :</strong></td><td>${data.customerEmail}</td></tr>
          <tr><td><strong>Date :</strong></td><td>${new Date().toLocaleString('fr-FR')}</td></tr>
        </table>
        <br />
        <a href="${process.env.NEXTAUTH_URL ?? 'https://ritualglowry.com'}/admin/orders">
          Voir la commande dans l'administration →
        </a>
      </div>
    `,
  });
}
