import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/layout/HeroSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { FeaturedProducts } from '@/components/product/FeaturedProducts';
import { BrandManifesto } from '@/components/common/BrandManifesto';
import { TestimonialsSection } from '@/components/common/TestimonialsSection';
import { BeforeAfterSection } from '@/components/home/BeforeAfterSection';
import { StoryPreview } from '@/components/home/StoryPreview';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
  description:
    'Découvrez nos extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures — lisses, bouclées, afro. Livraison au Maroc.',
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://ritualglowry.com',
    siteName: 'Ritual Glowry',
    title: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
    description:
      'Découvrez nos extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ritual Glowry | Extensions & Perruques Premium au Maroc',
    description:
      'Découvrez nos extensions et perruques 100% naturelles cheveux Remy. Qualité premium pour toutes les textures.',
    site: '@ritualglowry',
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1 — Hero : émotion + preuve sociale */}
        <HeroSection />

        {/* 2 — Pourquoi Ritual Glowry (haut de page, avant les produits) */}
        <BrandManifesto />

        {/* 3 — Collections */}
        <CollectionsSection />

        {/* 4 — Best Sellers */}
        <FeaturedProducts />

        {/* 5 — Notre Histoire : âme de la marque */}
        <StoryPreview />

        {/* 6 — Témoignages clientes */}
        <TestimonialsSection />

        {/* 7 — Avant / Après */}
        <BeforeAfterSection />

        {/* 8 — Newsletter */}
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
