'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

// Woman posing on black background — matches reference style perfectly
const HERO_IMG = 'https://images.pexels.com/photos/17433078/pexels-photo-17433078.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Ritual Glowry — femme élégante avec extensions cheveux premium"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — lighter on right to show model, dark on left for text */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(100deg, rgba(26,20,16,0.90) 0%, rgba(26,20,16,0.65) 45%, rgba(26,20,16,0.20) 100%)',
          }}
        />
      </div>

      {/* Gold accent */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 40% 60% at 20% 60%, #C9A875 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative flex-1 container mx-auto px-4 md:px-8 lg:px-12 pt-28 md:pt-32 pb-16 flex items-center">
        <motion.div
          className="max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-inter font-semibold uppercase tracking-[0.18em] text-[#C9A875] mb-5"
          >
            Ritual Glowry · Luxury Hair
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="font-playfair font-bold italic text-white leading-[1.05]"
          >
            <span className="block text-5xl md:text-6xl lg:text-7xl">Révélez votre</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl text-[#C9A875]">éclat naturel</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-5 text-base md:text-lg font-inter text-white/70 leading-relaxed max-w-md"
          >
            Extensions &amp; perruques premium 100% naturelles. Qualité exigeante,
            effet naturel garanti — pour les femmes qui ne font aucun compromis.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link
              href="/boutique"
              className="inline-flex items-center justify-center bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.1em] text-sm px-8 py-4 transition-colors duration-300"
            >
              Découvrir la Collection
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex items-center justify-center border border-white/30 hover:border-[#C9A875] hover:text-[#C9A875] text-white font-inter font-semibold uppercase tracking-[0.1em] text-sm px-8 py-4 transition-colors duration-300"
            >
              Notre Histoire
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-5 mt-12 pt-10 border-t border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#C9A875] text-[#C9A875]" />
                ))}
              </div>
              <span className="font-inter text-sm font-semibold text-white">4,9/5</span>
              <span className="font-inter text-xs text-white/45">+500 clientes</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="font-inter text-xs text-white/55 uppercase tracking-[0.1em]">✓ Livraison rapide</span>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="font-inter text-xs text-white/55 uppercase tracking-[0.1em]">✓ Retours 30 jours</span>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <span className="font-inter text-xs text-white/55 uppercase tracking-[0.1em]">✓ 100% naturel</span>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative pb-8 flex justify-center">
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
