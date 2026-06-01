'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Download, Eye, Mail, Printer, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type OrderStatus = 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

interface AdminOrder {
  id: string;
  number: string;
  date: string;
  client: string;
  total: number;
  payment: string;
  status: OrderStatus;
}

const mockOrders: AdminOrder[] = [
  { id: '1', number: '#2025-089', date: '31 Mar 2025', client: 'Fatima Zahra B.', total: 1890, payment: 'Carte', status: 'DELIVERED' },
  { id: '2', number: '#2025-090', date: '31 Mar 2025', client: 'Houda M.', total: 950, payment: 'Carte', status: 'SHIPPED' },
  { id: '3', number: '#2025-091', date: '31 Mar 2025', client: 'Sanaa A.', total: 1450, payment: 'Carte', status: 'PROCESSING' },
  { id: '4', number: '#2025-092', date: '30 Mar 2025', client: 'Rim K.', total: 780, payment: 'Carte', status: 'PAID' },
  { id: '5', number: '#2025-093', date: '30 Mar 2025', client: 'Nadia O.', total: 2200, payment: 'Carte', status: 'DELIVERED' },
  { id: '6', number: '#2025-094', date: '29 Mar 2025', client: 'Yasmine H.', total: 1650, payment: 'Carte', status: 'SHIPPED' },
  { id: '7', number: '#2025-095', date: '28 Mar 2025', client: 'Meryem B.', total: 890, payment: 'Carte', status: 'CANCELLED' },
  { id: '8', number: '#2025-096', date: '27 Mar 2025', client: 'Salma T.', total: 3200, payment: 'Carte', status: 'DELIVERED' },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'Préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Remboursée', className: 'bg-orange-100 text-orange-700' },
};

const PAGE_SIZE = 5;

export default function AdminCommandesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const toggleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = mockOrders
    .filter((o) => {
      const matchesSearch = o.number.toLowerCase().includes(search.toLowerCase()) || o.client.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'total') return sortDir === 'asc' ? a.total - b.total : b.total - a.total;
      return sortDir === 'asc' ? a.number.localeCompare(b.number) : b.number.localeCompare(a.number);
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortIcon = ({ field }: { field: 'date' | 'total' }) =>
    sortField === field
      ? sortDir === 'asc'
        ? <ChevronUp className="h-3 w-3 inline ml-1" />
        : <ChevronDown className="h-3 w-3 inline ml-1" />
      : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Commandes
        </h1>
        <Button variant="outline" className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2">
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3D2B1F]/30" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F] outline-none focus:border-[#C9A875]"
        >
          <option value="all">Tous les statuts</option>
          <option value="PAID">Payée</option>
          <option value="PROCESSING">Préparation</option>
          <option value="SHIPPED">Expédiée</option>
          <option value="DELIVERED">Livrée</option>
          <option value="CANCELLED">Annulée</option>
          <option value="REFUNDED">Remboursée</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A875]/10">
                {['N° Commande', 'Date', 'Cliente', 'Total', 'Paiement', 'Statut', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50 cursor-pointer select-none"
                    onClick={() => {
                      if (h === 'Date') toggleSort('date');
                      if (h === 'Total') toggleSort('total');
                    }}
                  >
                    {h}
                    {h === 'Date' && <SortIcon field="date" />}
                    {h === 'Total' && <SortIcon field="total" />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A875]/10">
              {paginated.map((order) => {
                const cfg = statusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="px-4 py-3 font-inter text-sm font-semibold text-[#3D2B1F]">{order.number}</td>
                    <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">{order.date}</td>
                    <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/70">{order.client}</td>
                    <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">{order.total.toLocaleString('fr-MA')} MAD</td>
                    <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/60">{order.payment}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${cfg.className}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Link
                          href={`/admin/commandes/${order.id}`}
                          className="p-1.5 rounded-lg bg-[#C9A875]/10 text-[#B8924B] hover:bg-[#C9A875]/20 transition-colors"
                          title="Détail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                        <button className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Email">
                          <Mail className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Facture">
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#C9A875]/10">
          <p className="text-xs font-inter text-[#3D2B1F]/50">
            {filtered.length} commande{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-7 w-7 rounded text-xs font-inter transition-colors ${
                  p === page
                    ? 'bg-[#C9A875] text-[#1A1410] font-semibold'
                    : 'text-[#3D2B1F]/50 hover:bg-[#C9A875]/10'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
