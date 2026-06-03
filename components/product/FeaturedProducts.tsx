import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { getFeaturedProducts } from '@/lib/sanity/fetch';

const fallbackProducts = [
  {
    id: '1',
    slug: 'extension-lisse-naturelle',
    name: 'Extension Lisse Naturelle',
    price: 890,
    comparePrice: 1100,
    isNew: false,
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    slug: 'extension-bouclee-sublime',
    name: 'Extension Bouclée Sublime',
    price: 950,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: '3',
    slug: 'perruque-lace-front',
    name: 'Perruque Lace Front',
    price: 1450,
    comparePrice: 1800,
    isNew: false,
    isBestSeller: true,
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: '4',
    slug: 'extension-afro-naturelle',
    name: 'Extension Afro Naturelle',
    price: 780,
    comparePrice: null,
    isNew: true,
    isBestSeller: false,
    rating: 4.6,
    reviewCount: 56,
    stockStatus: 'low_stock',
  },
];

export async function FeaturedProducts() {
  const sanityProducts = await getFeaturedProducts();

  const products =
    sanityProducts && sanityProducts.length > 0
      ? sanityProducts.map((p: any) => ({
          id: p._id,
          slug: p.slug?.current ?? p.slug,
          name: p.name,
          price: p.basePrice,
          comparePrice: p.comparePrice ?? null,
          isNew: p.isNew ?? false,
          isBestSeller: p.isBestSeller ?? false,
          stockStatus: p.stockStatus,
        }))
      : fallbackProducts;

  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-3">
              Sélection Curatée
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold italic text-[#3D2B1F]">
              Nos Best-Sellers
            </h2>
          </div>
          <Link
            href="/boutique?state=bestseller"
            className="flex items-center gap-2 text-sm font-inter font-semibold uppercase tracking-widest text-[#3D2B1F] hover:text-[#C9A875] transition-colors group"
          >
            Voir tout
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product grid — horizontally scrollable on mobile */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
