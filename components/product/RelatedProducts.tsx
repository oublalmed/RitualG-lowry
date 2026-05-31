'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { MockProduct } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { fadeInUp } from '@/lib/animations';

const gradients = [
  'linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 100%)',
  'linear-gradient(135deg, #4A3528 0%, #C9A875 100%)',
  'linear-gradient(135deg, #5A3D2B 0%, #B8924B 100%)',
  'linear-gradient(135deg, #3D2B1F 0%, #C9A8A0 100%)',
];

interface RelatedProductsProps {
  products: MockProduct[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (!products.length) return null;

  return (
    <section className="py-16 border-t border-[#3D2B1F]/8">
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="font-playfair italic font-bold text-2xl text-[#3D2B1F]"
        >
          Vous aimerez aussi
        </motion.h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-9 h-9 border border-[#3D2B1F]/15 flex items-center justify-center hover:border-[#C9A875] hover:text-[#C9A875] text-[#3D2B1F]/60 transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-9 h-9 border border-[#3D2B1F]/15 flex items-center justify-center hover:border-[#C9A875] hover:text-[#C9A875] text-[#3D2B1F]/60 transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, idx) => (
          <div key={product._id} className="w-[260px] flex-shrink-0 snap-start">
            <ProductCard
              product={{
                id: product._id,
                slug: product.slug,
                name: product.name,
                price: product.basePrice,
                comparePrice: product.comparePrice,
                isNew: product.isNew,
                isBestSeller: product.isBestSeller,
                rating: product.rating,
                reviewCount: product.reviewCount,
                description: product.shortDescription,
                imagePlaceholder: gradients[idx % gradients.length],
                category: product.category.name,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
