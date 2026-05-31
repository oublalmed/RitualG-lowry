import type { Metadata } from 'next';
import { BoutiqueClient } from '@/components/shop/BoutiqueClient';

export const metadata: Metadata = {
  title: 'Notre Boutique | Ritual Glowry',
  description:
    'Découvrez notre collection complète d\'extensions, perruques et accessoires capillaires premium 100% naturels.',
};

export default function BoutiquePage() {
  return <BoutiqueClient />;
}
