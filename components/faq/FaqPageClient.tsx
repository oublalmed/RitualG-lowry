'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface FaqQuestion {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  questions: FaqQuestion[];
}

interface FaqPageClientProps {
  categories: FaqCategory[];
}

export function FaqPageClient({ categories }: FaqPageClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');
  const [searchTerm, setSearchTerm] = useState('');

  const currentCategory = categories.find((c) => c.id === activeCategory) ?? categories[0];

  // When searching: flatten all questions across all categories
  const searchResults = searchTerm.trim()
    ? categories.flatMap((cat) =>
        cat.questions
          .filter((q) => q.q.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((q) => ({ ...q, categoryLabel: cat.label }))
      )
    : [];

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-32 pb-20 flex items-center"
        style={{
          background: 'linear-gradient(160deg, #3D2B1F 0%, #1A1410 100%)',
        }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-4"
          >
            Aide
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-playfair font-bold italic text-white"
          >
            Questions Fréquentes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-lg font-cormorant italic text-white/70 max-w-lg mx-auto"
          >
            Tout ce que vous devez savoir sur Ritual Glowry
          </motion.p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-[#FAF6EF]">
        <div className="container mx-auto px-4 md:px-8 lg:px-12">
          {/* Search bar */}
          <div className="max-w-xl mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D2B1F]/40 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une question..."
                className="w-full bg-[#FAF6EF] border border-[#3D2B1F]/20 pl-10 pr-4 py-3 font-inter text-sm text-[#1A1410] placeholder:text-[#3D2B1F]/40 focus:outline-none focus:border-[#C9A875] transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-16">
            {/* Sidebar — categories */}
            <aside className="md:w-56 flex-shrink-0">
              <nav className="flex md:flex-col gap-2 flex-wrap md:sticky md:top-28">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-left px-4 py-2.5 text-sm font-inter font-semibold uppercase tracking-[0.06em] transition-colors duration-200 border-l-2 ${
                      activeCategory === cat.id
                        ? 'border-[#C9A875] text-[#C9A875] bg-[#C9A875]/5'
                        : 'border-transparent text-[#3D2B1F]/60 hover:text-[#3D2B1F] hover:border-[#3D2B1F]/20'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Accordion */}
            <motion.div
              key={searchTerm || activeCategory}
              className="flex-1"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl md:text-3xl font-playfair font-bold italic text-[#3D2B1F] mb-8"
              >
                {searchTerm.trim() ? `Résultats pour "${searchTerm}"` : currentCategory?.label}
              </motion.h2>

              {searchTerm.trim() && searchResults.length === 0 ? (
                <motion.div variants={fadeInUp} className="py-8">
                  <p className="font-inter text-sm text-[#3D2B1F]/60">
                    Aucun résultat pour &ldquo;{searchTerm}&rdquo;.{' '}
                    <a href="/contact" className="text-[#C9A875] hover:text-[#B8924B] transition-colors">
                      Contactez-nous →
                    </a>
                  </p>
                </motion.div>
              ) : (
                <Accordion className="space-y-3">
                  {(searchTerm.trim() ? searchResults : currentCategory?.questions ?? []).map((item, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                      <AccordionItem
                        value={`item-${index}`}
                        className="border border-[#3D2B1F]/10 bg-white px-6"
                      >
                        <AccordionTrigger className="font-inter font-semibold text-sm text-[#1A1410] hover:text-[#C9A875] hover:no-underline py-5 text-left">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="font-inter text-sm text-[#3D2B1F]/70 leading-relaxed pb-5">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              )}

              {/* Contact CTA */}
              <motion.div
                variants={fadeInUp}
                className="mt-12 p-8 bg-[#F5EDE0] text-center"
              >
                <h3 className="font-playfair font-bold italic text-xl text-[#3D2B1F] mb-2">
                  Vous n&apos;avez pas trouvé votre réponse ?
                </h3>
                <p className="text-sm font-inter text-[#3D2B1F]/60 mb-6">
                  Notre équipe est disponible pour vous aider.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-xs px-8 py-3 transition-colors duration-300"
                >
                  Contactez-nous
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
