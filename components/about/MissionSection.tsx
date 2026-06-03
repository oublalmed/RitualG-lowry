'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

// Woman getting hair done in a salon — beauty transformation
const MISSION_IMG = 'https://images.pexels.com/photos/7984818/pexels-photo-7984818.jpeg?auto=compress&cs=tinysrgb&w=900&h=1125&fit=crop';

const differentiators = [
  { label: 'Qualité rigoureusement sélectionnée', desc: 'Chaque produit passe par une sélection exigeante avant d\'arriver jusqu\'à vous' },
  { label: 'Expérience d\'achat rassurante', desc: 'Simple, claire et conçue pour la femme qui sait ce qu\'elle veut' },
  { label: 'Accompagnement personnalisé', desc: 'Nous sommes là à chaque étape, du choix jusqu\'à la pose' },
  { label: 'Univers raffiné et féminin', desc: 'Une marque construite autour de la confiance et de l\'estime de soi' },
];

export function MissionSection() {
  return (
    <section className="py-24 md:py-32 bg-[#F5EDE0]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p variants={fadeInLeft} className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4">
              Notre Différence
            </motion.p>
            <motion.h2 variants={fadeInLeft} className="text-3xl md:text-4xl font-playfair font-bold italic text-[#3D2B1F] leading-tight">
              Bien plus que des extensions
            </motion.h2>
            <motion.p variants={fadeInLeft} className="mt-5 text-sm font-inter text-[#3D2B1F]/65 leading-relaxed">
              Dans un marché où de nombreuses boutiques vendent simplement des cheveux,
              Ritual Glowry choisit de créer une véritable expérience. Notre ambition est
              de devenir une communauté de femmes qui osent rayonner, s&apos;affirmer et
              révéler leur beauté avec élégance.
            </motion.p>

            <motion.div variants={staggerContainer} className="mt-8 space-y-4">
              {differentiators.map((d) => (
                <motion.div key={d.label} variants={fadeInLeft} className="flex items-start gap-3">
                  <span className="mt-1 text-[#C9A875] font-bold text-sm flex-shrink-0">✓</span>
                  <div>
                    <p className="font-inter font-semibold text-sm text-[#3D2B1F]">{d.label}</p>
                    <p className="font-inter text-xs text-[#3D2B1F]/55 mt-0.5">{d.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <Image
              src={MISSION_IMG}
              alt="Expérience Ritual Glowry — beauté et transformation"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410]/55 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="bg-[#FAF6EF]/95 p-6">
                <p className="font-inter text-xs uppercase tracking-[0.12em] text-[#C9A875] mb-2">Notre ambition</p>
                <p className="font-cormorant italic text-lg text-[#3D2B1F] leading-snug">
                  &ldquo;Parce qu&apos;au-delà des cheveux, ce que nous célébrons avant tout,
                  c&apos;est la femme qui les porte.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
