'use client';

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

// Gradient placeholder colors per product index
const gradients = [
  'linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 100%)',
  'linear-gradient(135deg, #4A3528 0%, #C9A875 100%)',
  'linear-gradient(135deg, #5A3D2B 0%, #B8924B 100%)',
  'linear-gradient(135deg, #3D2B1F 0%, #C9A8A0 100%)',
];

let cardIndex = 0;

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const slug = product.slug ?? product.name.toLowerCase().replace(/\s+/g, '-');
  const gradientBg = product.imagePlaceholder
    ? undefined
    : gradients[cardIndex++ % gradients.length];

  const badge = product.badge ?? (product.isBestSeller ? 'Best-seller' : product.isNew ? 'Nouveau' : null);
  const displayPrice = product.price;
  const comparePrice = product.comparePrice ?? product.originalPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      sanityProductId: product.id,
      name: product.name,
      variantLabel: 'Standard',
      slug,
      imageUrl: undefined,
      price: product.price,
    });
  };

  return (
    <article className="group flex flex-col">
      {/* Image container */}
      <Link href={`/produit/${slug}`} className="block overflow-hidden">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden"
          style={
            product.imagePlaceholder
              ? { backgroundColor: product.imagePlaceholder }
              : { background: gradientBg }
          }
        >
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
              className="w-full bg-[#1A1410] hover:bg-[#3D2B1F] text-[#FAF6EF] font-inter font-semibold uppercase tracking-[0.08em] text-xs py-4 flex items-center justify-center gap-2 transition-colors duration-300"
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
