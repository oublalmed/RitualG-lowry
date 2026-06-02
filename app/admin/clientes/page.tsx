'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Eye, Mail, Ban } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Tier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

interface Cliente {
  id: string;
  name: string | null;
  email: string;
  loyaltyTier: Tier;
  loyaltyPoints: number;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

const tierConfig: Record<Tier, string> = {
  BRONZE: 'bg-[#C9A875]/20 text-[#B8924B]',
  SILVER: 'bg-gray-200 text-gray-600',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-[#3D2B1F]/10 text-[#3D2B1F]',
};

type SortField = 'totalSpent' | 'totalOrders' | 'createdAt';

export default function ClientesPage() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortField>('totalSpent');
  const [page] = useState(1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchClients = useCallback(async (searchValue: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page: String(page), limit: '50' });
      if (searchValue) params.set('search', searchValue);

      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des clientes');
      const json = await res.json();
      setClients(json.data);
      setTotal(json.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Initial load
  useEffect(() => {
    fetchClients('');
  }, [fetchClients]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClients(value);
    }, 300);
  };

  const filtered = clients
    .filter((c) => tierFilter === 'all' || c.loyaltyTier === tierFilter)
    .sort((a, b) => {
      if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'totalOrders') return b.totalOrders - a.totalOrders;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
          <option value="totalSpent">Trier par CA</option>
          <option value="totalOrders">Trier par commandes</option>
          <option value="createdAt">Trier par date</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-inter text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 rounded-full border-2 border-[#C9A875] border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#C9A875]/10">
                    {['Nom', 'Email', 'Tier', 'Commandes', 'CA total', 'Inscription', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A875]/10">
                  {filtered.map((cliente) => {
                    const tierClass = tierConfig[cliente.loyaltyTier] ?? 'bg-gray-100 text-gray-600';
                    const joinDate = new Date(cliente.createdAt).toLocaleDateString('fr-MA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    return (
                      <tr key={cliente.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                        <td className="px-4 py-3 font-inter text-sm font-semibold text-[#3D2B1F]">
                          {cliente.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/60">{cliente.email}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${tierClass}`}>
                            {cliente.loyaltyTier.charAt(0) + cliente.loyaltyTier.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/70">{cliente.totalOrders}</td>
                        <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">
                          {cliente.totalSpent.toLocaleString('fr-MA')} MAD
                        </td>
                        <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">{joinDate}</td>
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
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-sm font-inter text-[#3D2B1F]/40">
                        Aucune cliente trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[#C9A875]/10">
              <p className="text-xs font-inter text-[#3D2B1F]/50">
                {total} cliente{total > 1 ? 's' : ''} au total — {filtered.length} affichée{filtered.length > 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
