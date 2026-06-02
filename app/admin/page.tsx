'use client';

import { useState, useEffect } from 'react';
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

interface MonthlyRevenue {
  month: string;
  year: number;
  value: number;
}

interface TopProduct {
  sanityProductId: string;
  name: string;
  revenue: number;
  units: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string } | null;
  guestEmail: string | null;
}

interface StatsData {
  revenue: { total: number; monthly: MonthlyRevenue[] };
  orders: { total: number; pending: number; processing: number; shipped: number };
  customers: { total: number; newThisMonth: number };
  topProducts: TopProduct[];
  recentOrders: RecentOrder[];
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'Préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
};

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-[#C9A875]/20 rounded" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5 h-24" />
        ))}
      </div>
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5 h-64" />
        <div className="md:col-span-2 bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5 h-64" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
        const json = await res.json();
        setStats(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 font-inter text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const revenueChartData = stats.revenue.monthly.map((m) => ({
    month: m.month,
    revenue: m.value,
  }));

  const topProductsChart = stats.topProducts.map((p) => ({
    name: p.name,
    sales: p.units,
  }));

  const kpis = [
    {
      icon: TrendingUp,
      label: 'CA total',
      value: `${stats.revenue.total.toLocaleString('fr-MA')} MAD`,
      trend: null,
      trendPositive: true,
    },
    {
      icon: Package,
      label: 'Commandes en cours',
      value: String(stats.orders.processing + stats.orders.shipped),
      trend: null,
      badge: 'blue',
    },
    {
      icon: Users,
      label: 'Nouvelles clientes',
      value: String(stats.customers.newThisMonth),
      trend: null,
      badge: 'purple',
    },
    {
      icon: ShoppingBag,
      label: 'Total commandes',
      value: String(stats.orders.total),
      trend: null,
      badge: null,
    },
    {
      icon: Target,
      label: 'En attente',
      value: String(stats.orders.pending),
      trend: null,
      badge: null,
    },
    {
      icon: Star,
      label: 'Total clientes',
      value: String(stats.customers.total),
      trend: null,
      badge: null,
    },
  ];

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
          Vue d'ensemble
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
            Chiffre d'affaires (6 mois)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueChartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
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
            Top produits
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProductsChart} layout="vertical" margin={{ left: 0, right: 10 }}>
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
              {stats.recentOrders.map((order) => {
                const cfg = statusConfig[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
                const clientName = order.user?.name ?? order.user?.email ?? order.guestEmail ?? '—';
                const orderDate = new Date(order.createdAt).toLocaleDateString('fr-MA', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                return (
                  <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-inter font-medium text-[#3D2B1F]">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-xs font-inter text-[#3D2B1F]/50">{orderDate}</td>
                    <td className="px-4 py-3 text-sm font-inter text-[#3D2B1F]/70">{clientName}</td>
                    <td className="px-4 py-3 text-sm font-inter font-semibold text-[#1A1410]">{order.total.toLocaleString('fr-MA')} MAD</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter font-medium ${cfg.className}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/commandes/${order.id}`} className="text-xs text-[#C9A875] hover:text-[#B8924B] font-inter inline-flex items-center gap-1">
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
        {/* Pending reviews placeholder */}
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Avis en attente</h2>
            <Link href="/admin/avis" className="text-xs text-[#C9A875] hover:text-[#B8924B] font-inter">
              Gérer →
            </Link>
          </div>
          <p className="text-xs font-inter text-[#3D2B1F]/50">
            Consultez la section <Link href="/admin/avis" className="text-[#C9A875] hover:underline">Avis clientes</Link> pour modérer les avis.
          </p>
        </div>

        {/* Low stock placeholder */}
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Alertes stock</h2>
          </div>
          <p className="text-xs font-inter text-[#3D2B1F]/50">
            Les alertes de stock bas sont gérées via Sanity Studio.
          </p>
        </div>
      </div>
    </div>
  );
}
