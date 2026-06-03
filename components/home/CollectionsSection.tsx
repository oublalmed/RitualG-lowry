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
    // Woman with long straight black hair
    image: 'https://images.pexels.com/photos/18348405/pexels-photo-18348405.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Extension lisse — cheveux longs droits naturels',
  },
  {
    name: 'Extensions Bouclées',
    description: 'Volume, mouvement et brillance',
    href: '/boutique?textures=bouclée',
    // Beautiful woman with afro/curly hair
    image: 'https://images.pexels.com/photos/20185478/pexels-photo-20185478.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Extension bouclée — volume et mouvement naturel',
  },
  {
    name: 'Perruques',
    description: 'Lace front, full lace, naturelles',
    href: '/boutique?types=perruque',
    // Fashion portrait woman
    image: 'https://images.pexels.com/photos/17359824/pexels-photo-17359824.jpeg?auto=compress&cs=tinysrgb&w=800&h=1067&fit=crop',
    alt: 'Perruque naturelle premium — lace front',
  },
];

export function CollectionsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
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

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/85 via-[#1A1410]/25 to-transparent" />
                <div className="absolute inset-0 bg-[#C9A875]/0 group-hover:bg-[#C9A875]/10 transition-colors duration-300" />
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
