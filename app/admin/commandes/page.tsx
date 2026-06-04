'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, Download, Eye, Mail, Printer, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type OrderStatus = 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED' | 'PENDING';

interface AdminOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: OrderStatus;
  user: { name: string | null; email: string } | null;
  guestEmail: string | null;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'Préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Remboursée', className: 'bg-orange-100 text-orange-700' },
  PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
};

function exportToCSV(orders: AdminOrder[]) {
  const headers = ['N° Commande', 'Date', 'Cliente', 'Total (MAD)', 'Statut'];
  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toLocaleDateString('fr-MA'),
    o.user?.name ?? o.user?.email ?? o.guestEmail ?? '—',
    Number(o.total).toFixed(2),
    o.status,
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `commandes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function sendOrderEmail(orderId: string) {
  const res = await fetch(`/api/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sendEmail: true }),
  });
  if (res.ok) alert('Email envoyé avec succès');
  else alert('Erreur lors de l\'envoi de l\'email');
}

async function printInvoice(order: AdminOrder) {
  // Fetch full order details (includes items, subtotal, shipping, discount)
  let fullOrder: any = null;
  try {
    const res = await fetch(`/api/admin/orders/${order.id}`);
    if (res.ok) fullOrder = (await res.json()).data;
  } catch { /* use basic order */ }

  const o = fullOrder ?? order;
  const clientLabel = o.user?.name ?? o.user?.email ?? o.guestEmail ?? '—';
  const date = new Date(o.createdAt).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' });
  const statusLabels: Record<string, string> = {
    PENDING: 'En attente', PAID: 'Payée', PROCESSING: 'En préparation',
    SHIPPED: 'Expédiée', DELIVERED: 'Livrée', CANCELLED: 'Annulée', REFUNDED: 'Remboursée',
  };

  const itemsHTML = (o.items ?? []).map((item: any) => `
    <tr>
      <td style="padding:8px 4px;border-bottom:1px solid #eee">${item.productName}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center">${item.variantLabel ?? '—'}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:right">${Number(item.unitPrice).toLocaleString('fr-MA')} MAD</td>
      <td style="padding:8px 4px;border-bottom:1px solid #eee;text-align:right">${Number(item.totalPrice).toLocaleString('fr-MA')} MAD</td>
    </tr>`).join('');

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <html><head><title>Facture ${o.orderNumber}</title>
    <style>
      *{box-sizing:border-box}
      body{font-family:Arial,sans-serif;padding:40px;color:#1A1410;max-width:800px;margin:0 auto}
      .header{display:flex;justify-content:space-between;border-bottom:3px solid #C9A875;padding-bottom:20px;margin-bottom:30px}
      .brand{font-size:28px;font-weight:bold;color:#C9A875;font-style:italic}
      .subtitle{font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#f5f0e8;padding:10px 4px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:0.5px}
      .totals{margin-top:20px;margin-left:auto;width:300px}
      .totals-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #eee;font-size:14px}
      .totals-total{display:flex;justify-content:space-between;padding:10px 0;font-weight:bold;font-size:16px;border-top:2px solid #C9A875;margin-top:6px}
      .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;background:#f0f9f0;color:#2d7a2d}
      @media print{body{padding:20px}}
    </style></head><body>
    <div class="header">
      <div>
        <div class="brand">Ritual Glowry</div>
        <div class="subtitle">Luxury Hair — Maroc</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:18px;font-weight:bold">FACTURE</div>
        <div style="font-size:14px;color:#888">${o.orderNumber}</div>
        <div style="font-size:13px;margin-top:6px">Date : ${date}</div>
        <div style="font-size:13px">Statut : <span class="badge">${statusLabels[o.status] ?? o.status}</span></div>
      </div>
    </div>

    <div style="margin-bottom:20px">
      <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Cliente</div>
      <div style="font-size:14px;font-weight:bold">${clientLabel}</div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Produit</th><th>Variante</th><th style="text-align:center">Qté</th>
          <th style="text-align:right">Prix unit.</th><th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>${itemsHTML || '<tr><td colspan="5" style="padding:12px;text-align:center;color:#888">—</td></tr>'}</tbody>
    </table>

    <div class="totals">
      <div class="totals-row"><span>Sous-total</span><span>${Number(o.subtotal ?? 0).toLocaleString('fr-MA')} MAD</span></div>
      <div class="totals-row"><span>Livraison</span><span>${Number(o.shipping ?? 0) === 0 ? 'Offerte' : Number(o.shipping ?? 0).toLocaleString('fr-MA') + ' MAD'}</span></div>
      ${Number(o.discount ?? 0) > 0 ? `<div class="totals-row" style="color:#c0392b"><span>Code promo${o.promoCode ? ' (' + o.promoCode + ')' : ''}</span><span>-${Number(o.discount).toLocaleString('fr-MA')} MAD</span></div>` : ''}
      <div class="totals-total"><span>TOTAL</span><span>${Number(o.total).toLocaleString('fr-MA')} MAD</span></div>
    </div>

    <div style="margin-top:40px;font-size:11px;color:#aaa;text-align:center;border-top:1px solid #eee;padding-top:20px">
      Ritual Glowry — contact@ritualglowry.ma — www.ritualglowry.ma<br>
      Merci pour votre confiance.
    </div>
    <script>window.onload=()=>{window.print()}</script>
    </body></html>
  `);
  win.document.close();
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'date' | 'total'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: '20',
      });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des commandes');
      const json = await res.json();
      setOrders(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const toggleSort = (field: 'date' | 'total') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortField === 'total') return sortDir === 'asc' ? a.total - b.total : b.total - a.total;
    return sortDir === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
        <Button
          variant="outline"
          className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2"
          onClick={() => exportToCSV(sortedOrders)}
          disabled={sortedOrders.length === 0}
        >
          <Download className="h-4 w-4" />
          Export CSV
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
          <option value="PENDING">En attente</option>
          <option value="PAID">Payée</option>
          <option value="PROCESSING">Préparation</option>
          <option value="SHIPPED">Expédiée</option>
          <option value="DELIVERED">Livrée</option>
          <option value="CANCELLED">Annulée</option>
          <option value="REFUNDED">Remboursée</option>
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
                    {['N° Commande', 'Date', 'Cliente', 'Total', 'Statut', 'Actions'].map((h) => (
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
                  {sortedOrders.map((order) => {
                    const cfg = statusConfig[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
                    const clientLabel = order.user?.name ?? order.user?.email ?? order.guestEmail ?? '—';
                    const orderDate = new Date(order.createdAt).toLocaleDateString('fr-MA', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });
                    return (
                      <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                        <td className="px-4 py-3 font-inter text-sm font-semibold text-[#3D2B1F]">{order.orderNumber}</td>
                        <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">{orderDate}</td>
                        <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/70">{clientLabel}</td>
                        <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">{order.total.toLocaleString('fr-MA')} MAD</td>
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
                            <button
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Envoyer email"
                              onClick={() => sendOrderEmail(order.id)}
                            >
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                              title="Imprimer facture"
                              onClick={() => void printInvoice(order)}
                            >
                              <Printer className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {sortedOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm font-inter text-[#3D2B1F]/40">
                        Aucune commande trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#C9A875]/10">
              <p className="text-xs font-inter text-[#3D2B1F]/50">
                {total} commande{total > 1 ? 's' : ''}
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
          </>
        )}
      </div>
    </div>
  );
}
