'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';

export default function FavorisPage() {
  const { items, clear } = useWishlistStore();
  const { addItem } = useCartStore();

  const handleAddAll = () => {
    items.forEach((item) => {
      addItem({
        id: `${item.productId}-default`,
        productId: item.productId,
        sanityProductId: item.productId,
        name: item.name,
        variantLabel: 'Standard',
        slug: item.slug,
        price: item.price,
        imageUrl: undefined,
      });
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Mes Favoris
          {items.length > 0 && (
            <span className="ml-2 text-base font-inter font-normal text-[#3D2B1F]/50">
              ({items.length})
            </span>
          )}
        </h1>
        {items.length > 0 && (
          <Button
            onClick={handleAddAll}
            className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold text-sm gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Tout ajouter au panier
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-14 w-14 text-[#C9A875]/30 mb-4" strokeWidth={1.5} />
          <h2
            className="text-xl text-[#3D2B1F] mb-2"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Aucun favori
          </h2>
          <p className="text-sm text-[#3D2B1F]/50 font-inter mb-6">
            Ajoutez vos produits préférés à vos favoris pour les retrouver facilement.
          </p>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#1A1410] text-[#FAF6EF] text-sm font-inter font-semibold uppercase tracking-wider px-6 py-3 rounded-lg transition-colors"
          >
            Découvrir la boutique →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard
              key={item.productId}
              product={{
                id: item.productId,
                slug: item.slug,
                name: item.name,
                price: item.price,
                comparePrice: item.comparePrice,
                isNew: item.isNew,
                isBestSeller: item.isBestSeller,
                rating: item.rating,
                reviewCount: item.reviewCount,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
