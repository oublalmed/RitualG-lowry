'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

export interface FilterState {
  types: string[];
  textures: string[];
  minPrice: number;
  maxPrice: number;
  minLength: number;
  maxLength: number;
  state: 'new' | 'bestseller' | 'promo' | '';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalProducts?: number;
}

const PRODUCT_TYPES = [
  { value: 'extensions', label: 'Extensions' },
  { value: 'perruque', label: 'Perruques' },
  { value: 'accessoire', label: 'Accessoires' },
];

const TEXTURES = [
  { value: 'lisse', label: 'Lisse' },
  { value: 'bouclée', label: 'Bouclée' },
  { value: 'afro', label: 'Afro' },
  { value: 'ondulée', label: 'Ondulée' },
];

const STATES = [
  { value: '', label: 'Tous' },
  { value: 'new', label: 'Nouveautés' },
  { value: 'bestseller', label: 'Best-sellers' },
  { value: 'promo', label: 'En promo' },
];

export function FilterSidebar({ filters, onChange, onReset }: FilterSidebarProps) {
  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.textures.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 2000 ||
    filters.minLength > 30 ||
    filters.maxLength < 80 ||
    filters.state !== '';

  const toggleType = (value: string) => {
    const types = filters.types.includes(value)
      ? filters.types.filter((t) => t !== value)
      : [...filters.types, value];
    onChange({ ...filters, types });
  };

  const toggleTexture = (value: string) => {
    const textures = filters.textures.includes(value)
      ? filters.textures.filter((t) => t !== value)
      : [...filters.textures, value];
    onChange({ ...filters, textures });
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-inter font-semibold text-sm uppercase tracking-[0.12em] text-[#1A1410]">
          Filtres
        </h2>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-inter text-[#C9A875] hover:text-[#B8924B] transition-colors"
          >
            <X className="h-3 w-3" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#3D2B1F]/10" />

      {/* Type de produit */}
      <div className="space-y-3">
        <h3 className="font-inter text-xs font-semibold uppercase tracking-widest text-[#3D2B1F]/60">
          Type de produit
        </h3>
        <div className="space-y-2.5">
          {PRODUCT_TYPES.map((type) => (
            <div key={type.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`type-${type.value}`}
                checked={filters.types.includes(type.value)}
                onCheckedChange={() => toggleType(type.value)}
                className="border-[#C9A875] data-[state=checked]:bg-[#C9A875] data-[state=checked]:border-[#C9A875]"
              />
              <Label
                htmlFor={`type-${type.value}`}
                className="text-sm font-inter text-[#3D2B1F] cursor-pointer select-none"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#3D2B1F]/10" />

      {/* Texture */}
      <div className="space-y-3">
        <h3 className="font-inter text-xs font-semibold uppercase tracking-widest text-[#3D2B1F]/60">
          Texture
        </h3>
        <div className="space-y-2.5">
          {TEXTURES.map((tex) => (
            <div key={tex.value} className="flex items-center gap-2.5">
              <Checkbox
                id={`tex-${tex.value}`}
                checked={filters.textures.includes(tex.value)}
                onCheckedChange={() => toggleTexture(tex.value)}
                className="border-[#C9A875] data-[state=checked]:bg-[#C9A875] data-[state=checked]:border-[#C9A875]"
              />
              <Label
                htmlFor={`tex-${tex.value}`}
                className="text-sm font-inter text-[#3D2B1F] cursor-pointer select-none"
              >
                {tex.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#3D2B1F]/10" />

      {/* Longueur */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-inter text-xs font-semibold uppercase tracking-widest text-[#3D2B1F]/60">
            Longueur
          </h3>
          <span className="text-xs font-inter text-[#C9A875]">
            {filters.minLength}–{filters.maxLength} cm
          </span>
        </div>
        <Slider
          min={30}
          max={80}
          step={5}
          value={[filters.minLength, filters.maxLength]}
          onValueChange={(vals) => {
            const arr = Array.isArray(vals) ? vals : [vals];
            onChange({ ...filters, minLength: arr[0] ?? filters.minLength, maxLength: arr[1] ?? filters.maxLength });
          }}
          className="[&_[data-slot=slider-track]]:bg-[#3D2B1F]/15 [&_[data-slot=slider-range]]:bg-[#C9A875] [&_[data-slot=slider-thumb]]:border-[#C9A875] [&_[data-slot=slider-thumb]]:bg-[#FAF6EF]"
        />
        <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/40">
          <span>30 cm</span>
          <span>80 cm</span>
        </div>
      </div>

      <div className="h-px bg-[#3D2B1F]/10" />

      {/* Prix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-inter text-xs font-semibold uppercase tracking-widest text-[#3D2B1F]/60">
            Prix (MAD)
          </h3>
          <span className="text-xs font-inter text-[#C9A875]">
            {filters.minPrice}–{filters.maxPrice}
          </span>
        </div>
        <Slider
          min={0}
          max={2000}
          step={50}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={(vals) => {
            const arr = Array.isArray(vals) ? vals : [vals];
            onChange({ ...filters, minPrice: arr[0] ?? filters.minPrice, maxPrice: arr[1] ?? filters.maxPrice });
          }}
          className="[&_[data-slot=slider-track]]:bg-[#3D2B1F]/15 [&_[data-slot=slider-range]]:bg-[#C9A875] [&_[data-slot=slider-thumb]]:border-[#C9A875] [&_[data-slot=slider-thumb]]:bg-[#FAF6EF]"
        />
        <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/40">
          <span>0 MAD</span>
          <span>2 000 MAD</span>
        </div>
      </div>

      <div className="h-px bg-[#3D2B1F]/10" />

      {/* État */}
      <div className="space-y-3">
        <h3 className="font-inter text-xs font-semibold uppercase tracking-widest text-[#3D2B1F]/60">
          État
        </h3>
        <RadioGroup
          value={filters.state}
          onValueChange={(value) =>
            onChange({ ...filters, state: value as FilterState['state'] })
          }
          className="space-y-2.5"
        >
          {STATES.map((s) => (
            <div key={s.value} className="flex items-center gap-2.5">
              <RadioGroupItem
                value={s.value}
                id={`state-${s.value || 'all'}`}
                className="border-[#C9A875] text-[#C9A875]"
              />
              <Label
                htmlFor={`state-${s.value || 'all'}`}
                className="text-sm font-inter text-[#3D2B1F] cursor-pointer select-none"
              >
                {s.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
