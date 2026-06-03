'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const collections = [
  {
    name: 'Extensions Lisses',
    description: 'Soyeuses, légères et naturelles',
    href: '/boutique?textures=lisse',
    image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=85&auto=format&fit=crop',
    alt: 'Extensions lisses premium',
  },
  {
    name: 'Extensions Bouclées',
    description: 'Volume, mouvement et brillance',
    href: '/boutique?textures=bouclée',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=85&auto=format&fit=crop',
    alt: 'Extensions bouclées naturelles',
  },
  {
    name: 'Perruques',
    description: 'Lace front, full lace, naturelles',
    href: '/boutique?types=perruque',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=85&auto=format&fit=crop',
    alt: 'Perruques premium naturelles',
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
                {/* Photo */}
                <Image
                  src={col.image}
                  alt={col.alt}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/85 via-[#1A1410]/20 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#C9A875]/0 group-hover:bg-[#C9A875]/10 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
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
