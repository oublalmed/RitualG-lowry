import { faker } from '@faker-js/faker';

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
export type ShippingMethod = 'STANDARD' | 'EXPRESS' | 'PREMIUM';

export interface OrderItemFactory {
  id: string;
  orderId: string;
  sanityProductId: string;
  sanityVariantId: string | null;
  productName: string;
  variantLabel: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string | null;
}

export interface OrderFactory {
  id: string;
  userId: string | null;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  stripePaymentIntentId: string | null;
  shippingMethod: ShippingMethod;
  promoCode: string | null;
  notes: string | null;
  guestEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date | null;
  items: OrderItemFactory[];
}

export function createOrderItem(overrides: Partial<OrderItemFactory> = {}): OrderItemFactory {
  const qty = faker.number.int({ min: 1, max: 3 });
  const unit = faker.number.int({ min: 300, max: 1500 });
  return {
    id: faker.string.uuid(),
    orderId: faker.string.uuid(),
    sanityProductId: faker.string.uuid(),
    sanityVariantId: faker.string.uuid(),
    productName: faker.commerce.productName(),
    variantLabel: '50cm',
    quantity: qty,
    unitPrice: unit,
    totalPrice: qty * unit,
    imageUrl: null,
    ...overrides,
  };
}

export function createOrder(overrides: Partial<OrderFactory> = {}): OrderFactory {
  const subtotal = faker.number.int({ min: 300, max: 3000 });
  const shipping = 30;
  const discount = 0;
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    orderNumber: `RG-${Date.now().toString().slice(-6)}-${faker.number.int({ min: 100, max: 999 })}`,
    status: 'PENDING',
    subtotal,
    shipping,
    discount,
    tax: 0,
    total: subtotal + shipping - discount,
    currency: 'MAD',
    stripePaymentIntentId: null,
    shippingMethod: 'STANDARD',
    promoCode: null,
    notes: null,
    guestEmail: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    paidAt: null,
    items: [createOrderItem()],
    ...overrides,
  };
}

export function createPaidOrder(overrides: Partial<OrderFactory> = {}): OrderFactory {
  return createOrder({
    status: 'PAID',
    stripePaymentIntentId: `pi_${faker.string.alphanumeric(24)}`,
    paidAt: new Date(),
    ...overrides,
  });
}
