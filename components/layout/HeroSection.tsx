'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient — mocha to dark */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #3D2B1F 0%, #2a1f18 40%, #1A1410 100%)',
        }}
      />
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 60% 50%, #C9A875 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 pt-28 md:pt-32 pb-20">
        <motion.div
          className="max-w-3xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-title */}
          <motion.p
            variants={fadeInUp}
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-6"
          >
            Extensions Premium
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={fadeInUp}
            className="font-playfair font-bold italic text-white leading-[1.05]"
          >
            <span className="block text-6xl md:text-7xl lg:text-8xl">Le Glow</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl">en toute</span>
            <span className="block text-6xl md:text-7xl lg:text-8xl">simplicité</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl font-cormorant italic text-white/75 leading-relaxed max-w-lg"
          >
            Des extensions naturelles qui subliment votre beauté authentique.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-sm px-8 py-4 transition-colors duration-300"
            >
              Découvrir la Collection
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex items-center justify-center border border-white/40 hover:border-white text-white font-inter font-semibold uppercase tracking-[0.08em] text-sm px-8 py-4 transition-colors duration-300"
            >
              Notre Histoire
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 text-[#C9A875]" />
        </motion.div>
      </div>
    </section>
  );
}
