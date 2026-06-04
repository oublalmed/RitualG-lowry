// GA4 event tracking helpers (only fire if window.gtag exists)

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params)
  }
}

export const track = {
  viewProduct: (product: { id: string; name: string; price: number; category: string }) =>
    trackEvent('view_item', {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          item_category: product.category,
        },
      ],
    }),

  addToCart: (product: { id: string; name: string; price: number; quantity: number }) =>
    trackEvent('add_to_cart', {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    }),

  beginCheckout: (total: number) =>
    trackEvent('begin_checkout', { value: total, currency: 'EUR' }),

  purchase: (orderId: string, total: number) =>
    trackEvent('purchase', {
      transaction_id: orderId,
      value: total,
      currency: 'EUR',
    }),
}
