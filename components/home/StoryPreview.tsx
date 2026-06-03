'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

export function StoryPreview() {
  return (
    <section className="py-24 md:py-32 bg-[#3D2B1F]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* Left — photo with quote overlay */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/5] w-full overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=900&q=85&auto=format&fit=crop"
              alt="Femme confiante et élégante avec extensions Ritual Glowry"
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-[#1A1410]/30" />
            {/* Floating quote */}
            <div className="absolute bottom-8 left-6 right-6 bg-[#1A1410]/80 backdrop-blur-sm p-6 border-l-2 border-[#C9A875]">
              <p className="font-cormorant italic text-lg text-white/90 leading-snug">
                &ldquo;Ritual Glowry n&apos;est pas seulement une boutique d&apos;extensions.
                C&apos;est une marque pensée pour accompagner les femmes dans leur désir
                de se sentir belles, élégantes et confiantes.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right — brand story */}
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
              Notre Histoire
            </motion.p>
            <motion.h2
              variants={fadeInRight}
              className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold italic text-[#FAF6EF] leading-tight"
            >
              Née d&apos;une conviction profonde
            </motion.h2>

            <motion.p
              variants={fadeInRight}
              className="mt-6 text-sm font-inter text-[#FAF6EF]/65 leading-relaxed"
            >
              Ritual Glowry est née d&apos;une conviction simple : les cheveux ne sont pas
              un simple accessoire de beauté. Ils sont une expression de soi, de sa féminité,
              de sa confiance et de son identité.
            </motion.p>

            <motion.p
              variants={fadeInRight}
              className="mt-4 text-sm font-inter text-[#FAF6EF]/65 leading-relaxed"
            >
              <span className="text-[#C9A875] font-semibold">Ritual</span> représente ces gestes
              de beauté que chaque femme s&apos;accorde pour prendre soin d&apos;elle-même.{' '}
              <span className="text-[#C9A875] font-semibold">Glowry</span> est la rencontre entre
              Glow (éclat) et Glory (fierté). Ensemble, ils symbolisent une femme qui rayonne
              de l&apos;extérieur tout en affirmant sa force intérieure.
            </motion.p>

            <motion.p
              variants={fadeInRight}
              className="mt-4 text-sm font-inter text-[#FAF6EF]/65 leading-relaxed"
            >
              Nous sélectionnons chaque produit avec une exigence particulière sur la qualité,
              l&apos;aspect naturel et le confort — pour des femmes qui recherchent
              l&apos;excellence sans compromis.
            </motion.p>

            <motion.div variants={fadeInRight} className="mt-8">
              <Link
                href="/a-propos"
                className="inline-flex items-center gap-2 font-inter font-semibold text-sm text-[#C9A875] hover:text-[#FAF6EF] transition-colors group"
              >
                Lire notre histoire complète
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
