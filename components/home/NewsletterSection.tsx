'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-24 md:py-32 bg-[#C9A875]">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-playfair font-bold italic text-[#1A1410] leading-tight"
          >
            Rejoignez le Club Glowry
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-4 text-base font-cormorant italic text-[#1A1410]/70"
          >
            Recevez nos conseils beauté, nos offres exclusives et −10% sur votre première commande.
          </motion.p>

          {submitted ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 font-inter font-semibold text-sm text-[#1A1410] uppercase tracking-[0.08em]"
            >
              ✓ Merci ! Votre réduction de 10% est en chemin.
            </motion.p>
          ) : (
            <motion.form
              variants={fadeInUp}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 bg-[#FAF6EF] border border-[#1A1410]/15 px-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#1A1410]/40 focus:outline-none focus:border-[#1A1410]/40 transition-colors"
              />
              <button
                type="submit"
                className="bg-[#1A1410] hover:bg-[#3D2B1F] text-[#FAF6EF] font-inter font-semibold uppercase tracking-[0.08em] text-xs px-8 py-3 transition-colors duration-300 whitespace-nowrap"
              >
                S&apos;abonner
              </button>
            </motion.form>
          )}

          <motion.p
            variants={fadeInUp}
            className="mt-4 text-xs font-inter text-[#1A1410]/50"
          >
            Nous respectons votre vie privée. Désabonnement en 1 clic.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
