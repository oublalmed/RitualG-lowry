'use client';

import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

export function FounderSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Visual */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/5]"
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
            />
            <div className="absolute bottom-8 left-6 right-6 bg-[#FAF6EF]/95 p-5 border-l-2 border-[#C9A875]">
              <p className="font-cormorant italic text-base text-[#3D2B1F] leading-snug">
                &ldquo;Votre beauté, notre rituel.&rdquo;
              </p>
              <p className="font-inter text-xs text-[#3D2B1F]/50 mt-2 uppercase tracking-wider">
                — Ritual Glowry
              </p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={fadeInRight}
              className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
            >
              L&apos;Origine de la Marque
            </motion.p>
            <motion.h2
              variants={fadeInRight}
              className="text-3xl md:text-4xl font-playfair font-bold italic text-[#3D2B1F] leading-tight"
            >
              Une conviction, une mission
            </motion.h2>

            <motion.p variants={fadeInRight} className="mt-6 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed">
              Ritual Glowry est née d&apos;une conviction simple : les cheveux ne sont pas un simple
              accessoire de beauté. Ils sont une expression de soi, de sa féminité, de sa confiance
              et de son identité.
            </motion.p>

            <motion.p variants={fadeInRight} className="mt-4 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed">
              Le nom de la marque est le reflet de cette vision.{' '}
              <strong className="text-[#3D2B1F] font-semibold">Ritual</strong> représente ces gestes
              de beauté que chaque femme s&apos;accorde pour prendre soin d&apos;elle, se reconnecter
              à elle-même et révéler la meilleure version d&apos;elle-même.{' '}
              <strong className="text-[#3D2B1F] font-semibold">Glowry</strong> est la rencontre entre
              les mots <em>Glow</em> (éclat, rayonnement) et <em>Glory</em> (fierté, grandeur,
              accomplissement).
            </motion.p>

            <motion.p variants={fadeInRight} className="mt-4 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed">
              Ensemble, ils symbolisent une femme qui rayonne de l&apos;extérieur tout en affirmant
              sa force et sa confiance intérieure.
            </motion.p>

            <motion.blockquote
              variants={fadeInRight}
              className="mt-8 pl-5 border-l-2 border-[#C9A875]"
            >
              <p className="text-lg font-cormorant italic text-[#3D2B1F]">
                &ldquo;Au-delà des cheveux, ce que nous célébrons avant tout, c&apos;est
                la femme qui les porte.&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
