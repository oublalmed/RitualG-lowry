import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  slug: string;
  comparePrice?: number | null;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviewCount?: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  getCount: () => number;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (!existing) {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId);
      },

      getCount: () => get().items.length,

      clear: () => set({ items: [] }),
    }),
    {
      name: 'ritual-glowry-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
