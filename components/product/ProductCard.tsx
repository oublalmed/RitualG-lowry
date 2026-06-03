'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

interface ProductCardProduct {
  id: string;
  slug?: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
  stockStatus?: string;
  image?: string | null;       // real image URL (Sanity CDN)
  // legacy fields
  category?: string;
  originalPrice?: number | null;
  description?: string;
  imagePlaceholder?: string;
  badge?: string | null;
}

interface ProductCardProps {
  product: ProductCardProduct;
}

// Studio dark-background portraits matched to each product type (matches reference style)
const FALLBACK_IMAGES: { keywords: string[]; url: string; alt: string }[] = [
  {
    keywords: ['lisse', 'lisses', 'straight', 'indien', 'naturelle'],
    // Beautiful woman in black halter top — straight hair
    url: 'https://images.pexels.com/photos/11701602/pexels-photo-11701602.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    alt: 'Extension lisse naturelle',
  },
  {
    keywords: ['bouclée', 'bouclé', 'bouclee', 'boucle', 'sublime', 'curly'],
    // Black fashion model with curly/voluminous hair
    url: 'https://images.pexels.com/photos/20417302/pexels-photo-20417302.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    alt: 'Extension bouclée naturelle',
  },
  {
    keywords: ['afro'],
    // Editorial Black woman afro
    url: 'https://images.pexels.com/photos/22690356/pexels-photo-22690356.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    alt: 'Extension afro naturelle',
  },
  {
    keywords: ['ondulée', 'ondule', 'wavy', 'wave', 'body', 'deep'],
    // Woman posing on black background — wavy hair
    url: 'https://images.pexels.com/photos/17433078/pexels-photo-17433078.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    alt: 'Extension ondulée body wave',
  },
  {
    keywords: ['perruque', 'wig', 'lace', 'full'],
    // Model in dress against black backdrop
    url: 'https://images.pexels.com/photos/9927983/pexels-photo-9927983.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop',
    alt: 'Perruque lace front premium',
  },
];

const DEFAULT_FALLBACK = 'https://images.pexels.com/photos/2757422/pexels-photo-2757422.jpeg?auto=compress&cs=tinysrgb&w=600&h=800&fit=crop';

function getFallbackImage(name: string): { url: string; alt: string } {
  const lower = name.toLowerCase();
  for (const entry of FALLBACK_IMAGES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { url: entry.url, alt: entry.alt };
    }
  }
  return { url: DEFAULT_FALLBACK, alt: name };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const slug = product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-');

  const badge = product.badge ?? (product.isBestSeller ? 'Best-seller' : product.isNew ? 'Nouveau' : null);
  const displayPrice = product.price;
  const comparePrice = product.comparePrice ?? product.originalPrice;

  // Resolve image: Sanity → Pexels fallback by keyword → default
  const resolvedImage = product.image ?? getFallbackImage(product.name);
  const imgSrc = typeof resolvedImage === 'string' ? resolvedImage : resolvedImage.url;
  const imgAlt = typeof resolvedImage === 'string' ? product.name : resolvedImage.alt;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      sanityProductId: product.id,
      name: product.name,
      variantLabel: 'Standard',
      slug,
      imageUrl: imgSrc,
      price: product.price,
    });
  };

  return (
    <article className="group flex flex-col">
      {/* Image container */}
      <Link href={`/produit/${slug}`} className="block overflow-hidden">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5EDE0]">
          <Image
            src={imgSrc}
            alt={imgAlt}
            fill
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`text-xs font-inter font-semibold uppercase tracking-wider px-3 py-1 ${
                  badge === 'Nouveau' || badge === 'New'
                    ? 'bg-[#C9A8A0] text-[#FAF6EF]'
                    : 'bg-[#C9A875] text-[#1A1410]'
                }`}
              >
                {badge}
              </span>
            </div>
          )}

          {/* Stock limité badge */}
          {product.stockStatus === 'low_stock' && (
            <div className="absolute top-3 right-3 z-10">
              <span className="text-xs font-inter font-semibold uppercase tracking-wider px-2 py-1 bg-[#C9A8A0] text-[#1A1410]">
                Stock limité
              </span>
            </div>
          )}

          {/* Quick-add overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <button
              className="w-full bg-[#1A1410]/90 hover:bg-[#3D2B1F] text-[#FAF6EF] font-inter font-semibold uppercase tracking-[0.08em] text-xs py-4 flex items-center justify-center gap-2 transition-colors duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Ajouter au panier
            </button>
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 pt-4">
        {product.category && (
          <span className="text-xs font-inter uppercase tracking-widest text-[#C9A875] mb-1">
            {product.category}
          </span>
        )}
        <Link href={`/produit/${slug}`}>
          <h3 className="font-playfair font-bold text-base text-[#1A1410] hover:text-[#C9A875] transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="mt-1.5 text-sm font-cormorant text-[#3D2B1F]/70 leading-relaxed flex-1">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-3 w-3 ${
                    star <= Math.round(product.rating!)
                      ? 'fill-[#C9A875] text-[#C9A875]'
                      : 'fill-[#3D2B1F]/10 text-[#3D2B1F]/10'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-inter text-[#3D2B1F]/50">
              ({product.reviewCount})
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-2">
          <span className="text-base font-inter font-semibold text-[#1A1410]">
            {displayPrice.toLocaleString('fr-MA')} MAD
          </span>
          {comparePrice && (
            <span className="text-sm font-inter text-[#C9A8A0] line-through">
              {comparePrice.toLocaleString('fr-MA')} MAD
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
