import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from '@/lib/shopify/fetch';
import { ProductPageClient } from '@/components/product/ProductPageClient';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Produit introuvable | Ritual Glowry' };

  return {
    title: product.seo?.seoTitle ?? `${product.name} | Ritual Glowry`,
    description: product.seo?.seoDescription ?? product.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(slug, product.category?.slug ?? '');

  return <ProductPageClient product={product} relatedProducts={related} />;
}
