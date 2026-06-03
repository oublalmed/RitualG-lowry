import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from './ProductSkeleton';

export interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  basePrice: number;
  comparePrice?: number | null;
  stockStatus?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  productType?: string[];
  texture?: string[];
  category?: { _id: string; name: string; slug: string };
  images?: any;
  variantCount?: number;
}

interface ProductGridProps {
  products: SanityProduct[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

// Gradient array for product cards
const gradients = [
  'linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 100%)',
  'linear-gradient(135deg, #4A3528 0%, #C9A875 100%)',
  'linear-gradient(135deg, #5A3D2B 0%, #B8924B 100%)',
  'linear-gradient(135deg, #3D2B1F 0%, #C9A8A0 100%)',
  'linear-gradient(135deg, #2C1F17 0%, #7A5435 100%)',
  'linear-gradient(135deg, #6B3A2A 0%, #C9A875 100%)',
];

export function ProductGrid({ products, isLoading = false, onResetFilters }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div
          className="w-24 h-24 rounded-full mb-6 flex items-center justify-center text-4xl"
          style={{ background: 'linear-gradient(135deg, #F5EDE0 0%, #EDE0CF 100%)' }}
        >
          🪮
        </div>
        <h3 className="font-playfair font-bold text-xl text-[#3D2B1F] mb-2">
          Aucun produit trouvé
        </h3>
        <p className="font-inter text-sm text-[#3D2B1F]/60 mb-6 max-w-xs">
          Essayez de modifier vos filtres pour voir plus de produits.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="font-inter text-sm font-semibold uppercase tracking-wider text-[#1A1410] border border-[#C9A875] px-6 py-3 hover:bg-[#C9A875] hover:text-[#FAF6EF] transition-colors duration-200"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={{
            id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.basePrice,
            comparePrice: product.comparePrice,
            isNew: product.isNew,
            isBestSeller: product.isBestSeller,
            description: product.shortDescription,
            image: (product.images as any)?.[0]?.asset?.url ?? null,
            category: product.category?.name,
            stockStatus: product.stockStatus,
          }}
        />
      ))}
    </div>
  );
}
