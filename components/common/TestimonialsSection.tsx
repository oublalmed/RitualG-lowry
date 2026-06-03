'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    id: 1,
    quote: 'Ces extensions ont complètement transformé mon quotidien. La qualité est incroyable, on ne voit aucune différence avec mes vrais cheveux !',
    author: 'Yasmine M.',
    product: 'Extension Lisse Naturelle',
    rating: 5,
  },
  {
    id: 2,
    quote: 'Enfin des extensions pour cheveux afro qui se fondent parfaitement. Je suis tellement heureuse d\'avoir trouvé Ritual Glowry.',
    author: 'Aïcha B.',
    product: 'Extension Afro 40cm',
    rating: 5,
  },
  {
    id: 3,
    quote: 'Le service est exceptionnel, la livraison ultra rapide et la qualité au rendez-vous. Je recommande les yeux fermés.',
    author: 'Fatima Z.',
    product: 'Perruque Lace Front',
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-[#C9A875] text-[#C9A875]" />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={fadeInUp} className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-3">
            Avis clients
          </motion.p>
          <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-playfair font-bold italic text-[#1A1410]">
            Ce Qu&apos;Elles Disent
          </motion.h2>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#C9A875] text-[#C9A875]" />
              ))}
            </div>
            <span className="font-inter font-semibold text-sm text-[#3D2B1F]">4,9/5</span>
            <span className="font-inter text-xs text-[#3D2B1F]/50">· +500 avis vérifiés</span>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={fadeInUp} className="bg-[#F5EDE0] p-8 flex flex-col">
              <StarRating count={t.rating} />
              <blockquote className="mt-5 flex-1">
                <p className="text-lg font-cormorant italic text-[#3D2B1F] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <footer className="mt-6 pt-6 border-t border-[#3D2B1F]/10">
                <p className="font-inter font-semibold text-sm text-[#1A1410]">{t.author}</p>
                <p className="font-inter text-xs text-[#C9A875] mt-0.5">{t.product}</p>
              </footer>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
