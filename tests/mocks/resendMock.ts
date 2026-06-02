import { vi } from 'vitest';

export const sentEmails: Array<{
  to: string;
  subject?: string;
  type: string;
  data: unknown;
}> = [];

export const resendMock = {
  emails: {
    send: vi.fn(async (params: { to: string; subject?: string }) => {
      return { data: { id: `email_${Date.now()}` }, error: null };
    }),
  },
};

vi.mock('resend', () => ({
  Resend: vi.fn(() => resendMock),
}));

vi.mock('@/lib/email', () => ({
  sendWelcomeEmail: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'welcome', data });
    return { success: true };
  }),
  sendOrderConfirmation: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'order-confirmation', data });
    return { success: true };
  }),
  sendOrderShipped: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'order-shipped', data });
    return { success: true };
  }),
  sendOrderDelivered: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'order-delivered', data });
    return { success: true };
  }),
  sendPaymentFailureEmail: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'payment-failure', data });
    return { success: true };
  }),
  sendAdminNotification: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'admin-notification', data });
    return { success: true };
  }),
  sendPasswordResetEmail: vi.fn(async (to: string, data: unknown) => {
    sentEmails.push({ to, type: 'password-reset', data });
    return { success: true };
  }),
}));

export function clearSentEmails() {
  sentEmails.length = 0;
}
