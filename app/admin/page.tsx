'use client';

import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Users,
  ShoppingBag,
  Target,
  Star,
  Eye,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const revenueData = [
  { month: 'Avr', revenue: 18200 },
  { month: 'Mai', revenue: 21500 },
  { month: 'Jun', revenue: 17800 },
  { month: 'Jul', revenue: 22100 },
  { month: 'Aoû', revenue: 19300 },
  { month: 'Sep', revenue: 24500 },
  { month: 'Oct', revenue: 27800 },
  { month: 'Nov', revenue: 31200 },
  { month: 'Déc', revenue: 38500 },
  { month: 'Jan', revenue: 22100 },
  { month: 'Fév', revenue: 20800 },
  { month: 'Mar', revenue: 24500 },
];

const topProducts = [
  { name: 'Extension Lisse Naturelle', sales: 124 },
  { name: 'Perruque Lace Front Premium', sales: 203 },
  { name: 'Extension Bouclée Sublime', sales: 87 },
  { name: 'Extension Ondulée Body Wave', sales: 99 },
  { name: 'Extension Afro Naturelle', sales: 56 },
  { name: 'Serre-tête Satin Glowry', sales: 34 },
  { name: 'Extension Lisse Royale', sales: 78 },
  { name: 'Perruque Bob Naturelle', sales: 45 },
  { name: 'Extension Kinky Curl', sales: 62 },
  { name: 'Clip-in Premium 7pcs', sales: 41 },
];

const recentOrders = [
  { number: '#2025-089', date: '31 Mars 2025', client: 'Fatima Zahra B.', total: 1890, status: 'DELIVERED' },
  { number: '#2025-090', date: '31 Mars 2025', client: 'Houda M.', total: 950, status: 'SHIPPED' },
  { number: '#2025-091', date: '31 Mars 2025', client: 'Sanaa A.', total: 1450, status: 'PROCESSING' },
  { number: '#2025-092', date: '30 Mars 2025', client: 'Rim K.', total: 780, status: 'PAID' },
  { number: '#2025-093', date: '30 Mars 2025', client: 'Nadia O.', total: 2200, status: 'DELIVERED' },
];

const pendingReviews = [
  { product: 'Extension Lisse Naturelle', client: 'Fatima Z.', rating: 5, preview: 'Qualité exceptionnelle, je recommande vivement !' },
  { product: 'Perruque Lace Front', client: 'Houda M.', rating: 4, preview: 'Très belle perruque, livraison rapide.' },
  { product: 'Extension Bouclée', client: 'Sara B.', rating: 3, preview: 'Bonne qualité mais...' },
];

const lowStock = [
  { name: 'Extension Afro 30cm', stock: 4 },
  { name: 'Extension Lisse 60cm Châtain', stock: 3 },
  { name: 'Extension Bouclée 50cm Brun', stock: 5 },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'Préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
};

const kpis = [
  { icon: TrendingUp, label: 'CA ce mois', value: '24 500 MAD', trend: '+12% vs M-1', trendPositive: true },
  { icon: Package, label: 'Commandes en cours', value: '8', trend: null, badge: 'blue' },
  { icon: Users, label: 'Nouvelles clientes', value: '23', trend: null, badge: 'purple' },
  { icon: ShoppingBag, label: 'Panier moyen', value: '890 MAD', trend: '+5%', trendPositive: true },
  { icon: Target, label: 'Taux conversion', value: '3.2%', trend: null, badge: null },
  { icon: Star, label: 'Points distribués', value: '1 240 pts', trend: null, badge: null },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#3D2B1F]/50 font-inter mt-0.5">
          Vue d'ensemble — Mars 2025
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {kpis.map(({ icon: Icon, label, value, trend, trendPositive }) => (
          <div
            key={label}
            className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-[#C9A875]" />
              {trend && (
                <span
                  className={`text-xs font-inter font-medium px-2 py-0.5 rounded-full ${
                    trendPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {trend}
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-inter font-bold text-[#1A1410]">{value}</p>
              <p className="text-xs font-inter text-[#3D2B1F]/50 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Revenue chart */}
        <div className="md:col-span-3 bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-5">
            Chiffre d'affaires (12 mois)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A875" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C9A875" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9A875" opacity={0.1} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: 'var(--font-inter)', fill: '#3D2B1F', opacity: 0.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: 'var(--font-inter)', fill: '#3D2B1F', opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#F5EDE0', border: '1px solid #C9A875', borderRadius: 8, fontFamily: 'var(--font-inter)', fontSize: 12 }}
                formatter={(v) => [`${Number(v).toLocaleString('fr-MA')} MAD`]}
              />
              <Line type="monotone" dataKey="revenue" stroke="#C9A875" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#C9A875' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top products chart */}
        <div className="md:col-span-2 bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-5">
            Top 10 produits
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 9, fontFamily: 'var(--font-inter)', fill: '#3D2B1F', opacity: 0.6 }}
                width={100}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ background: '#F5EDE0', border: '1px solid #C9A875', borderRadius: 8, fontFamily: 'var(--font-inter)', fontSize: 12 }}
              />
              <Bar dataKey="sales" fill="#C9A875" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A875]/10">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Commandes récentes</h2>
          <Link href="/admin/commandes" className="text-xs text-[#C9A875] hover:text-[#B8924B] font-inter">
            Voir tout →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A875]/10">
                {['N°', 'Date', 'Cliente', 'Total', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A875]/10">
              {recentOrders.map((order) => {
                const cfg = statusConfig[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={order.number} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-inter font-medium text-[#3D2B1F]">{order.number}</td>
                    <td className="px-4 py-3 text-xs font-inter text-[#3D2B1F]/50">{order.date}</td>
                    <td className="px-4 py-3 text-sm font-inter text-[#3D2B1F]/70">{order.client}</td>
                    <td className="px-4 py-3 text-sm font-inter font-semibold text-[#1A1410]">{order.total.toLocaleString('fr-MA')} MAD</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${cfg.className}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/commandes/${order.number}`} className="text-xs text-[#C9A875] hover:text-[#B8924B] font-inter inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Voir
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending reviews */}
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Avis en attente</h2>
            <span className="text-xs bg-[#C9A875]/20 text-[#B8924B] px-2 py-0.5 rounded-full font-inter font-medium">
              {pendingReviews.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingReviews.map((review, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-[#C9A875]/10 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-inter font-semibold text-[#3D2B1F]">{review.product}</p>
                  <p className="text-xs font-inter text-[#3D2B1F]/50">{review.client} — {'★'.repeat(review.rating)}</p>
                  <p className="text-xs font-inter text-[#3D2B1F]/60 mt-0.5 truncate">{review.preview}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors">
                    <Check className="h-3 w-3" />
                  </button>
                  <button className="p-1.5 rounded-lg bg-red-100 text-red-500 hover:bg-red-200 transition-colors">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Stock bas</h2>
          </div>
          <div className="space-y-3">
            {lowStock.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#C9A875]/10 last:border-0">
                <p className="text-sm font-inter text-[#3D2B1F]/70">{item.name}</p>
                <span className="text-xs font-inter font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  {item.stock} restants
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
