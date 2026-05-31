'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyBarProps {
  productName: string;
  price: number;
  onAddToCart: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export function MobileStickyBar({
  productName,
  price,
  onAddToCart,
  triggerRef,
}: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show bar when the trigger element is NOT visible
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const el = triggerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [triggerRef]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FAF6EF] border-t border-[#3D2B1F]/10 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(61,43,31,0.08)]"
        >
          <div className="flex-1 min-w-0">
            <p className="font-playfair font-bold text-sm text-[#1A1410] truncate">{productName}</p>
            <p className="font-inter font-semibold text-xs text-[#C9A875]">
              {price.toLocaleString('fr-MA')} MAD
            </p>
          </div>

          <button
            onClick={onAddToCart}
            className="flex items-center gap-2 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold text-xs uppercase tracking-wider px-5 py-3 transition-colors duration-200 flex-shrink-0"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Ajouter
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
