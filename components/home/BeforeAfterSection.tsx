'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const transformations = [
  {
    name: 'Yasmine M.',
    product: 'Extension Lisse 50cm',
    quote: 'Méconnaissable ! Mes cheveux semblent deux fois plus volumineux.',
    before: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&auto=format&fit=crop&crop=top',
    after:  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop&crop=top',
  },
  {
    name: 'Aïcha B.',
    product: 'Extension Afro 40cm',
    quote: 'Exactement ma texture. On ne voit pas la différence !',
    before: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=600&q=80&auto=format&fit=crop&crop=top',
    after:  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop&crop=top',
  },
  {
    name: 'Fatima Z.',
    product: 'Perruque Lace Front',
    quote: 'La pose est simple et le rendu est incroyable.',
    before: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=600&q=80&auto=format&fit=crop&crop=top',
    after:  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80&auto=format&fit=crop&crop=top',
  },
];

export function BeforeAfterSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-3"
          >
            Résultats réels
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#3D2B1F]"
          >
            Transformations Réelles
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-3 text-xl font-cormorant italic text-[#C9A875]"
          >
            Avant · Après
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {transformations.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeInUp}
              className="group flex flex-col hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Before / After photos */}
              <div className="relative flex overflow-hidden h-72">
                {/* AVANT */}
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={item.before}
                    alt={`Avant — ${item.name}`}
                    fill
                    className="object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 50vw, 17vw"
                  />
                  <div className="absolute inset-0 bg-[#1A1410]/20" />
                  <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-inter font-semibold uppercase tracking-[0.15em] text-white/90">
                    Avant
                  </span>
                </div>

                {/* Gold divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#C9A875] z-10 -translate-x-1/2" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-[#C9A875] flex items-center justify-center">
                  <span className="text-[#1A1410] font-inter font-bold text-xs">→</span>
                </div>

                {/* APRÈS */}
                <div className="flex-1 relative overflow-hidden">
                  <Image
                    src={item.after}
                    alt={`Après — ${item.name}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 50vw, 17vw"
                  />
                  <div className="absolute inset-0 bg-[#C9A875]/5" />
                  <span className="absolute bottom-3 left-0 right-0 text-center text-xs font-inter font-semibold uppercase tracking-[0.15em] text-white/90">
                    Après
                  </span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white border border-[#3D2B1F]/8 px-6 py-5 flex flex-col gap-2">
                <p className="font-cormorant italic text-base text-[#3D2B1F]/80 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-inter font-semibold text-sm text-[#3D2B1F]">{item.name}</span>
                  <span className="font-inter text-xs text-[#C9A875] uppercase tracking-wider">{item.product}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
