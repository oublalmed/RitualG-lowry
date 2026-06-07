import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/shopify/fetch';
import { BoutiqueClient } from '@/components/shop/BoutiqueClient';

export const metadata: Metadata = {
  title: 'Notre Boutique | Ritual Glowry',
  description:
    'Découvrez notre collection complète d\'extensions, perruques et accessoires capillaires premium 100% naturels.',
};

export default async function BoutiquePage() {
  const products = await getAllProducts();

  return <BoutiqueClient products={products ?? []} />;
}
