import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturedProducts } from "@/components/product/FeaturedProducts";
import { BrandManifesto } from "@/components/common/BrandManifesto";
import { TestimonialsSection } from "@/components/common/TestimonialsSection";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BrandManifesto />
        <FeaturedProducts />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
