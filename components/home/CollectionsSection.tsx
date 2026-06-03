'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const collections = [
  {
    name: 'Lisses',
    description: 'Soyeuses, légères et naturelles',
    href: '/boutique?textures=lisse',
    gradient: 'linear-gradient(160deg, #3D2B1F 0%, #5A3D2B 60%, #6B4C35 100%)',
  },
  {
    name: 'Bouclées',
    description: 'Volume, mouvement et brillance',
    href: '/boutique?textures=bouclée',
    gradient: 'linear-gradient(160deg, #4A3528 0%, #B8924B 60%, #C9A875 100%)',
  },
  {
    name: 'Afro & Curly',
    description: 'Authentiques, pour toutes textures',
    href: '/boutique?textures=afro',
    gradient: 'linear-gradient(160deg, #5A3D2B 0%, #3D2B1F 50%, #C9A8A0 100%)',
  },
  {
    name: 'Perruques',
    description: 'Lace front, full lace, naturelles',
    href: '/boutique?types=perruque',
    gradient: 'linear-gradient(160deg, #2C1F17 0%, #7A5435 50%, #C9A875 100%)',
  },
];

export function CollectionsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div>
            <motion.p variants={fadeInUp} className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-2">
              Collections
            </motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-playfair font-bold italic text-[#3D2B1F]">
              Nos Collections
            </motion.h2>
          </div>
          <motion.p variants={fadeInUp}>
            <Link href="/boutique" className="text-xs font-inter font-semibold uppercase tracking-widest text-[#3D2B1F]/60 hover:text-[#C9A875] transition-colors">
              Voir tout →
            </Link>
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {collections.map((col) => (
            <motion.div key={col.name} variants={fadeInUp}>
              <Link href={col.href} className="group block relative overflow-hidden aspect-[3/4]">
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ background: col.gradient }}
                />
                <div className="absolute inset-0 bg-[#C9A875]/0 group-hover:bg-[#C9A875]/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="font-playfair font-bold italic text-xl md:text-2xl text-white leading-tight">
                    {col.name}
                  </h3>
                  <p className="mt-1 text-xs font-inter text-white/65">{col.description}</p>
                  <span className="mt-2 block text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#C9A875] group-hover:translate-x-1 transition-transform">
                    Voir la collection →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
