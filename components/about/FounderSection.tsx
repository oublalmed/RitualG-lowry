'use client';

import { motion } from 'framer-motion';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/lib/animations';

export function FounderSection() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Image block */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="aspect-[4/5]"
            style={{
              background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)',
            }}
          />

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
              La Fondatrice
            </motion.p>
            <motion.h2
              variants={fadeInRight}
              className="text-3xl md:text-4xl font-playfair font-bold italic text-[#3D2B1F]"
            >
              Leila Amrani
            </motion.h2>
            <motion.p
              variants={fadeInRight}
              className="mt-6 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed"
            >
              Passionnée de beauté depuis l&apos;enfance, Leila a fondé Ritual Glowry après avoir
              vécu les frustrations de ne pas trouver d&apos;extensions qui correspondent à la
              diversité des textures capillaires africaines et méditerranéennes.
            </motion.p>
            <motion.p
              variants={fadeInRight}
              className="mt-4 text-sm font-inter text-[#3D2B1F]/70 leading-relaxed"
            >
              Forte de son expérience dans le secteur de la beauté et de sa passion pour
              l&apos;authenticité, elle a créé une marque qui célèbre chaque femme dans sa
              singularité.
            </motion.p>
            <motion.blockquote
              variants={fadeInRight}
              className="mt-8 pl-4 border-l-2 border-[#C9A875]"
            >
              <p className="text-lg font-cormorant italic text-[#3D2B1F]">
                &ldquo;Chaque femme mérite des extensions qui lui ressemblent vraiment.&rdquo;
              </p>
            </motion.blockquote>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
