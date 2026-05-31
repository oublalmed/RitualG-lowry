"use client";

const testimonials = [
  {
    id: 1,
    quote:
      "The Ritual Repair Masque completely transformed my damaged hair. After just three uses, the difference was unbelievable.",
    author: "Amara L.",
    location: "New York",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "I've tried countless luxury hair brands, and none compare to Ritual Glowry. The scent alone is worth it.",
    author: "Isabelle M.",
    location: "Paris",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "Finally, a brand that understands fine hair. Lightweight, effective, and the packaging is stunning.",
    author: "Priya S.",
    location: "London",
    rating: 5,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-brand-champagne fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32 bg-brand-cream">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs font-inter font-semibold uppercase tracking-[0.25em] text-brand-champagne mb-3">
            Real Results
          </p>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold italic text-brand-dark">
            What our clients say
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-brand-ivory p-8 flex flex-col"
            >
              <StarRating count={testimonial.rating} />
              <blockquote className="mt-5 flex-1">
                <p className="text-lg font-cormorant italic text-brand-mocha leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <footer className="mt-6 pt-6 border-t border-brand-mocha/10">
                <p className="font-inter font-semibold text-sm text-brand-dark">
                  {testimonial.author}
                </p>
                <p className="font-inter text-xs text-brand-mocha/60 mt-0.5">
                  {testimonial.location}
                </p>
              </footer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
