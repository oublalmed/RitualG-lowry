'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const collections = [
  {
    name: 'Extensions Lisses',
    description: 'Soyeuses, légères et naturelles',
    href: '/boutique/lisses',
    gradient: 'linear-gradient(160deg, #3D2B1F 0%, #5A3D2B 60%, #6B4C35 100%)',
  },
  {
    name: 'Extensions Bouclées',
    description: 'Volume, mouvement et brillance',
    href: '/boutique/bouclees',
    gradient: 'linear-gradient(160deg, #4A3528 0%, #B8924B 60%, #C9A875 100%)',
  },
  {
    name: 'Extensions Afro',
    description: 'Authentiques, pour toutes textures',
    href: '/boutique/afro',
    gradient: 'linear-gradient(160deg, #5A3D2B 0%, #3D2B1F 50%, #C9A8A0 100%)',
  },
];

export function CollectionsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={fadeInUp}
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-3"
          >
            Collections
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#3D2B1F]"
          >
            Nos Collections
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-3 text-base font-cormorant italic text-[#3D2B1F]/60"
          >
            Trouvez l&apos;extension qui correspond à votre texture et votre style
          </motion.p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {collections.map((col) => (
            <motion.div key={col.name} variants={fadeInUp}>
              <Link
                href={col.href}
                className="group block relative overflow-hidden aspect-[3/4]"
              >
                {/* Background */}
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                  style={{ background: col.gradient }}
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-[#C9A875]/0 group-hover:bg-[#C9A875]/10 transition-colors duration-300" />

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                  <h3 className="font-playfair font-bold italic text-2xl md:text-3xl text-white leading-tight">
                    {col.name}
                  </h3>
                  <p className="mt-1 text-sm font-inter text-white/75">{col.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#C9A875] group-hover:gap-2 transition-all">
                    Découvrir →
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
