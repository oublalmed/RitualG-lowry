'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const testimonials = [
  {
    name: 'Yasmine M.',
    product: 'Extension Lisse 50cm',
    quote: 'Méconnaissable ! Mes cheveux semblent deux fois plus volumineux.',
    initial: 'Y',
  },
  {
    name: 'Aïcha B.',
    product: 'Extension Afro 40cm',
    quote: 'Exactement ma texture. On ne voit pas la différence !',
    initial: 'A',
  },
  {
    name: 'Fatima Z.',
    product: 'Perruque Lace Front',
    quote: 'La pose est simple et le rendu est incroyable.',
    initial: 'F',
  },
];

export function BeforeAfterSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
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
          {testimonials.map((item) => (
            <motion.div
              key={item.name}
              variants={fadeInUp}
              className="group flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            >
              {/* Before / After visual */}
              <div className="relative flex overflow-hidden h-64">
                {/* LEFT — AVANT */}
                <div
                  className="flex-1 flex flex-col items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, #3D2B1F 0%, #1A1410 100%)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
                    <span className="text-2xl font-playfair font-bold text-white/80">
                      {item.initial}
                    </span>
                  </div>
                  <span className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-white/50">
                    AVANT
                  </span>
                </div>

                {/* Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#C9A875] z-10 -translate-x-1/2" />

                {/* RIGHT — APRÈS */}
                <div
                  className="flex-1 flex flex-col items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, #C9A875 0%, #B8924B 100%)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-3">
                    <span className="text-2xl font-playfair font-bold text-[#1A1410]/80">
                      {item.initial}
                    </span>
                  </div>
                  <span className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#1A1410]/60">
                    APRÈS
                  </span>
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-white border border-[#3D2B1F]/8 px-6 py-5 flex flex-col gap-2">
                <p className="font-cormorant italic text-base text-[#3D2B1F]/80 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-inter font-semibold text-sm text-[#3D2B1F]">
                    {item.name}
                  </span>
                  <span className="font-inter text-xs text-[#C9A875] uppercase tracking-wider">
                    {item.product}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
