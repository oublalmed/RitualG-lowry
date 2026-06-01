// ── Shared product types matching the Sanity schema shape ──────────────────

export interface SanityImage {
  asset?: { _id?: string; url?: string; metadata?: { dimensions?: any; lqip?: string } };
  hotspot?: any;
  crop?: any;
  alt?: string;
}

export interface ProductVariant {
  _key: string;
  label: string;
  color: { name: string; hexCode: string; photo?: SanityImage };
  length: number;
  price: number;
  sku?: string;
  stock: number;
  isAvailable: boolean;
}

export interface ProductCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Product {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: any; // portable text
  composition?: any;
  careInstructions?: any;
  basePrice: number;
  comparePrice?: number | null;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  productType?: string[];
  texture?: string[];
  tags?: string[];
  category: ProductCategory;
  images?: SanityImage[];
  variants: ProductVariant[];
  seo?: { seoTitle?: string; seoDescription?: string; ogImage?: SanityImage };
  // Fields from mock data (may not exist on Sanity docs)
  rating?: number;
  reviewCount?: number;
}

// ── Backward-compatible aliases ────────────────────────────────────────────
export type MockProduct = Product;
export type MockVariant = ProductVariant;
