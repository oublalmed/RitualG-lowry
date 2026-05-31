'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryItem {
  id: number;
  gradient: string;
  label: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  { id: 0, gradient: 'linear-gradient(135deg, #3D2B1F 0%, #5A3D2B 60%, #C9A875 100%)', label: 'Vue principale' },
  { id: 1, gradient: 'linear-gradient(135deg, #4A3528 0%, #B8924B 100%)', label: 'Vue de côté' },
  { id: 2, gradient: 'linear-gradient(135deg, #5A3D2B 0%, #C9A8A0 100%)', label: 'Vue détail' },
  { id: 3, gradient: 'linear-gradient(135deg, #2C1F17 0%, #7A5435 100%)', label: 'Vue texture' },
];

interface ProductGalleryProps {
  productName: string;
}

export function ProductGallery({ productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeItem = GALLERY_ITEMS[activeIndex];

  const prev = () => setActiveIndex((i) => (i === 0 ? GALLERY_ITEMS.length - 1 : i - 1));
  const next = () => setActiveIndex((i) => (i === GALLERY_ITEMS.length - 1 ? 0 : i + 1));

  return (
    <>
      <div className="flex gap-4">
        {/* Thumbnail strip — vertical on desktop */}
        <div className="hidden md:flex flex-col gap-2.5 w-[72px] flex-shrink-0">
          {GALLERY_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square w-full rounded-sm overflow-hidden transition-all duration-200 ${
                idx === activeIndex
                  ? 'ring-2 ring-[#C9A875] ring-offset-2'
                  : 'ring-1 ring-[#3D2B1F]/10 opacity-60 hover:opacity-100'
              }`}
              aria-label={item.label}
            >
              <div className="w-full h-full" style={{ background: item.gradient }} />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div className="flex-1">
          <button
            className="relative w-full aspect-square rounded-sm overflow-hidden group cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            aria-label={`Agrandir : ${activeItem.label}`}
          >
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="w-full h-full"
              style={{ background: activeItem.gradient }}
            />

            {/* Zoom overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#1A1410]/10">
              <span className="bg-[#FAF6EF]/90 rounded-full p-3 shadow-sm">
                <ZoomIn className="h-5 w-5 text-[#3D2B1F]" />
              </span>
            </div>
          </button>

          {/* Mobile thumbnails */}
          <div className="flex md:hidden gap-2 mt-3">
            {GALLERY_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`w-14 h-14 rounded-sm flex-shrink-0 overflow-hidden transition-all duration-200 ${
                  idx === activeIndex
                    ? 'ring-2 ring-[#C9A875] ring-offset-1'
                    : 'ring-1 ring-[#3D2B1F]/10 opacity-60'
                }`}
                aria-label={item.label}
              >
                <div className="w-full h-full" style={{ background: item.gradient }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-[#1A1410]/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-2xl aspect-square rounded-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full h-full"
                style={{ background: activeItem.gradient }}
              />

              {/* Close */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 bg-[#FAF6EF]/90 rounded-full p-2 shadow hover:bg-white transition-colors"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 text-[#3D2B1F]" />
              </button>

              {/* Navigation */}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#FAF6EF]/90 rounded-full p-2 shadow hover:bg-white transition-colors"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-5 w-5 text-[#3D2B1F]" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FAF6EF]/90 rounded-full p-2 shadow hover:bg-white transition-colors"
                aria-label="Suivant"
              >
                <ChevronRight className="h-5 w-5 text-[#3D2B1F]" />
              </button>

              {/* Caption */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="font-inter text-xs text-[#FAF6EF]/80 bg-[#1A1410]/50 px-3 py-1 rounded-full">
                  {productName} — {activeItem.label}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
