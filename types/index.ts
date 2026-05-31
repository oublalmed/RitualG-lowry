// ==================== PRODUCT TYPES ====================

export interface ProductImage {
  asset: {
    _id: string;
    url: string;
  };
  alt?: string;
}

export interface ProductVariant {
  _key: string;
  name: string;
  size?: string;
  price?: number;
  sku: string;
  stockQuantity: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: ProductImage;
}

export interface Product {
  _id: string;
  _createdAt: string;
  name: string;
  slug: string;
  category?: Category;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  description?: string;
  richDescription?: unknown[];
  ingredients?: string;
  howToUse?: string;
  tags?: string[];
  variants?: ProductVariant[];
  featured?: boolean;
  bestseller?: boolean;
}

// ==================== BLOG TYPES ====================

export interface Author {
  name: string;
  image?: ProductImage;
  bio?: string;
}

export interface BlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: ProductImage;
  author?: Author;
  publishedAt?: string;
  categories?: string[];
  body?: unknown[];
}

// ==================== ORDER TYPES ====================

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "REFUNDED"
  | "FAILED";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  email: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  stripePaymentId?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ==================== UI TYPES ====================

export interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  rating: number;
  image?: string;
}

// ==================== API TYPES ====================

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
