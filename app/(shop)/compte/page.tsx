'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Package, TrendingDown, Star, Trophy, Eye } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { mockProducts } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

const mockOrders = [
  {
    id: 'ORD-001',
    number: '#2024-001',
    date: '15 Jan 2025',
    status: 'DELIVERED' as const,
    total: 1890,
    items: ['Extension Lisse Naturelle', 'Serre-tête Satin'],
  },
  {
    id: 'ORD-002',
    number: '#2024-002',
    date: '02 Fév 2025',
    status: 'SHIPPED' as const,
    total: 950,
    items: ['Extension Bouclée Sublime'],
  },
  {
    id: 'ORD-003',
    number: '#2024-003',
    date: '20 Fév 2025',
    status: 'PROCESSING' as const,
    total: 1450,
    items: ['Perruque Lace Front Premium'],
  },
];

const statusConfig = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  PENDING: { label: 'En attente', className: 'bg-gray-100 text-gray-600' },
  REFUNDED: { label: 'Remboursée', className: 'bg-orange-100 text-orange-700' },
};

const stats = [
  { icon: Package, label: 'Commandes', value: '3', color: 'text-[#C9A875]' },
  { icon: TrendingDown, label: 'Économies', value: '450 MAD', color: 'text-green-600' },
  { icon: Star, label: 'Points', value: '127', color: 'text-[#B8924B]' },
  { icon: Trophy, label: 'Tier', value: 'Bronze', color: 'text-[#C9A875]' },
];

const suggestedProducts = mockProducts.slice(0, 3).map((p) => ({
  id: p._id,
  slug: p.slug,
  name: p.name,
  price: p.basePrice,
  comparePrice: p.comparePrice,
  isNew: p.isNew,
  isBestSeller: p.isBestSeller,
  rating: p.rating,
  reviewCount: p.reviewCount,
}));

export default function CompteDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Cliente';

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1
          className="text-3xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Bienvenue, {firstName} !
        </h1>
        <p className="text-sm text-[#3D2B1F]/50 font-inter mt-1 capitalize">{today}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            className="bg-[#F5EDE0] rounded-xl p-5 border border-[#C9A875]/10 flex flex-col gap-3"
          >
            <Icon className={`h-5 w-5 ${color}`} />
            <div>
              <p className="text-2xl font-inter font-bold text-[#1A1410]">{value}</p>
              <p className="text-xs font-inter text-[#3D2B1F]/50 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-xl text-[#3D2B1F]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Commandes récentes
          </h2>
          <Link
            href="/compte/commandes"
            className="text-sm text-[#C9A875] hover:text-[#B8924B] font-inter transition-colors"
          >
            Voir tout →
          </Link>
        </div>
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#C9A875]/15">
                  {['N° Commande', 'Date', 'Statut', 'Total', 'Action'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A875]/10">
                {mockOrders.map((order) => {
                  const cfg = statusConfig[order.status] ?? statusConfig.PENDING;
                  return (
                    <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                      <td className="px-4 py-3 font-inter text-sm font-medium text-[#3D2B1F]">
                        {order.number}
                      </td>
                      <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/60">
                        {order.date}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">
                        {order.total.toLocaleString('fr-MA')} MAD
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/compte/commandes/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-[#C9A875] hover:text-[#B8924B] font-inter transition-colors"
                        >
                          <Eye className="h-3 w-3" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Personalized suggestions */}
      <div>
        <h2
          className="text-xl text-[#3D2B1F] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Basé sur vos achats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {suggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
