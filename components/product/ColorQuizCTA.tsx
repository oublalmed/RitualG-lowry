'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import Link from 'next/link';

const NATURAL_COLORS = [
  { label: 'Noir', hex: '#1A1410' },
  { label: 'Brun foncé', hex: '#3D2B1F' },
  { label: 'Châtain', hex: '#8B5A3C' },
  { label: 'Blond', hex: '#C4A882' },
];

const TEXTURES = ['Lisse', 'Bouclée', 'Afro', 'Ondulée'];

const RESULT_MAP: Record<string, { color: string; product: string; slug: string }> = {
  '#1A1410-Lisse': { color: 'Noir Naturel', product: 'Extension Lisse Naturelle', slug: 'extension-lisse-naturelle' },
  '#1A1410-Bouclée': { color: 'Noir Profond', product: 'Extension Bouclée Sublime', slug: 'extension-bouclee-sublime' },
  '#1A1410-Afro': { color: 'Noir Profond', product: 'Extension Afro Naturelle', slug: 'extension-afro-naturelle' },
  '#1A1410-Ondulée': { color: 'Noir Naturel', product: 'Extension Ondulée Body Wave', slug: 'extension-ondule-naturelle' },
  '#3D2B1F-Lisse': { color: 'Brun Riche', product: 'Extension Lisse Naturelle', slug: 'extension-lisse-naturelle' },
  '#3D2B1F-Bouclée': { color: 'Brun Foncé', product: 'Extension Bouclée Sublime', slug: 'extension-bouclee-sublime' },
  '#3D2B1F-Afro': { color: 'Brun Naturel', product: 'Extension Afro Naturelle', slug: 'extension-afro-naturelle' },
  '#3D2B1F-Ondulée': { color: 'Brun Chaud', product: 'Extension Ondulée Body Wave', slug: 'extension-ondule-naturelle' },
  '#8B5A3C-Lisse': { color: 'Châtain Doré', product: 'Extension Lisse Naturelle', slug: 'extension-lisse-naturelle' },
  '#8B5A3C-Bouclée': { color: 'Châtain Cuivré', product: 'Extension Bouclée Sublime', slug: 'extension-bouclee-sublime' },
  '#8B5A3C-Afro': { color: 'Châtain Naturel', product: 'Extension Afro Naturelle', slug: 'extension-afro-naturelle' },
  '#8B5A3C-Ondulée': { color: 'Châtain Doux', product: 'Extension Ondulée Body Wave', slug: 'extension-ondule-naturelle' },
  '#C4A882-Lisse': { color: 'Blond Naturel', product: 'Extension Lisse Naturelle', slug: 'extension-lisse-naturelle' },
  '#C4A882-Bouclée': { color: 'Blond Doré', product: 'Extension Bouclée Sublime', slug: 'extension-bouclee-sublime' },
  '#C4A882-Afro': { color: 'Blond Sable', product: 'Extension Afro Naturelle', slug: 'extension-afro-naturelle' },
  '#C4A882-Ondulée': { color: 'Blond Champagne', product: 'Extension Ondulée Body Wave', slug: 'extension-ondule-naturelle' },
};

function getResult(hex: string, texture: string) {
  const key = `${hex}-${texture}`;
  return RESULT_MAP[key] ?? { color: 'Noir Naturel', product: 'Extension Lisse Naturelle', slug: 'extension-lisse-naturelle' };
}

export function ColorQuizCTA() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedColor, setSelectedColor] = useState<{ label: string; hex: string } | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string | null>(null);

  const result = selectedColor && selectedTexture
    ? getResult(selectedColor.hex, selectedTexture)
    : null;

  const handleOpen = () => {
    setOpen(true);
    setStep(1);
    setSelectedColor(null);
    setSelectedTexture(null);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      {/* CTA card */}
      <div className="flex items-start gap-4 bg-[#F5EDE0] border-l-4 border-[#C9A875] px-5 py-4">
        <Sparkles className="h-5 w-5 text-[#C9A875] flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-inter font-semibold text-sm text-[#3D2B1F]">
            Trouvez votre teinte idéale
          </p>
          <p className="font-inter text-xs text-[#3D2B1F]/60 mt-0.5 leading-relaxed">
            Répondez à 3 questions pour trouver la couleur qui se fond parfaitement avec vos cheveux
            naturels.
          </p>
        </div>
        <button
          onClick={handleOpen}
          className="flex-shrink-0 border border-[#C9A875] text-[#C9A875] hover:bg-[#C9A875] hover:text-[#1A1410] font-inter font-semibold text-xs uppercase tracking-wider px-4 py-2 transition-colors duration-200 whitespace-nowrap"
        >
          Faire le test →
        </button>
      </div>

      {/* Dialog */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1410]/60"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF6EF] rounded-2xl shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step indicator */}
            <div className="flex gap-1.5 mb-6">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? 'bg-[#C9A875]' : 'bg-[#C9A875]/20'
                  }`}
                />
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div>
                <h2
                  className="text-xl text-[#3D2B1F] mb-6"
                  style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Quelle est votre couleur naturelle ?
                </h2>
                <div className="grid grid-cols-4 gap-3">
                  {NATURAL_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => {
                        setSelectedColor(c);
                        setStep(2);
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <span
                        className={`w-12 h-12 rounded-full ring-2 transition-all ${
                          selectedColor?.hex === c.hex
                            ? 'ring-[#C9A875] ring-offset-2'
                            : 'ring-transparent group-hover:ring-[#C9A875]/50 group-hover:ring-offset-1'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-inter text-xs text-[#3D2B1F]/70 text-center leading-tight">
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div>
                <h2
                  className="text-xl text-[#3D2B1F] mb-6"
                  style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Quelle texture recherchez-vous ?
                </h2>
                <div className="flex flex-wrap gap-2">
                  {TEXTURES.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTexture(t);
                        setStep(3);
                      }}
                      className={`px-5 py-2.5 border font-inter text-sm transition-colors ${
                        selectedTexture === t
                          ? 'bg-[#C9A875] border-[#C9A875] text-[#1A1410] font-semibold'
                          : 'border-[#3D2B1F]/20 text-[#3D2B1F] hover:border-[#C9A875]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — Result */}
            {step === 3 && result && (
              <div className="text-center">
                <h2
                  className="text-xl text-[#3D2B1F] mb-4"
                  style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
                >
                  Votre couleur idéale
                </h2>
                <div className="inline-block bg-[#C9A875] text-[#1A1410] font-inter font-bold text-xl px-6 py-3 mb-4">
                  {result.color}
                </div>
                <p className="font-inter text-sm text-[#3D2B1F]/70 mb-6">
                  Nous recommandons :{' '}
                  <Link
                    href={`/produit/${result.slug}`}
                    className="text-[#C9A875] hover:text-[#B8924B] font-semibold transition-colors"
                    onClick={handleClose}
                  >
                    {result.product}
                  </Link>
                </p>
                <Link
                  href={`/boutique`}
                  onClick={handleClose}
                  className="inline-block border border-[#C9A875] text-[#C9A875] hover:bg-[#C9A875] hover:text-[#1A1410] font-inter font-semibold text-sm uppercase tracking-wider px-8 py-3 transition-colors"
                >
                  Voir les produits compatibles →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
