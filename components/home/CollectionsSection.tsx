'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const collections = [
  {
    name: 'Lisses',
    label: 'Voir la collection',
    href: '/boutique?textures=lisse',
    // Beautiful woman in black halter top, straight hair
    image: 'https://images.pexels.com/photos/11701602/pexels-photo-11701602.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Extensions lisses premium',
  },
  {
    name: 'Bouclées',
    label: 'Voir la collection',
    href: '/boutique?textures=bouclée',
    // Black fashion model
    image: 'https://images.pexels.com/photos/20417302/pexels-photo-20417302.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Extensions bouclées naturelles',
  },
  {
    name: 'Afro & Curly',
    label: 'Voir la collection',
    href: '/boutique?textures=afro',
    // Editorial Black woman
    image: 'https://images.pexels.com/photos/22690356/pexels-photo-22690356.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Extensions afro et curly',
  },
  {
    name: 'Perruques',
    label: 'Voir la collection',
    href: '/boutique?types=perruque',
    // Model in dress against black backdrop
    image: 'https://images.pexels.com/photos/9927983/pexels-photo-9927983.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Perruques lace front premium',
  },
];

export function CollectionsSection() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
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

        {/* 4-column cards */}
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
                <Image
                  src={col.image}
                  alt={col.alt}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Dark gradient bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/80 via-[#1A1410]/15 to-transparent" />
                <div className="absolute inset-0 bg-[#C9A875]/0 group-hover:bg-[#C9A875]/8 transition-colors duration-300" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <h3 className="font-playfair font-bold italic text-xl md:text-2xl text-white leading-tight">
                    {col.name}
                  </h3>
                  <span className="mt-1 block text-xs font-inter text-white/65 group-hover:text-[#C9A875] transition-colors">
                    {col.label}
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
