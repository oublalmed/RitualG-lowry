'use client';

import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '@/lib/animations';

export function AboutHero() {
  return (
    <section
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24"
      style={{
        background: 'linear-gradient(160deg, #C9A875 0%, #3D2B1F 50%, #1A1410 100%)',
      }}
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, #FAF6EF 0%, transparent 70%)',
        }}
      />
      <motion.div
        className="relative container mx-auto px-4 md:px-8 lg:px-12 text-center py-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={fadeInUp}
          className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
        >
          À Propos
        </motion.p>
        <motion.h1
          variants={fadeInUp}
          className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold italic text-white leading-tight"
        >
          Notre Histoire
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mt-6 text-lg font-cormorant italic text-white/75 max-w-xl mx-auto"
        >
          Une marque née d&apos;une passion pour la beauté naturelle et authentique
        </motion.p>
      </motion.div>
    </section>
  );
}
