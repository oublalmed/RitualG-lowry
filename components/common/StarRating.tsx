'use client';

import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function StarRating({ rating, max = 5, size = 'md', className = '' }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} aria-label={`${rating} sur ${max} étoiles`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i + 1 <= Math.round(rating);
        return (
          <Star
            key={i}
            className={`${sizeMap[size]} ${
              filled ? 'fill-[#C9A875] text-[#C9A875]' : 'fill-[#3D2B1F]/10 text-[#3D2B1F]/20'
            }`}
          />
        );
      })}
    </div>
  );
}
