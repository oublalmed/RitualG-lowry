'use client';

import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

const values = [
  { label: 'Authenticité', description: 'Des produits qui respectent votre identité' },
  { label: 'Qualité', description: 'Certifiées Remy, 100% naturelles' },
  { label: 'Inclusivité', description: 'Pour toutes les textures et tous les styles' },
  { label: 'Durabilité', description: 'Produits conçus pour durer' },
];

export function MissionSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text — reversed layout */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeInLeft}
              className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
            >
              Mission & Valeurs
            </motion.p>
            <motion.h2
              variants={fadeInLeft}
              className="text-3xl md:text-4xl font-playfair font-bold italic text-[#3D2B1F]"
            >
              Sublimer votre beauté naturelle
            </motion.h2>
            <motion.p
              variants={fadeInLeft}
              className="mt-6 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed"
            >
              Notre mission est simple : vous offrir des extensions premium qui s&apos;intègrent
              parfaitement à vos cheveux naturels, sans compromis sur la qualité ni sur
              l&apos;authenticité.
            </motion.p>

            <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-2 gap-6">
              {values.map((v) => (
                <motion.div key={v.label} variants={fadeInLeft}>
                  <h4 className="font-playfair font-bold italic text-base text-[#1A1410]">
                    {v.label}
                  </h4>
                  <p className="mt-1 text-xs font-inter text-[#3D2B1F]/60">{v.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image block */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="aspect-[4/5]"
            style={{
              background: 'linear-gradient(135deg, #C9A875 0%, #3D2B1F 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
