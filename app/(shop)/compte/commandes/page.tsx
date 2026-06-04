'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Package, Loader2 } from 'lucide-react';

type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  total: number | string;
  items: { id: string; productName: string; variantLabel: string | null; quantity: number; unitPrice: number }[];
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:    { label: 'En attente',     className: 'bg-yellow-100 text-yellow-700' },
  PAID:       { label: 'Payée',          className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED:    { label: 'Expédiée',       className: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: 'Livrée',         className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED:  { label: 'Annulée',        className: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: 'Remboursée',     className: 'bg-orange-100 text-orange-700' },
};

type TabType = 'all' | 'ongoing' | 'delivered' | 'cancelled';
const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

function filterOrders(orders: Order[], tab: TabType): Order[] {
  if (tab === 'all') return orders;
  if (tab === 'ongoing') return orders.filter((o) => ['PENDING','PAID','PROCESSING','SHIPPED'].includes(o.status));
  if (tab === 'delivered') return orders.filter((o) => o.status === 'DELIVERED');
  if (tab === 'cancelled') return orders.filter((o) => ['CANCELLED','REFUNDED'].includes(o.status));
  return orders;
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  useEffect(() => {
    fetch('/api/account/orders')
      .then((r) => r.json())
      .then((json) => setOrders(json.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterOrders(orders, activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl text-[#3D2B1F]" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
        Mes commandes
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F5EDE0] p-1 rounded-xl w-fit border border-[#C9A875]/15">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-inter transition-colors ${
              activeTab === tab.key
                ? 'bg-[#C9A875] text-[#1A1410] font-semibold shadow-sm'
                : 'text-[#3D2B1F]/60 hover:text-[#3D2B1F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#C9A875]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-[#C9A875]/40 mx-auto mb-4" />
          <p className="font-inter text-[#3D2B1F]/50">
            {orders.length === 0 ? "Vous n'avez pas encore commandé." : "Aucune commande dans cette catégorie."}
          </p>
          {orders.length === 0 && (
            <Link href="/boutique" className="mt-4 inline-block text-sm font-inter text-[#C9A875] hover:underline">
              Découvrir la boutique →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
            const date = new Date(order.createdAt).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short', year: 'numeric' });
            return (
              <div key={order.id} className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A875]/10">
                  <div className="flex items-center gap-3">
                    <span className="font-inter font-semibold text-[#3D2B1F] text-sm">{order.orderNumber}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-sm text-[#3D2B1F]/50 font-inter">{date}</span>
                </div>
                <div className="px-5 py-3 space-y-1.5">
                  {(order.items ?? []).map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-inter">
                      <span className="text-[#3D2B1F]/70">{item.quantity}× {item.productName}{item.variantLabel ? ` — ${item.variantLabel}` : ''}</span>
                      <span className="text-[#3D2B1F]/60">{Number(item.unitPrice).toLocaleString('fr-BE')} €</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#C9A875]/10 bg-[#FAF6EF]/40">
                  <span className="font-inter font-bold text-[#1A1410]">
                    Total : {Number(order.total).toLocaleString('fr-BE')} €
                  </span>
                  <Link
                    href={`/compte/commandes/${order.id}`}
                    className="inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#1A1410] text-[#FAF6EF] text-xs font-inter font-semibold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Voir détails
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
