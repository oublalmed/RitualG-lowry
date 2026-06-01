'use client';

import { useMemo } from 'react';
import type { ProductVariant } from '@/lib/types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onSelect: (variant: ProductVariant) => void;
  basePrice: number;
}

export function ProductVariantSelector({
  variants,
  selectedVariant,
  onSelect,
  basePrice,
}: ProductVariantSelectorProps) {
  // Get unique colors preserving order
  const uniqueColors = useMemo(() => {
    const seen = new Set<string>();
    return variants
      .filter((v) => {
        if (seen.has(v.color.hexCode)) return false;
        seen.add(v.color.hexCode);
        return true;
      })
      .map((v) => v.color);
  }, [variants]);

  // Variants for selected color (or all if no color concept)
  const hasLengthVariants = variants.some((v) => v.length > 0);
  const selectedColor = selectedVariant?.color ?? uniqueColors[0];

  const lengthVariants = useMemo(
    () => variants.filter((v) => v.color.hexCode === selectedColor?.hexCode),
    [variants, selectedColor]
  );

  const handleColorSelect = (hexCode: string) => {
    const firstForColor = variants.find((v) => v.color.hexCode === hexCode && v.isAvailable);
    if (firstForColor) onSelect(firstForColor);
  };

  const handleLengthSelect = (variant: ProductVariant) => {
    if (variant.isAvailable) onSelect(variant);
  };

  const priceDiff = (price: number) => {
    const diff = price - basePrice;
    if (diff === 0) return null;
    return diff > 0 ? `+${diff} MAD` : `${diff} MAD`;
  };

  return (
    <div className="space-y-5">
      {/* Color selector */}
      {uniqueColors.length > 1 && (
        <div className="space-y-2.5">
          <p className="font-inter text-sm text-[#3D2B1F]">
            Couleur:{' '}
            <span className="font-semibold">
              {selectedVariant?.color.name ?? uniqueColors[0]?.name}
            </span>
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {uniqueColors.map((color) => (
              <div key={color.hexCode} className="relative group">
                {/* Tooltip */}
                <div
                  className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150
                    bg-[#F5EDE0] border border-[#C9A875]/40 rounded px-2 py-1 whitespace-nowrap shadow-sm"
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-full flex-shrink-0 ring-1 ring-[#3D2B1F]/20"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="font-inter text-xs text-[#3D2B1F]">{color.name}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleColorSelect(color.hexCode)}
                  className={`w-7 h-7 rounded-full transition-all duration-150 ${
                    selectedColor?.hexCode === color.hexCode
                      ? 'ring-2 ring-[#C9A875] ring-offset-2'
                      : 'ring-1 ring-[#3D2B1F]/20 hover:ring-[#C9A875]/60 hover:ring-offset-1'
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  aria-label={color.name}
                  aria-pressed={selectedColor?.hexCode === color.hexCode}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Length selector */}
      {hasLengthVariants && (
        <div className="space-y-2.5">
          <p className="font-inter text-sm text-[#3D2B1F]">
            Longueur:{' '}
            <span className="font-semibold">
              {selectedVariant?.length ? `${selectedVariant.length} cm` : '—'}
            </span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {lengthVariants.map((variant) => {
              const isSelected = selectedVariant?.label === variant.label;
              const diff = priceDiff(variant.price);

              return (
                <button
                  key={variant.label}
                  onClick={() => handleLengthSelect(variant)}
                  disabled={!variant.isAvailable}
                  className={`px-4 py-2 border font-inter text-xs transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-[#C9A875] border-[#C9A875] text-[#1A1410] font-semibold'
                      : 'bg-white border-[#3D2B1F]/20 text-[#3D2B1F] hover:border-[#C9A875]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {variant.length} cm
                  {diff && (
                    <span className={`ml-1.5 opacity-70 ${isSelected ? '' : 'text-[#C9A875]'}`}>
                      {diff}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Non-length variants (e.g. accessories with just label) */}
      {!hasLengthVariants && variants.length > 1 && (
        <div className="space-y-2.5">
          <p className="font-inter text-sm text-[#3D2B1F]">
            Option:{' '}
            <span className="font-semibold">{selectedVariant?.label ?? variants[0]?.label}</span>
          </p>
          <div className="flex gap-2 flex-wrap">
            {variants.map((variant) => {
              const isSelected = selectedVariant?.label === variant.label;
              return (
                <button
                  key={variant.label}
                  onClick={() => handleLengthSelect(variant)}
                  disabled={!variant.isAvailable}
                  className={`px-4 py-2 border font-inter text-xs transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-[#C9A875] border-[#C9A875] text-[#1A1410] font-semibold'
                      : 'bg-white border-[#3D2B1F]/20 text-[#3D2B1F] hover:border-[#C9A875]'
                  }`}
                  aria-pressed={isSelected}
                >
                  {variant.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
