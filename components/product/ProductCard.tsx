"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  imagePlaceholder: string;
  badge: string | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col">
      {/* Image container */}
      <Link href={`/products/${product.slug}`} className="block overflow-hidden">
        <div
          className="relative aspect-[3/4] w-full overflow-hidden"
          style={{ backgroundColor: product.imagePlaceholder }}
        >
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-brand-champagne text-white text-xs font-inter font-semibold uppercase tracking-wider px-3 py-1">
                {product.badge}
              </span>
            </div>
          )}

          {/* Quick-add overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
            <Button
              className="w-full rounded-none bg-brand-dark hover:bg-brand-mocha text-brand-ivory font-inter font-semibold uppercase tracking-[0.08em] text-xs py-4 h-auto"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart
              }}
            >
              <ShoppingBag className="mr-2 h-3.5 w-3.5" />
              Add to Bag
            </Button>
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col flex-1 pt-4">
        <span className="text-xs font-inter uppercase tracking-widest text-brand-champagne mb-1">
          {product.category}
        </span>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-playfair font-bold text-lg text-brand-dark hover:text-brand-champagne transition-colors leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm font-cormorant text-brand-mocha/70 leading-relaxed flex-1">
          {product.description}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-base font-inter font-semibold text-brand-dark">
            ${product.price}
          </span>
          {product.originalPrice && (
            <span className="text-sm font-inter text-brand-nude line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
