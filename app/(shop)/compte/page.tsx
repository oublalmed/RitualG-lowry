'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Package, TrendingDown, Star, Trophy, Eye, Loader2 } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';

// ── Types ─────────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: keyof typeof statusConfig;
  total: number | string;
  createdAt: string;
  items: OrderItem[];
}

interface UserProfile {
  loyaltyPoints: number;
  loyaltyTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  referralCode: string;
  createdAt: string;
}

interface SuggestedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const statusConfig = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  PENDING: { label: 'En attente', className: 'bg-gray-100 text-gray-600' },
  REFUNDED: { label: 'Remboursée', className: 'bg-orange-100 text-orange-700' },
};

function getTierLabel(tier: UserProfile['loyaltyTier']) {
  const labels: Record<UserProfile['loyaltyTier'], string> = {
    BRONZE: 'Bronze',
    SILVER: 'Argent',
    GOLD: 'Or',
    PLATINUM: 'Platine',
  };
  return labels[tier] ?? 'Bronze';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CompteDashboard() {
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Cliente';

  const [orders, setOrders] = useState<Order[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<SuggestedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    // If session is still loading, do nothing (show spinner)
    if (session === undefined) return;
    // If session loaded but no user, stop loading (proxy will redirect)
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [ordersRes, profileRes, productsRes] = await Promise.all([
          fetch('/api/account/orders'),
          fetch('/api/account/profile'),
          fetch('/api/products/featured').catch(() => null),
        ]);

        if (ordersRes.ok) {
          const json = await ordersRes.json();
          setOrders(json.data ?? []);
        }

        if (profileRes.ok) {
          const json = await profileRes.json();
          setProfile(json.data ?? null);
        }

        // Featured products endpoint may not exist yet — fall back to empty
        if (productsRes?.ok) {
          const json = await productsRes.json();
          const raw: any[] = json.data ?? [];
          setSuggestedProducts(
            raw.slice(0, 3).map((p: any) => ({
              id: p._id,
              slug: p.slug,
              name: p.name,
              price: p.basePrice,
              comparePrice: p.comparePrice ?? null,
            }))
          );
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session]);

  const loyaltyPoints = profile?.loyaltyPoints ?? session?.user?.loyaltyPoints ?? 0;
  const loyaltyTier = (profile?.loyaltyTier ?? session?.user?.loyaltyTier ?? 'BRONZE') as UserProfile['loyaltyTier'];

  // Calculate real savings: sum of discounts on PAID/DELIVERED orders
  const totalSavings = orders
    .filter((o) => ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(o.status))
    .reduce((sum, o) => sum + (Number((o as any).discount) || 0), 0);

  const savingsLabel = loading
    ? '...'
    : totalSavings > 0
    ? `${totalSavings.toLocaleString('fr-BE')} €`
    : '0 €';

  const stats = [
    { icon: Package, label: 'Commandes', value: String(orders.length), color: 'text-[#C9A875]' },
    { icon: TrendingDown, label: 'Économies', value: savingsLabel, color: 'text-green-600' },
    { icon: Star, label: 'Points', value: String(loyaltyPoints), color: 'text-[#B8924B]' },
    { icon: Trophy, label: 'Tier', value: getTierLabel(loyaltyTier), color: 'text-[#C9A875]' },
  ];

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
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-[#C9A875]/60" />
              ) : (
                <p className="text-2xl font-inter font-bold text-[#1A1410]">{value}</p>
              )}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-[#C9A875]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center">
              <Package className="h-10 w-10 text-[#C9A875]/40 mx-auto mb-3" />
              <p className="font-inter text-sm text-[#3D2B1F]/60">Aucune commande pour l&apos;instant.</p>
              <Link
                href="/boutique"
                className="mt-3 inline-block text-xs font-inter font-semibold text-[#C9A875] hover:underline"
              >
                Découvrir la boutique →
              </Link>
            </div>
          ) : (
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
                  {orders.slice(0, 5).map((order) => {
                    const cfg = statusConfig[order.status] ?? statusConfig.PENDING;
                    const total = typeof order.total === 'number'
                      ? order.total
                      : parseFloat(String(order.total));
                    return (
                      <tr key={order.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                        <td className="px-4 py-3 font-inter text-sm font-medium text-[#3D2B1F]">
                          {order.orderNumber}
                        </td>
                        <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/60">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${cfg.className}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-inter text-sm font-semibold text-[#1A1410]">
                          {total.toLocaleString('fr-BE')} €
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
          )}
        </div>
      </div>

      {/* Personalized suggestions */}
      {suggestedProducts.length > 0 && (
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
      )}
    </div>
  );
}
