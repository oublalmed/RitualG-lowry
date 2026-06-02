'use client';

import { useState, useEffect } from 'react';
import { Search, Download, Mail, Users, TrendingDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  isActive: boolean;
  createdAt: string;
  unsubscribedAt: string | null;
}

interface NewsletterData {
  total: number;
  active: number;
  unsubscribed: number;
  recentSubscribers: Subscriber[];
}

export default function NewsletterAdminPage() {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchNewsletter() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/newsletter');
        if (!res.ok) throw new Error('Erreur lors du chargement des abonnées');
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    fetchNewsletter();
  }, []);

  const subscribers = data?.recentSubscribers ?? [];

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.source ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' ? s.isActive : !s.isActive);
    return matchSearch && matchStatus;
  });

  const handleExport = () => {
    const csv = [
      'Email,Source,Date inscription,Statut',
      ...filtered.map((s) => {
        const date = new Date(s.createdAt).toLocaleDateString('fr-MA');
        return `${s.email},${s.source ?? ''},${date},${s.isActive ? 'Active' : 'Désabonnée'}`;
      }),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const statsCards = [
    { icon: Users, label: 'Total abonnées', value: data ? String(data.total) : '—' },
    { icon: Mail, label: 'Actives', value: data ? String(data.active) : '—' },
    { icon: TrendingDown, label: 'Désabonnées', value: data ? String(data.unsubscribed) : '—' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Newsletter
        </h1>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={loading || filtered.length === 0}
          className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-inter text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {statsCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4 flex items-center gap-3">
            <Icon className="h-5 w-5 text-[#C9A875]" />
            <div>
              {loading ? (
                <div className="h-6 w-16 bg-[#C9A875]/20 rounded animate-pulse" />
              ) : (
                <p className="text-xl font-inter font-bold text-[#1A1410]">{value}</p>
              )}
              <p className="text-xs font-inter text-[#3D2B1F]/50">{label}</p>
            </div>
          </div>
        ))}
      </div>

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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F] outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actives</option>
          <option value="inactive">Désabonnées</option>
        </select>
      </div>

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
                    {['Email', 'Source', 'Date inscription', 'Statut'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C9A875]/10">
                  {filtered.map((sub) => {
                    const subDate = new Date(sub.createdAt).toLocaleDateString('fr-MA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    return (
                      <tr key={sub.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                        <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]">{sub.email}</td>
                        <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/60">{sub.source ?? '—'}</td>
                        <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">{subDate}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${
                            sub.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {sub.isActive ? 'Active' : 'Désabonnée'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm font-inter text-[#3D2B1F]/40">
                        Aucune abonnée trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[#C9A875]/10">
              <p className="text-xs font-inter text-[#3D2B1F]/50">{filtered.length} abonnée{filtered.length > 1 ? 's' : ''}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
