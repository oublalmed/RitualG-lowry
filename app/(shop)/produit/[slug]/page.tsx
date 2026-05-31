import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { mockProducts } from '@/lib/mockData';
import { ProductPageClient } from '@/components/product/ProductPageClient';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);
  if (!product) return { title: 'Produit introuvable | Ritual Glowry' };

  return {
    title: `${product.name} | Ritual Glowry`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const related = mockProducts.filter((p) => p._id !== product._id).slice(0, 4);

  return <ProductPageClient product={product} relatedProducts={related} />;
}
