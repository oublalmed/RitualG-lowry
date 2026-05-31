'use client';

import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Leaf, Heart } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const pillars = [
  {
    icon: Sparkles,
    title: 'Qualité Premium',
    description: 'Extensions 100% naturelles, certifiées Remy',
  },
  {
    icon: ShieldCheck,
    title: 'Effet Naturel',
    description: 'Mélange parfait avec vos cheveux',
  },
  {
    icon: Leaf,
    title: 'Confort Absolu',
    description: 'Légères et respirantes, portez les toute la journée',
  },
  {
    icon: Heart,
    title: 'Toutes Textures',
    description: 'Lisses, bouclées, afro — pour toutes les femmes',
  },
];

export function BrandManifesto() {
  return (
    <section className="py-24 md:py-32 bg-[#3D2B1F]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
          >
            Notre Engagement
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold italic text-[#FAF6EF] leading-tight max-w-2xl mx-auto"
          >
            L&apos;Excellence à Votre Service
          </motion.h2>
        </motion.div>

        {/* Pillars */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                variants={fadeInUp}
                className="flex flex-col items-center text-center border-t border-[#C9A875]/20 pt-8"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-[#C9A875]" />
                </div>
                <h3 className="text-lg font-playfair font-bold italic text-[#FAF6EF] mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm font-inter text-[#FAF6EF]/60 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
