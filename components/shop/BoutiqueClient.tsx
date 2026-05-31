'use client';

import { useCallback, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

import { mockProducts } from '@/lib/mockData';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { FilterSidebar, type FilterState } from '@/components/shop/FilterSidebar';
import { ProductGrid } from '@/components/shop/ProductGrid';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fadeInUp, staggerContainer } from '@/lib/animations';

type SortOption = 'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'popular';

const DEFAULT_FILTERS: FilterState = {
  types: [],
  textures: [],
  minPrice: 0,
  maxPrice: 2000,
  minLength: 30,
  maxLength: 80,
  state: '',
};

function parseFiltersFromParams(params: URLSearchParams): FilterState {
  const types = params.get('types') ? params.get('types')!.split(',').filter(Boolean) : [];
  const textures = params.get('textures') ? params.get('textures')!.split(',').filter(Boolean) : [];
  const minPrice = Number(params.get('minPrice') ?? 0);
  const maxPrice = Number(params.get('maxPrice') ?? 2000);
  const minLength = Number(params.get('minLength') ?? 30);
  const maxLength = Number(params.get('maxLength') ?? 80);
  const state = (params.get('state') ?? '') as FilterState['state'];

  return { types, textures, minPrice, maxPrice, minLength, maxLength, state };
}

function buildSearchParams(filters: FilterState, sort: SortOption): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.types.length) params.set('types', filters.types.join(','));
  if (filters.textures.length) params.set('textures', filters.textures.join(','));
  if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice < 2000) params.set('maxPrice', String(filters.maxPrice));
  if (filters.minLength > 30) params.set('minLength', String(filters.minLength));
  if (filters.maxLength < 80) params.set('maxLength', String(filters.maxLength));
  if (filters.state) params.set('state', filters.state);
  if (sort !== 'relevance') params.set('sort', sort);
  return params;
}

export function BoutiqueClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);
  const sort = (searchParams.get('sort') ?? 'relevance') as SortOption;

  const updateURL = useCallback(
    (newFilters: FilterState, newSort: SortOption) => {
      const params = buildSearchParams(newFilters, newSort);
      const qs = params.toString();
      startTransition(() => {
        router.push(`/boutique${qs ? `?${qs}` : ''}`);
      });
    },
    [router]
  );

  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => updateURL(newFilters, sort),
    [updateURL, sort]
  );

  const handleReset = useCallback(() => {
    startTransition(() => {
      router.push('/boutique');
    });
    setMobileOpen(false);
  }, [router]);

  const handleSort = useCallback(
    (value: string) => updateURL(filters, value as SortOption),
    [updateURL, filters]
  );

  const filteredProducts = useMemo(() => {
    let results = [...mockProducts];

    if (filters.types.length) {
      results = results.filter((p) =>
        p.productType.some((t) => filters.types.includes(t))
      );
    }

    if (filters.textures.length) {
      results = results.filter((p) =>
        p.texture.some((t) => filters.textures.includes(t))
      );
    }

    results = results.filter(
      (p) => p.basePrice >= filters.minPrice && p.basePrice <= filters.maxPrice
    );

    if (filters.minLength > 30 || filters.maxLength < 80) {
      results = results.filter((p) => {
        const lengths = p.variants.map((v) => v.length).filter((l) => l > 0);
        if (!lengths.length) return true;
        return lengths.some((l) => l >= filters.minLength && l <= filters.maxLength);
      });
    }

    if (filters.state === 'new') {
      results = results.filter((p) => p.isNew);
    } else if (filters.state === 'bestseller') {
      results = results.filter((p) => p.isBestSeller);
    } else if (filters.state === 'promo') {
      results = results.filter((p) => p.comparePrice !== null);
    }

    switch (sort) {
      case 'newest':
        results = results.filter((p) => p.isNew).concat(results.filter((p) => !p.isNew));
        break;
      case 'price-asc':
        results.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        results.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'popular':
        results.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return results;
  }, [filters, sort]);

  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      {/* Hero strip */}
      <div className="bg-[#F5EDE0] border-b border-[#3D2B1F]/8 px-6 md:px-12 py-8">
        <div className="max-w-screen-xl mx-auto">
          <Breadcrumb
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Boutique' },
            ]}
            className="mb-4"
          />
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="font-playfair italic font-bold text-3xl md:text-4xl text-[#3D2B1F]"
          >
            Notre Boutique
          </motion.h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-10">
        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onChange={handleFiltersChange}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-7 gap-4">
              <p className="font-inter text-sm text-[#3D2B1F]/60">
                <span className="font-semibold text-[#3D2B1F]">{filteredProducts.length}</span>{' '}
                produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
              </p>

              <div className="flex items-center gap-3">
                {/* Sort select */}
                <Select value={sort} onValueChange={(v) => { if (v !== null) handleSort(v); }}>
                  <SelectTrigger className="w-44 h-9 font-inter text-xs border-[#3D2B1F]/20 bg-white text-[#3D2B1F]">
                    <SelectValue />
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                  </SelectTrigger>
                  <SelectContent className="font-inter text-xs">
                    <SelectItem value="relevance">Pertinence</SelectItem>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="popular">Popularité</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile filter trigger */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger
                    render={
                      <button className="lg:hidden flex items-center gap-2 h-9 px-4 border border-[#3D2B1F]/20 bg-white font-inter text-xs text-[#3D2B1F] hover:border-[#C9A875] transition-colors">
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        Filtres
                      </button>
                    }
                  />
                  <SheetContent side="left" className="w-[300px] sm:max-w-[300px] overflow-y-auto bg-[#FAF6EF]">
                    <SheetHeader className="pb-4 border-b border-[#3D2B1F]/10">
                      <SheetTitle className="font-playfair text-[#3D2B1F] text-base">
                        Filtres
                      </SheetTitle>
                    </SheetHeader>
                    <div className="pt-4 px-1">
                      <FilterSidebar
                        filters={filters}
                        onChange={(f) => {
                          handleFiltersChange(f);
                        }}
                        onReset={handleReset}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Product grid */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <ProductGrid
                products={filteredProducts}
                isLoading={isPending}
                onResetFilters={handleReset}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
