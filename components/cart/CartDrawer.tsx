'use client';

import { useCartStore } from '@/stores/cartStore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full max-w-md bg-[#FAF6EF] border-l border-[#F5EDE0] flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-[#F5EDE0] flex flex-row items-center justify-between space-y-0">
          <SheetTitle className="font-playfair font-bold italic text-xl text-[#3D2B1F] flex items-center gap-3">
            Votre Panier
            {itemCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A875] text-[#1A1410] text-xs font-inter font-bold not-italic">
                {itemCount}
              </span>
            )}
          </SheetTitle>
          <button
            onClick={closeCart}
            className="text-[#3D2B1F]/50 hover:text-[#3D2B1F] transition-colors p-1"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </SheetHeader>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6">
            <ShoppingBag className="h-16 w-16 text-[#C9A875]/40" />
            <div className="text-center space-y-1">
              <p className="font-playfair italic text-lg text-[#3D2B1F]">
                Votre panier est vide
              </p>
              <p className="text-sm font-inter text-[#3D2B1F]/60">
                Commencez votre rituel beauté
              </p>
            </div>
            <Link
              href="/boutique"
              onClick={closeCart}
              className="mt-2 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-xs px-8 py-3 transition-colors duration-300"
            >
              Découvrez nos collections
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-[#F5EDE0] pb-4 last:border-0"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-[#3D2B1F] to-[#1A1410] overflow-hidden">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-inter font-semibold text-sm text-[#3D2B1F] leading-snug">
                      {item.name}
                    </p>
                    {item.variantLabel && (
                      <p className="text-xs font-inter text-[#3D2B1F]/50 mt-0.5">
                        {item.variantLabel}
                      </p>
                    )}
                    <p className="text-sm font-inter font-semibold text-[#C9A875] mt-1">
                      {(item.price * item.quantity).toLocaleString('fr-BE')} €
                    </p>
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 border border-[#3D2B1F]/25 flex items-center justify-center hover:border-[#C9A875] hover:text-[#C9A875] transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-inter w-6 text-center text-[#3D2B1F] font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 border border-[#3D2B1F]/25 flex items-center justify-center hover:border-[#C9A875] hover:text-[#C9A875] transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#3D2B1F]/30 hover:text-[#3D2B1F] transition-colors self-start mt-0.5 flex-shrink-0"
                    aria-label={`Supprimer ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>

            {/* Footer sticky */}
            <div className="border-t border-[#F5EDE0] px-6 py-5 space-y-4 bg-[#FAF6EF]">
              <div className="flex justify-between items-center">
                <span className="font-inter text-sm text-[#3D2B1F]/70">
                  Sous-total
                </span>
                <span className="font-playfair font-bold text-lg text-[#1A1410]">
                  {subtotal.toLocaleString('fr-BE')} €
                </span>
              </div>
              <p className="text-xs font-inter text-[#3D2B1F]/50">
                Livraison calculée à la commande
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-[0.08em] text-sm text-center py-4 transition-colors duration-300"
              >
                Passer commande
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-[#3D2B1F] font-inter text-sm text-center hover:text-[#C9A875] transition-colors"
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
