'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Package } from 'lucide-react';

type OrderStatus = 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface MockOrder {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

const mockOrders: MockOrder[] = [
  {
    id: 'ORD-001',
    number: '#2024-001',
    date: '15 Jan 2025',
    status: 'DELIVERED',
    total: 1890,
    items: [
      { name: 'Extension Lisse Naturelle (50cm)', qty: 1, price: 990 },
      { name: 'Serre-tête Satin Glowry', qty: 1, price: 180 },
      { name: 'Extension Bouclée Sublime (40cm)', qty: 1, price: 950 },
    ],
  },
  {
    id: 'ORD-002',
    number: '#2024-002',
    date: '02 Fév 2025',
    status: 'SHIPPED',
    total: 950,
    items: [{ name: 'Extension Bouclée Sublime (40cm)', qty: 1, price: 950 }],
  },
  {
    id: 'ORD-003',
    number: '#2024-003',
    date: '20 Fév 2025',
    status: 'PROCESSING',
    total: 1450,
    items: [{ name: 'Perruque Lace Front Premium (14 pouces)', qty: 1, price: 1450 }],
  },
  {
    id: 'ORD-004',
    number: '#2023-015',
    date: '10 Nov 2024',
    status: 'CANCELLED',
    total: 780,
    items: [{ name: 'Extension Afro Naturelle (30cm)', qty: 1, price: 780 }],
  },
];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
};

type TabType = 'all' | 'ongoing' | 'delivered' | 'cancelled';

const tabs: { key: TabType; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'ongoing', label: 'En cours' },
  { key: 'delivered', label: 'Livrées' },
  { key: 'cancelled', label: 'Annulées' },
];

function filterOrders(orders: MockOrder[], tab: TabType): MockOrder[] {
  if (tab === 'all') return orders;
  if (tab === 'ongoing') return orders.filter((o) => ['PAID', 'PROCESSING', 'SHIPPED'].includes(o.status));
  if (tab === 'delivered') return orders.filter((o) => o.status === 'DELIVERED');
  if (tab === 'cancelled') return orders.filter((o) => o.status === 'CANCELLED');
  return orders;
}

export default function CommandesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const filtered = filterOrders(mockOrders, activeTab);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
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

      {/* Orders */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 text-[#C9A875]/40 mx-auto mb-4" />
          <p className="font-inter text-[#3D2B1F]/50">Aucune commande dans cette catégorie.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const cfg = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A875]/10">
                  <div className="flex items-center gap-3">
                    <span className="font-inter font-semibold text-[#3D2B1F] text-sm">
                      {order.number}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${cfg.className}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <span className="text-sm text-[#3D2B1F]/50 font-inter">{order.date}</span>
                </div>

                {/* Items */}
                <div className="px-5 py-3 space-y-1.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-inter">
                      <span className="text-[#3D2B1F]/70">
                        {item.qty}× {item.name}
                      </span>
                      <span className="text-[#3D2B1F]/60">{item.price.toLocaleString('fr-BE')} €</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-4 border-t border-[#C9A875]/10 bg-[#FAF6EF]/40">
                  <span className="font-inter font-bold text-[#1A1410]">
                    Total : {order.total.toLocaleString('fr-BE')} MAD
                  </span>
                  <Link
                    href={`/compte/commandes/${order.id}`}
                    className="inline-flex items-center gap-2 bg-[#3D2B1F] hover:bg-[#1A1410] text-[#FAF6EF] text-xs font-inter font-semibold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Voir détails
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
