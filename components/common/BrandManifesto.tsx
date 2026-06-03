'use client';

import { motion } from 'framer-motion';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

const reasons = [
  { check: '✓', title: 'Cheveux premium', desc: 'Extensions 100% naturelles Remy, sélectionnées avec exigence' },
  { check: '✓', title: 'Effet naturel', desc: 'Se fondent parfaitement avec vos cheveux' },
  { check: '✓', title: 'Longue durée', desc: 'Conçues pour durer, faciles à entretenir' },
  { check: '✓', title: 'Livraison rapide', desc: 'Expédition sous 24h au Maroc' },
  { check: '✓', title: 'Garantie satisfaction', desc: 'Retours gratuits sous 30 jours' },
];

export function BrandManifesto() {
  return (
    <section className="py-20 md:py-28 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — emotional quote block */}
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
              Pourquoi nous choisissent
            </motion.p>
            <motion.h2
              variants={fadeInLeft}
              className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold italic text-[#3D2B1F] leading-tight"
            >
              Pourquoi Ritual Glowry ?
            </motion.h2>
            <motion.p
              variants={fadeInLeft}
              className="mt-5 text-sm font-inter text-[#3D2B1F]/65 leading-relaxed max-w-md"
            >
              Nous ne proposons pas simplement des extensions. Nous proposons une transformation —
              la confiance de vous sentir belle, élégante et profondément vous-même.
            </motion.p>

            {/* Brand tagline */}
            <motion.blockquote
              variants={fadeInLeft}
              className="mt-8 pl-5 border-l-2 border-[#C9A875]"
            >
              <p className="text-xl font-cormorant italic text-[#3D2B1F]/80">
                &ldquo;Votre beauté, notre rituel.&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>

          {/* Right — checklist */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5"
          >
            {reasons.map((r) => (
              <motion.div
                key={r.title}
                variants={fadeInRight}
                className="flex items-start gap-4 p-4 border border-[#C9A875]/20 hover:border-[#C9A875]/50 transition-colors duration-300"
              >
                <span className="mt-0.5 text-[#C9A875] font-inter font-bold text-base flex-shrink-0">
                  {r.check}
                </span>
                <div>
                  <p className="font-inter font-semibold text-sm text-[#3D2B1F]">{r.title}</p>
                  <p className="font-inter text-xs text-[#3D2B1F]/55 mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
