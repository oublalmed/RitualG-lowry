'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { ShieldCheck, Leaf, Star, Award } from 'lucide-react';

const certifications = [
  {
    icon: ShieldCheck,
    label: 'Cheveux Remy Certifiés',
    description: '100% naturels, cuticules alignées',
  },
  {
    icon: Leaf,
    label: 'Sans Produits Chimiques',
    description: 'Traitement naturel uniquement',
  },
  {
    icon: Star,
    label: 'Qualité Premium',
    description: 'Contrôle qualité à chaque étape',
  },
  {
    icon: Award,
    label: 'Marque Certifiée',
    description: 'Conforme aux normes internationales',
  },
];

export function CertificationsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
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
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
          >
            Nos Certifications
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#3D2B1F]"
          >
            Qualité Garantie
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {certifications.map((cert) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={cert.label}
                variants={fadeInUp}
                className="flex flex-col items-center text-center p-6 bg-[#FAF6EF] border border-[#3D2B1F]/8"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-[#3D2B1F]/5 mb-4">
                  <Icon className="h-7 w-7 text-[#C9A875]" />
                </div>
                <h4 className="font-playfair font-bold italic text-base text-[#1A1410]">
                  {cert.label}
                </h4>
                <p className="mt-2 text-xs font-inter text-[#3D2B1F]/60">{cert.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
