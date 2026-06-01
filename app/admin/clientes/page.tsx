'use client';

import { useState } from 'react';
import { Search, Eye, Mail, Ban } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface Cliente {
  id: string;
  name: string;
  email: string;
  tier: Tier;
  orders: number;
  revenue: number;
  lastOrder: string;
}

const mockClientes: Cliente[] = [
  { id: '1', name: 'Fatima Zahra B.', email: 'fatima@email.ma', tier: 'GOLD', orders: 12, revenue: 15800, lastOrder: '31 Mar 2025' },
  { id: '2', name: 'Houda Mansouri', email: 'houda@email.ma', tier: 'SILVER', orders: 7, revenue: 8900, lastOrder: '28 Mar 2025' },
  { id: '3', name: 'Sanaa Alaoui', email: 'sanaa@email.ma', tier: 'BRONZE', orders: 3, revenue: 3200, lastOrder: '20 Mar 2025' },
  { id: '4', name: 'Nadia Ouali', email: 'nadia@email.ma', tier: 'PLATINUM', orders: 24, revenue: 38500, lastOrder: '30 Mar 2025' },
  { id: '5', name: 'Meryem Benali', email: 'meryem@email.ma', tier: 'SILVER', orders: 5, revenue: 6200, lastOrder: '15 Mar 2025' },
  { id: '6', name: 'Salma Tahiri', email: 'salma@email.ma', tier: 'GOLD', orders: 9, revenue: 12300, lastOrder: '27 Mar 2025' },
];

const tierConfig: Record<Tier, string> = {
  BRONZE: 'bg-[#C9A875]/20 text-[#B8924B]',
  SILVER: 'bg-gray-200 text-gray-600',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-[#3D2B1F]/10 text-[#3D2B1F]',
};

type SortField = 'revenue' | 'orders' | 'lastOrder';

export default function ClientesPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('revenue');

  const filtered = mockClientes
    .filter((c) => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
      const matchTier = tierFilter === 'all' || c.tier === tierFilter;
      return matchSearch && matchTier;
    })
    .sort((a, b) => {
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'orders') return b.orders - a.orders;
      return b.lastOrder.localeCompare(a.lastOrder);
    });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Clientes
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D2B1F]/30" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
          />
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F] outline-none"
        >
          <option value="all">Tous les tiers</option>
          <option value="BRONZE">Bronze</option>
          <option value="SILVER">Silver</option>
          <option value="GOLD">Gold</option>
          <option value="PLATINUM">Platinum</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortField)}
          className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F] outline-none"
        >
          <option value="revenue">Trier par CA</option>
          <option value="orders">Trier par commandes</option>
          <option value="lastOrder">Trier par date</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A875]/10">
                {['Nom', 'Email', 'Tier', 'Commandes', 'CA total', 'Dernière commande', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A875]/10">
              {filtered.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                  <td className="px-4 py-3 font-inter text-sm font-semibold text-[#3D2B1F]">{cliente.name}</td>
                  <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/60">{cliente.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${tierConfig[cliente.tier]}`}>
                      {cliente.tier.charAt(0) + cliente.tier.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/70">{cliente.orders}</td>
                  <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">
                    {cliente.revenue.toLocaleString('fr-MA')} MAD
                  </td>
                  <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">{cliente.lastOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-[#C9A875]/10 text-[#B8924B] hover:bg-[#C9A875]/20 transition-colors" title="Détail">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Email">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Suspendre">
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
