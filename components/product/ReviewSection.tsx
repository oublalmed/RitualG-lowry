'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { StarRating } from '@/components/common/StarRating';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface ReviewSectionProps {
  rating: number;
  reviewCount: number;
}

interface MockReview {
  id: string;
  author: string;
  initials: string;
  date: string;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  hasPhoto: boolean;
}

const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'r1',
    author: 'Fatima B.',
    initials: 'FB',
    date: '12 mai 2025',
    rating: 5,
    title: 'Qualité exceptionnelle !',
    comment:
      'Ces extensions ont complètement transformé ma coiffure. La texture est incroyablement naturelle et se mélange parfaitement avec mes cheveux. Je recommande vivement Ritual Glowry à toutes mes amies.',
    verified: true,
    hasPhoto: true,
  },
  {
    id: 'r2',
    author: 'Nadia K.',
    initials: 'NK',
    date: '3 avril 2025',
    rating: 5,
    title: 'Livraison rapide, produit parfait',
    comment:
      'Reçu en 3 jours, emballage soigné et luxueux. La qualité est au rendez-vous — j\'ai déjà commandé deux fois. Le soin post-application est simple et les extensions tiennent très bien dans le temps.',
    verified: true,
    hasPhoto: false,
  },
  {
    id: 'r3',
    author: 'Sara M.',
    initials: 'SM',
    date: '18 mars 2025',
    rating: 4,
    title: 'Très satisfaite, petit bémol sur la couleur',
    comment:
      'La qualité des cheveux est magnifique et très douce au toucher. La couleur est légèrement plus claire que sur les photos, mais après quelques jours ça se mélange très bien. Je rachèterai sans hésiter.',
    verified: true,
    hasPhoto: false,
  },
];

const DISTRIBUTION = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 15 },
  { stars: 3, pct: 5 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

type FilterTab = 'all' | 'photos' | '5' | '4' | '3';

export function ReviewSection({ rating, reviewCount }: ReviewSectionProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const filtered = MOCK_REVIEWS.filter((r) => {
    if (activeTab === 'photos') return r.hasPhoto;
    if (activeTab === '5') return r.rating === 5;
    if (activeTab === '4') return r.rating === 4;
    if (activeTab === '3') return r.rating === 3;
    return true;
  });

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'Tous' },
    { id: 'photos', label: 'Avec photos' },
    { id: '5', label: '★ 5' },
    { id: '4', label: '★ 4' },
    { id: '3', label: '★ 3' },
  ];

  return (
    <section id="reviews" className="pt-16 pb-8">
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="font-playfair italic font-bold text-2xl text-[#3D2B1F] mb-8"
      >
        Avis Clients
      </motion.h2>

      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 pb-10 border-b border-[#3D2B1F]/10">
        {/* Score */}
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="font-playfair font-bold text-6xl text-[#3D2B1F]">{rating}</span>
          <StarRating rating={rating} size="lg" />
          <p className="font-inter text-sm text-[#3D2B1F]/60">{reviewCount} avis vérifiés</p>
        </div>

        {/* Distribution */}
        <div className="space-y-2.5">
          {DISTRIBUTION.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="font-inter text-xs text-[#3D2B1F]/60 w-3 text-right">
                {stars}★
              </span>
              <div className="flex-1 h-1.5 bg-[#3D2B1F]/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 * (5 - stars) }}
                  className="h-full bg-[#C9A875] rounded-full"
                />
              </div>
              <span className="font-inter text-xs text-[#3D2B1F]/50 w-8">{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 border font-inter text-xs transition-colors duration-150 ${
              activeTab === tab.id
                ? 'bg-[#C9A875] border-[#C9A875] text-[#1A1410] font-semibold'
                : 'bg-white border-[#3D2B1F]/15 text-[#3D2B1F]/70 hover:border-[#C9A875]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review cards */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="space-y-6"
      >
        {filtered.length === 0 ? (
          <p className="font-inter text-sm text-[#3D2B1F]/50 text-center py-8">
            Aucun avis pour ce filtre.
          </p>
        ) : (
          filtered.map((review) => (
            <motion.div
              key={review.id}
              variants={fadeInUp}
              className="p-6 bg-white border border-[#3D2B1F]/8 rounded-sm"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#3D2B1F] flex items-center justify-center flex-shrink-0">
                  <span className="font-inter font-semibold text-xs text-[#C9A875]">
                    {review.initials}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-inter font-semibold text-sm text-[#1A1410]">
                        {review.author}
                      </span>
                      {review.verified && (
                        <span className="flex items-center gap-1 font-inter text-xs text-[#C9A875] bg-[#C9A875]/10 px-2 py-0.5 rounded-full">
                          <BadgeCheck className="h-3 w-3" />
                          Vérifié
                        </span>
                      )}
                    </div>
                    <span className="font-inter text-xs text-[#3D2B1F]/40">{review.date}</span>
                  </div>

                  <div className="mt-1.5 mb-2">
                    <StarRating rating={review.rating} size="sm" />
                  </div>

                  <p className="font-inter font-semibold text-sm text-[#1A1410] mb-1.5">
                    {review.title}
                  </p>
                  <p className="font-cormorant text-base text-[#3D2B1F]/75 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </section>
  );
}
