"use client";

export function BrandManifesto() {
  const pillars = [
    {
      number: "01",
      title: "Botanically Sourced",
      description:
        "Every ingredient is ethically sourced from the world's richest botanicals — from Moroccan argan groves to Brazilian rainforests.",
    },
    {
      number: "02",
      title: "Science-Backed",
      description:
        "Our formulations are developed by leading trichologists and chemists to deliver results that are clinically proven.",
    },
    {
      number: "03",
      title: "Cruelty-Free",
      description:
        "We never test on animals. Our products are vegan, free of harmful chemicals, and certified by Leaping Bunny.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-brand-mocha">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Centered tagline */}
        <div className="text-center mb-20">
          <p className="text-xs font-inter font-semibold uppercase tracking-[0.25em] text-brand-champagne mb-4">
            Our Philosophy
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold italic text-brand-ivory leading-tight max-w-2xl mx-auto">
            Beauty rooted in ritual
          </h2>
          <p className="mt-6 text-lg font-cormorant text-brand-cream/70 max-w-xl mx-auto leading-relaxed">
            We believe beautiful hair is a daily ceremony — one that deserves
            only the finest, most thoughtfully crafted ingredients.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="flex flex-col border-t border-brand-champagne/20 pt-8"
            >
              <span className="text-xs font-inter font-semibold text-brand-champagne/50 tracking-widest mb-4">
                {pillar.number}
              </span>
              <h3 className="text-xl font-playfair font-bold italic text-brand-ivory mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm font-cormorant text-brand-cream/60 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
