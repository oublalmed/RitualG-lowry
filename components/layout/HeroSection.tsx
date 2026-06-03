'use client';

import Link from 'next/link';
import { ChevronDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #3D2B1F 0%, #2a1f18 40%, #1A1410 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 50%, #C9A875 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative flex-1 container mx-auto px-4 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 flex items-center">
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
            Extensions &amp; Perruques Premium
          </motion.p>

          {/* H1 — emotional */}
          <motion.h1
            variants={fadeInUp}
            className="font-playfair font-bold italic text-white leading-[1.05]"
          >
            <span className="block text-5xl md:text-6xl lg:text-7xl">Parce que votre</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl text-[#C9A875]">beauté mérite</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">l&apos;excellence.</span>
          </motion.h1>

          {/* Subtitle — transformation focused */}
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg md:text-xl font-cormorant italic text-white/75 leading-relaxed max-w-xl"
          >
            Révélez la meilleure version de vous-même avec des extensions naturelles
            sélectionnées avec exigence, pour les femmes qui ne font aucun compromis.
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

          {/* Social proof */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-6 mt-12 pt-10 border-t border-white/10"
          >
            {/* Stars + rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C9A875] text-[#C9A875]" />
                ))}
              </div>
              <span className="font-inter text-sm font-semibold text-white">4,9/5</span>
              <span className="font-inter text-xs text-white/50">· +500 clientes</span>
            </div>
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-white/20" />
            {/* Shipping */}
            <span className="font-inter text-xs text-white/60 uppercase tracking-[0.1em]">
              ✓ Livraison rapide au Maroc
            </span>
            {/* Divider */}
            <div className="hidden sm:block w-px h-5 bg-white/20" />
            {/* Guarantee */}
            <span className="font-inter text-xs text-white/60 uppercase tracking-[0.1em]">
              ✓ Retours 30 jours
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="relative pb-8 flex flex-col items-center gap-1">
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
