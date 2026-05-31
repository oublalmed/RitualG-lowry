'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

export function StoryPreview() {
  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left — gradient block */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="aspect-[4/5] w-full"
            style={{
              background:
                'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)',
            }}
          />

          {/* Right — text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeInUp}
              className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
            >
              Notre Histoire
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold italic text-[#3D2B1F] leading-tight"
            >
              Née d&apos;une passion pour la beauté naturelle
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mt-6 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed"
            >
              Ritual Glowry est née d&apos;une conviction simple : chaque femme mérite des
              extensions qui respectent sa texture, sa nature et son identité. Fondée au Maroc,
              notre marque puise son inspiration dans la diversité et la richesse des cheveux
              africains et méditerranéens.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="mt-4 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed"
            >
              Chaque produit est soigneusement sélectionné pour garantir une qualité premium,
              un confort absolu et un rendu naturel qui vous ressemble vraiment.
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8">
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-[#C9A875] hover:text-[#B8924B] transition-colors group"
              >
                En savoir plus
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
