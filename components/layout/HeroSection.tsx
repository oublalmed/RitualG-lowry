"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-brand-ivory overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-brand-ivory to-brand-ivory opacity-80" />

      {/* Decorative circle */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #C9A875 0%, transparent 70%)" }}
      />

      {/* Content */}
      <div className="relative container mx-auto px-4 md:px-8 lg:px-12 pt-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="text-xs font-inter font-semibold uppercase tracking-[0.25em] text-brand-champagne mb-6">
            Premium Hair Rituals
          </p>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-playfair font-bold italic text-brand-dark leading-[1.1] mb-6">
            Your hair&apos;s{" "}
            <span className="text-brand-champagne">sacred</span>
            <br />
            ritual begins
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl font-cormorant text-brand-mocha/80 leading-relaxed mb-10 max-w-lg">
            Discover luxurious formulations crafted with rare botanicals and
            advanced science. For hair that doesn&apos;t just look beautiful —
            it <em>feels</em> it.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button className="bg-brand-champagne hover:bg-brand-gold text-white font-inter font-semibold uppercase tracking-[0.08em] px-8 py-6 h-auto text-sm transition-all duration-300 rounded-none">
                Shop the Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="border-brand-mocha text-brand-mocha hover:bg-brand-mocha hover:text-brand-ivory font-inter font-semibold uppercase tracking-[0.08em] px-8 py-6 h-auto text-sm transition-all duration-300 rounded-none bg-transparent"
              >
                Our Story
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-14 pt-10 border-t border-brand-mocha/10">
            <div className="text-center">
              <p className="text-2xl font-playfair font-bold text-brand-dark">50k+</p>
              <p className="text-xs font-inter text-brand-mocha/60 uppercase tracking-wider mt-1">
                Happy Clients
              </p>
            </div>
            <div className="w-px h-10 bg-brand-mocha/15" />
            <div className="text-center">
              <p className="text-2xl font-playfair font-bold text-brand-dark">4.9</p>
              <p className="text-xs font-inter text-brand-mocha/60 uppercase tracking-wider mt-1">
                Avg. Rating
              </p>
            </div>
            <div className="w-px h-10 bg-brand-mocha/15" />
            <div className="text-center">
              <p className="text-2xl font-playfair font-bold text-brand-dark">100%</p>
              <p className="text-xs font-inter text-brand-mocha/60 uppercase tracking-wider mt-1">
                Natural Actives
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
