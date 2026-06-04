'use client';

import { Award, Heart, Users } from 'lucide-react';

const badges = [
  {
    icon: Award,
    title: 'Sélectionné avec soin',
    desc: 'Les meilleures qualités de cheveux',
  },
  {
    icon: Heart,
    title: 'Satisfaction cliente',
    desc: 'Notre priorité absolue',
  },
  {
    icon: Users,
    title: 'Communauté',
    desc: 'Des milliers de femmes nous font confiance',
  },
];

export function TrustBar() {
  return (
    <section className="bg-[#F5EDE0] border-y border-[#C9A875]/15">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-5">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">

          {/* Left — brand tagline */}
          <div className="md:w-64 flex-shrink-0 text-center md:text-left md:border-r md:border-[#C9A875]/20 md:pr-8">
            <p className="text-xs font-inter font-semibold uppercase tracking-[0.15em] text-[#C9A875] mb-1">
              Notre Engagement
            </p>
            <p
              className="text-xl text-[#3D2B1F] leading-snug"
              style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
            >
              Votre beauté, notre rituel.
            </p>
          </div>

          {/* Center — badges */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 md:px-8">
            {badges.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3 text-center sm:text-left">
                <div className="w-9 h-9 rounded-full border border-[#C9A875]/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-4 w-4 text-[#C9A875]" />
                </div>
                <div>
                  <p className="text-xs font-inter font-semibold uppercase tracking-[0.1em] text-[#3D2B1F]">
                    {title}
                  </p>
                  <p className="text-xs font-inter text-[#3D2B1F]/55 mt-0.5">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Belgium flag */}
          <div className="md:w-24 flex-shrink-0 flex items-center justify-center md:justify-end md:border-l md:border-[#C9A875]/20 md:pl-8">
            <div className="flex flex-col items-center gap-1">
              {/* Belgium flag SVG */}
              <svg width="44" height="32" viewBox="0 0 44 32" className="rounded-sm shadow-sm">
                <rect width="14.67" height="32" fill="#1A1410" />
                <rect x="14.67" width="14.67" height="32" fill="#FDDA24" />
                <rect x="29.33" width="14.67" height="32" fill="#EF3340" />
              </svg>
              <p className="text-[10px] font-inter text-[#3D2B1F]/40 uppercase tracking-widest">
                Belgique
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
