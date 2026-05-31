import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./ProductCard";

// Placeholder product data until Sanity is connected
const featuredProducts = [
  {
    id: "1",
    slug: "ritual-repair-masque",
    name: "Ritual Repair Masque",
    category: "Treatment",
    price: 58,
    originalPrice: null,
    description: "Deep-conditioning masque with Moroccan argan and baobab proteins",
    imagePlaceholder: "#E8D5C0",
    badge: "Bestseller",
  },
  {
    id: "2",
    slug: "luminous-shampoo",
    name: "Luminous Cleansing Shampoo",
    category: "Shampoo",
    price: 38,
    originalPrice: null,
    description: "Sulfate-free formula that cleanses without stripping natural oils",
    imagePlaceholder: "#D6C5B8",
    badge: "New",
  },
  {
    id: "3",
    slug: "silk-serum",
    name: "Silk Gloss Serum",
    category: "Serum",
    price: 72,
    originalPrice: null,
    description: "Lightweight serum that adds mirror-like shine and frizz control",
    imagePlaceholder: "#C9B8A8",
    badge: null,
  },
  {
    id: "4",
    slug: "velvet-conditioner",
    name: "Velvet Conditioner",
    category: "Conditioner",
    price: 44,
    originalPrice: null,
    description: "Intensely nourishing conditioner for soft, manageable hair",
    imagePlaceholder: "#BCA898",
    badge: null,
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 md:py-32 bg-brand-ivory">
      <div className="container mx-auto px-4 md:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <p className="text-xs font-inter font-semibold uppercase tracking-[0.25em] text-brand-champagne mb-3">
              Curated Selection
            </p>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold italic text-brand-dark">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-sm font-inter font-semibold uppercase tracking-widest text-brand-mocha hover:text-brand-champagne transition-colors group"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
