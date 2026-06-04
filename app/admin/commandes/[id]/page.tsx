'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING:    { label: 'En attente',     className: 'bg-yellow-100 text-yellow-700' },
  PAID:       { label: 'Payée',          className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED:    { label: 'Expédiée',       className: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: 'Livrée',         className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED:  { label: 'Annulée',        className: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: 'Remboursée',     className: 'bg-orange-100 text-orange-700' },
};

interface OrderItem { id: string; productName: string; variantLabel: string | null; quantity: number; unitPrice: number; totalPrice: number; }
interface OrderDetail {
  id: string; orderNumber: string; status: OrderStatus; createdAt: string; paidAt: string | null;
  shippedAt: string | null; deliveredAt: string | null; subtotal: number; shipping: number;
  discount: number; total: number; currency: string; stripePaymentIntentId: string | null;
  trackingNumber: string | null; trackingUrl: string | null; notes: string | null; promoCode: string | null;
  guestEmail: string | null; shippingMethod: string;
  user: { name: string | null; email: string } | null;
  items: OrderItem[];
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [trackingDialog, setTrackingDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [refundDialog, setRefundDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);

  async function fetchOrder() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/orders/${id}`);
      if (!res.ok) throw new Error('Commande introuvable');
      const json = await res.json();
      setOrder(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (id) fetchOrder(); }, [id]);

  async function updateStatus(status: OrderStatus, extra?: Record<string, string>) {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extra }),
      });
      if (!res.ok) throw new Error('Erreur de mise à jour');
      await fetchOrder();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  }

  async function simulatePayment() {
    if (!order) return;
    setSaving(true);
    try {
      const res = await fetch('/api/dev/simulate-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: order.orderNumber, action: 'pay' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchOrder();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur simulation');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 rounded-full border-2 border-[#C9A875] border-t-transparent animate-spin" />
    </div>
  );

  if (error || !order) return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-[#3D2B1F]/50 hover:text-[#3D2B1F] font-inter mb-4">
        <ArrowLeft className="h-4 w-4" /> Retour
      </Link>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 font-inter text-sm">{error ?? 'Commande introuvable'}</div>
    </div>
  );

  const cfg = statusConfig[order.status] ?? { label: order.status, className: 'bg-gray-100 text-gray-600' };
  const clientName = order.user?.name ?? order.guestEmail ?? '—';
  const clientEmail = order.user?.email ?? order.guestEmail ?? '—';
  const shippingAddress = (() => { try { return JSON.parse(order.notes ?? '{}')?.shippingAddress ?? null; } catch { return null; } })();

  // Timeline built from timestamps
  const timeline: { label: string; date: string | null; done: boolean }[] = [
    { label: 'Commande créée',      date: order.createdAt,    done: true },
    { label: 'Paiement reçu',       date: order.paidAt,       done: !!order.paidAt },
    { label: 'En préparation',      date: null,                done: ['PROCESSING','SHIPPED','DELIVERED'].includes(order.status) },
    { label: 'Expédiée',            date: order.shippedAt,    done: !!order.shippedAt },
    { label: 'Livrée',              date: order.deliveredAt,  done: !!order.deliveredAt },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-[#3D2B1F]/50 hover:text-[#3D2B1F] font-inter transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl text-[#3D2B1F]" style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}>
            {order.orderNumber}
          </h1>
          <p className="text-sm text-[#3D2B1F]/50 font-inter">
            {new Date(order.createdAt).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full font-inter font-medium ${cfg.className}`}>{cfg.label}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="md:col-span-1 space-y-4">
          {/* Customer */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Cliente</h2>
            <p className="text-sm font-inter font-medium text-[#3D2B1F]">{clientName}</p>
            <p className="text-xs font-inter text-[#3D2B1F]/60">{clientEmail}</p>
          </div>

          {/* Shipping address */}
          {shippingAddress && (
            <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
              <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Adresse de livraison</h2>
              <p className="text-sm font-inter text-[#3D2B1F]/70">{shippingAddress.firstName} {shippingAddress.lastName}</p>
              <p className="text-sm font-inter text-[#3D2B1F]/70">{shippingAddress.address}</p>
              <p className="text-sm font-inter text-[#3D2B1F]/70">{shippingAddress.city} {shippingAddress.postalCode}</p>
              {shippingAddress.phone && <p className="text-xs font-inter text-[#3D2B1F]/50 mt-1">{shippingAddress.phone}</p>}
            </div>
          )}

          {/* Payment */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Paiement</h2>
            {order.stripePaymentIntentId ? (
              <>
                <p className="text-xs font-inter text-[#3D2B1F]/50 mb-1">ID Stripe</p>
                <p className="text-xs font-inter font-mono text-[#3D2B1F]/70 bg-[#FAF6EF] px-2 py-1 rounded break-all">{order.stripePaymentIntentId}</p>
              </>
            ) : (
              <p className="text-xs font-inter text-[#3D2B1F]/40">Aucun paiement enregistré</p>
            )}
            {order.promoCode && <p className="text-xs font-inter text-[#C9A875] mt-2">Code promo: {order.promoCode}</p>}
            {order.trackingNumber && (
              <div className="mt-2">
                <p className="text-xs font-inter text-[#3D2B1F]/50 mb-1">Suivi</p>
                <p className="text-sm font-inter font-mono text-[#3D2B1F]">{order.trackingNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm px-4 py-3 border-b border-[#C9A875]/10">
              Articles ({order.items.length})
            </h2>
            <div className="divide-y divide-[#C9A875]/10">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-inter font-medium text-[#3D2B1F] truncate">{item.productName}</p>
                    {item.variantLabel && <p className="text-xs font-inter text-[#3D2B1F]/50">{item.variantLabel}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-inter font-semibold text-[#1A1410]">{Number(item.totalPrice).toLocaleString('fr-BE')} €</p>
                    <p className="text-xs font-inter text-[#3D2B1F]/50">×{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#C9A875]/10 bg-[#FAF6EF]/40 space-y-1">
              <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/60"><span>Sous-total</span><span>{Number(order.subtotal).toLocaleString('fr-BE')} €</span></div>
              <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/60"><span>Livraison ({order.shippingMethod})</span><span>{Number(order.shipping) === 0 ? 'Offerte' : `${Number(order.shipping)} €`}</span></div>
              {Number(order.discount) > 0 && <div className="flex justify-between text-xs font-inter text-green-600"><span>Réduction</span><span>-{Number(order.discount).toLocaleString('fr-BE')} €</span></div>}
              <div className="flex justify-between font-inter font-bold text-[#1A1410] text-sm pt-1 border-t border-[#C9A875]/10"><span>Total</span><span>{Number(order.total).toLocaleString('fr-BE')} €</span></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {/* DEV ONLY: simulate payment */}
            {order.status === 'PENDING' && process.env.NODE_ENV !== 'production' && (
              <Button
                onClick={simulatePayment}
                disabled={saving}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-inter font-semibold text-sm gap-2"
                title="DEV: simule le webhook Stripe payment_intent.succeeded"
              >
                <Zap className="h-4 w-4" /> Simuler paiement (DEV)
              </Button>
            )}

            {order.status === 'PAID' && (
              <Button onClick={() => updateStatus('PROCESSING')} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white font-inter font-semibold text-sm gap-2">
                <Package className="h-4 w-4" /> Mettre en préparation
              </Button>
            )}

            {(order.status === 'PAID' || order.status === 'PROCESSING') && (
              <Button onClick={() => setTrackingDialog(true)} disabled={saving} className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold text-sm gap-2">
                <Truck className="h-4 w-4" /> Marquer expédiée
              </Button>
            )}

            {order.status === 'SHIPPED' && (
              <Button onClick={() => updateStatus('DELIVERED')} disabled={saving} variant="outline" className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2">
                <CheckCircle className="h-4 w-4" /> Marquer livrée
              </Button>
            )}

            {['PAID', 'PROCESSING', 'SHIPPED'].includes(order.status) && (
              <Button onClick={() => setRefundDialog(true)} disabled={saving} variant="outline" className="border-orange-200 text-orange-600 font-inter text-sm gap-2">
                <RefreshCw className="h-4 w-4" /> Rembourser
              </Button>
            )}

            {['PENDING', 'PAID', 'PROCESSING'].includes(order.status) && (
              <Button onClick={() => setCancelDialog(true)} disabled={saving} variant="outline" className="border-red-200 text-red-600 font-inter text-sm gap-2">
                <XCircle className="h-4 w-4" /> Annuler
              </Button>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-4">Suivi de la commande</h2>
            <div className="space-y-3">
              {timeline.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${step.done ? 'bg-[#C9A875]' : 'bg-[#3D2B1F]/15'}`} />
                  <div>
                    <p className={`text-xs font-inter font-medium ${step.done ? 'text-[#3D2B1F]' : 'text-[#3D2B1F]/35'}`}>{step.label}</p>
                    {step.date && (
                      <p className="text-xs font-inter text-[#3D2B1F]/45">
                        {new Date(step.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tracking dialog */}
      <Dialog open={trackingDialog} onOpenChange={setTrackingDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader><DialogTitle className="text-[#3D2B1F] font-inter">Numéro de suivi</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="ex: 1Z999AA10123456784"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-[#C9A875]/30" onClick={() => setTrackingDialog(false)}>Annuler</Button>
              <Button
                className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold"
                onClick={() => { updateStatus('SHIPPED', { trackingNumber }); setTrackingDialog(false); }}
              >
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund dialog */}
      <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader><DialogTitle className="text-orange-700 font-inter">Rembourser la commande</DialogTitle></DialogHeader>
          <p className="text-sm font-inter text-[#3D2B1F]/70 mt-2">
            Rembourser {order.orderNumber} ({Number(order.total).toLocaleString('fr-BE')} €) ?
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setRefundDialog(false)}>Annuler</Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold" onClick={() => { updateStatus('REFUNDED'); setRefundDialog(false); }}>
              Rembourser
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader><DialogTitle className="text-red-700 font-inter">Annuler la commande</DialogTitle></DialogHeader>
          <p className="text-sm font-inter text-[#3D2B1F]/70 mt-2">
            Annuler définitivement {order.orderNumber} ?
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setCancelDialog(false)}>Retour</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold" onClick={() => { updateStatus('CANCELLED'); setCancelDialog(false); }}>
              Annuler la commande
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
