'use client';

import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const milestones = [
  {
    year: '2019',
    title: 'La Genèse',
    description:
      'Leila lance les premières recherches sur les extensions capillaires premium adaptées aux femmes marocaines.',
  },
  {
    year: '2021',
    title: 'Premier Lancement',
    description:
      'Ritual Glowry ouvre ses portes en ligne avec sa première collection d\'extensions lisses naturelles.',
  },
  {
    year: '2023',
    title: 'Expansion',
    description:
      'Lancement des collections Bouclées et Afro. Partenariats avec 50+ coiffeurs au Maroc.',
  },
  {
    year: '2026',
    title: 'Aujourd\'hui',
    description:
      'Plus de 10 000 clientes satisfaites, présence dans 5 villes et une gamme de 30+ produits.',
  },
];

export function Timeline() {
  return (
    <section className="py-24 md:py-32 bg-[#1A1410]">
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
            Notre Parcours
          </motion.p>
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#FAF6EF]"
          >
            De la passion au succès
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {milestones.map((m, index) => (
            <motion.div
              key={m.year}
              variants={fadeInUp}
              className="relative flex flex-col"
            >
              {/* Connector line on desktop */}
              {index < milestones.length - 1 && (
                <div className="hidden md:block absolute top-4 left-[calc(50%+20px)] right-0 h-px bg-[#C9A875]/20" />
              )}

              <div className="flex flex-col items-start md:items-center md:text-center">
                <span className="text-3xl font-playfair font-bold italic text-[#C9A875]">
                  {m.year}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#C9A875] mt-2 mb-4 hidden md:block" />
                <h3 className="font-playfair font-bold italic text-lg text-[#FAF6EF] mt-2 md:mt-0">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm font-inter text-[#FAF6EF]/50 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
