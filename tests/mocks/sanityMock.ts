import { vi } from 'vitest';
import { createProduct } from '../factories/productFactory';

export const mockSanityProducts = [
  createProduct({ _id: 'prod-1', name: 'Extension Brun Moka 50cm', isNew: true }),
  createProduct({ _id: 'prod-2', name: 'Perruque Lisse Naturelle', isBestSeller: true }),
  createProduct({ _id: 'prod-3', name: 'Extension Bouclée Premium', isFeatured: true }),
];

export const sanityMock = {
  fetch: vi.fn(async (query: string, params?: Record<string, unknown>) => {
    if (query.includes('_type == "product"') && params?.slug) {
      return mockSanityProducts.find(p => p.slug.current === params.slug) ?? null;
    }
    if (query.includes('_type == "product"')) {
      return mockSanityProducts;
    }
    if (query.includes('_type == "category"')) {
      return [
        { _id: 'cat-1', name: 'Extensions', slug: { current: 'extensions' } },
        { _id: 'cat-2', name: 'Perruques', slug: { current: 'perruques' } },
      ];
    }
    return null;
  }),
};

vi.mock('@/lib/sanity/client', () => ({
  sanityClient: sanityMock,
}));

vi.mock('@/lib/sanity/fetch', () => ({
  getAllProducts: vi.fn(async () => mockSanityProducts),
  getFeaturedProducts: vi.fn(async () => mockSanityProducts.filter(p => p.isFeatured)),
  getBestSellerProducts: vi.fn(async () => mockSanityProducts.filter(p => p.isBestSeller)),
  getProductBySlug: vi.fn(async (slug: string) =>
    mockSanityProducts.find(p => p.slug.current === slug) ?? null
  ),
  getRelatedProducts: vi.fn(async () => mockSanityProducts.slice(0, 3)),
  getAllProductSlugs: vi.fn(async () => mockSanityProducts.map(p => ({ slug: p.slug.current }))),
  getAllCategories: vi.fn(async () => [
    { _id: 'cat-1', name: 'Extensions', slug: { current: 'extensions' } },
  ]),
  getBlogPosts: vi.fn(async () => []),
  getFaqItems: vi.fn(async () => []),
}));
