'use client';

import { useCartStore } from '@/stores/cartStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } =
    useCartStore();

  const total = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full max-w-md bg-[#FAF6EF] border-l border-[#F5EDE0] flex flex-col p-0"
      >
        <SheetHeader className="px-6 py-5 border-b border-[#F5EDE0]">
          <SheetTitle className="font-playfair font-bold italic text-xl text-[#3D2B1F] flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#C9A875]" />
            Mon Panier
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="h-12 w-12 text-[#C9A875]/40" />
            <p className="font-cormorant italic text-lg text-[#3D2B1F]/60">
              Votre panier est vide
            </p>
            <Link
              href="/boutique"
              onClick={closeCart}
              className="mt-2 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-xs px-8 py-3 transition-colors duration-300"
            >
              Découvrir la collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-[#F5EDE0] pb-4"
                >
                  <div className="w-16 h-20 bg-[#F5EDE0] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-playfair font-bold text-sm text-[#1A1410] leading-snug">
                      {item.name}
                    </p>
                    {item.size && (
                      <p className="text-xs font-inter text-[#3D2B1F]/60 mt-0.5">
                        {item.size}
                      </p>
                    )}
                    <p className="text-sm font-inter font-semibold text-[#C9A875] mt-1">
                      {item.price.toLocaleString('fr-MA')} MAD
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border border-[#3D2B1F]/20 flex items-center justify-center hover:border-[#C9A875] transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-inter w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border border-[#3D2B1F]/20 flex items-center justify-center hover:border-[#C9A875] transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#3D2B1F]/40 hover:text-[#3D2B1F] transition-colors self-start mt-1"
                    aria-label="Supprimer l'article"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-[#F5EDE0] px-6 py-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-[#3D2B1F]/70 uppercase tracking-widest">
                  Total
                </span>
                <span className="font-playfair font-bold text-lg text-[#1A1410]">
                  {total.toLocaleString('fr-MA')} MAD
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-sm text-center py-4 transition-colors duration-300"
              >
                Commander
              </Link>
              <button
                onClick={closeCart}
                className="block w-full border border-[#3D2B1F]/20 hover:border-[#3D2B1F] text-[#3D2B1F] font-inter font-semibold uppercase tracking-[0.08em] text-sm text-center py-3 transition-colors duration-300"
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
