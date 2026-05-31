'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const team = [
  {
    name: 'Leila Amrani',
    role: 'Fondatrice & CEO',
    gradient: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)',
  },
  {
    name: 'Nadia Benali',
    role: 'Directrice Artistique',
    gradient: 'linear-gradient(135deg, #4A3528 0%, #B8924B 100%)',
  },
  {
    name: 'Sara El Fassi',
    role: 'Responsable Qualité',
    gradient: 'linear-gradient(135deg, #5A3D2B 0%, #C9A8A0 100%)',
  },
];

export function TeamSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
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
            L&apos;Équipe
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#3D2B1F]"
          >
            Les Visages Derrière la Marque
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {team.map((member) => (
            <motion.div key={member.name} variants={fadeInUp} className="flex flex-col">
              <div
                className="aspect-[3/4] w-full"
                style={{ background: member.gradient }}
              />
              <div className="pt-5 pb-2">
                <h3 className="font-playfair font-bold italic text-xl text-[#1A1410]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-inter font-semibold uppercase tracking-[0.08em] text-[#C9A875]">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
