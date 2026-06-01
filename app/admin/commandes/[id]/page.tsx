'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ORDER_STATUSES = ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PAID: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  PROCESSING: { label: 'En préparation', className: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
  DELIVERED: { label: 'Livrée', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  CANCELLED: { label: 'Annulée', className: 'bg-red-100 text-red-700' },
  REFUNDED: { label: 'Remboursée', className: 'bg-orange-100 text-orange-700' },
};

const mockOrderDetail = {
  number: '#2025-089',
  createdAt: '31 Mars 2025, 14:32',
  status: 'SHIPPED' as OrderStatus,
  customer: { name: 'Fatima Zahra Benali', email: 'fatima@email.ma', phone: '+212 6 12 34 56 78' },
  shipping: { line1: '12 Rue Al Amal', city: 'Casablanca 20000', country: 'Maroc' },
  payment: { stripeId: 'pi_3Pxxx123', method: 'Carte Visa ****4242', amount: 1890 },
  items: [
    { name: 'Extension Lisse Naturelle', variant: '50cm - Noir Naturel', qty: 1, price: 990 },
    { name: 'Extension Bouclée Sublime', variant: '40cm - Noir', qty: 1, price: 950 },
  ],
  subtotal: 1940,
  shipping_cost: 0,
  discount: 50,
  total: 1890,
  timeline: [
    { status: 'PAID', date: '31 Mars 2025, 14:32', note: 'Paiement reçu via Stripe' },
    { status: 'PROCESSING', date: '31 Mars 2025, 16:00', note: 'Commande prise en charge' },
    { status: 'SHIPPED', date: '01 Avr 2025, 09:15', note: 'Envoyée via Amana Express' },
  ],
  notes: [] as string[],
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(mockOrderDetail.status);
  const [trackingDialog, setTrackingDialog] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [refundDialog, setRefundDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [notes, setNotes] = useState<string[]>([]);

  const handleAddNote = () => {
    if (noteValue.trim()) {
      setNotes((prev) => [...prev, noteValue.trim()]);
      setNoteValue('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-2 text-sm text-[#3D2B1F]/50 hover:text-[#3D2B1F] font-inter transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux commandes
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl text-[#3D2B1F]"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Commande {mockOrderDetail.number}
          </h1>
          <p className="text-sm text-[#3D2B1F]/50 font-inter">{mockOrderDetail.createdAt}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
            className="bg-[#F5EDE0] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F] outline-none"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-inter font-medium ${statusConfig[currentStatus].className}`}>
            {statusConfig[currentStatus].label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {/* Customer + Address */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Cliente</h2>
            <p className="text-sm font-inter font-medium text-[#3D2B1F]">{mockOrderDetail.customer.name}</p>
            <p className="text-xs font-inter text-[#3D2B1F]/60">{mockOrderDetail.customer.email}</p>
            <p className="text-xs font-inter text-[#3D2B1F]/60">{mockOrderDetail.customer.phone}</p>
          </div>
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Adresse de livraison</h2>
            <p className="text-sm font-inter text-[#3D2B1F]/70">{mockOrderDetail.shipping.line1}</p>
            <p className="text-sm font-inter text-[#3D2B1F]/70">{mockOrderDetail.shipping.city}</p>
            <p className="text-sm font-inter text-[#3D2B1F]/70">{mockOrderDetail.shipping.country}</p>
          </div>
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Paiement</h2>
            <p className="text-xs font-inter text-[#3D2B1F]/50 mb-1">ID Stripe</p>
            <p className="text-xs font-inter font-mono text-[#3D2B1F]/70 bg-[#FAF6EF] px-2 py-1 rounded">{mockOrderDetail.payment.stripeId}</p>
            <p className="text-sm font-inter text-[#3D2B1F]/70 mt-2">{mockOrderDetail.payment.method}</p>
          </div>
        </div>

        {/* Items + Actions */}
        <div className="md:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm px-4 py-3 border-b border-[#C9A875]/10">Articles</h2>
            <div className="divide-y divide-[#C9A875]/10">
              {mockOrderDetail.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="h-10 w-10 rounded-lg flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-inter font-medium text-[#3D2B1F]">{item.name}</p>
                    <p className="text-xs font-inter text-[#3D2B1F]/50">{item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-inter font-semibold text-[#1A1410]">{item.price.toLocaleString('fr-MA')} MAD</p>
                    <p className="text-xs font-inter text-[#3D2B1F]/50">×{item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-[#C9A875]/10 bg-[#FAF6EF]/40 space-y-1">
              <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/60"><span>Sous-total</span><span>{mockOrderDetail.subtotal.toLocaleString('fr-MA')} MAD</span></div>
              <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/60"><span>Livraison</span><span>{mockOrderDetail.shipping_cost === 0 ? 'Offerte' : `${mockOrderDetail.shipping_cost} MAD`}</span></div>
              <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/60"><span>Réduction</span><span>-{mockOrderDetail.discount} MAD</span></div>
              <div className="flex justify-between font-inter font-bold text-[#1A1410] text-sm pt-1 border-t border-[#C9A875]/10"><span>Total</span><span>{mockOrderDetail.total.toLocaleString('fr-MA')} MAD</span></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setTrackingDialog(true)} className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold text-sm gap-2">
              <Truck className="h-4 w-4" /> Marquer comme expédi��e
            </Button>
            <Button variant="outline" className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2">
              <CheckCircle className="h-4 w-4" /> Marquer comme livrée
            </Button>
            <Button variant="outline" onClick={() => setRefundDialog(true)} className="border-orange-200 text-orange-600 font-inter text-sm gap-2">
              <RefreshCw className="h-4 w-4" /> Rembourser
            </Button>
            <Button variant="outline" onClick={() => setCancelDialog(true)} className="border-red-200 text-red-600 font-inter text-sm gap-2">
              <XCircle className="h-4 w-4" /> Annuler
            </Button>
          </div>

          {/* Timeline */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Historique</h2>
            <div className="space-y-3">
              {mockOrderDetail.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#C9A875] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-inter font-medium text-[#3D2B1F]">
                      {statusConfig[entry.status as OrderStatus]?.label}
                    </p>
                    <p className="text-xs font-inter text-[#3D2B1F]/50">{entry.date} — {entry.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal notes */}
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Notes internes</h2>
            {notes.length > 0 && (
              <div className="space-y-2 mb-3">
                {notes.map((note, i) => (
                  <div key={i} className="bg-[#FAF6EF] px-3 py-2 rounded-lg text-xs font-inter text-[#3D2B1F]/70">
                    {note}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder="Ajouter une note interne..."
                className="flex-1 bg-[#FAF6EF] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#1A1410] resize-none outline-none focus:border-[#C9A875]"
                rows={2}
              />
              <Button onClick={handleAddNote} className="bg-[#3D2B1F] hover:bg-[#1A1410] text-[#FAF6EF] font-inter text-sm self-end">
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracking dialog */}
      <Dialog open={trackingDialog} onOpenChange={setTrackingDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#3D2B1F] font-inter">Numéro de suivi</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input
              placeholder="ex: 1Z999AA10123456784"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-[#C9A875]/30" onClick={() => setTrackingDialog(false)}>Annuler</Button>
              <Button className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold" onClick={() => { setCurrentStatus('SHIPPED'); setTrackingDialog(false); }}>Confirmer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund dialog */}
      <Dialog open={refundDialog} onOpenChange={setRefundDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-orange-700 font-inter">Rembourser la commande</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-inter text-[#3D2B1F]/70 mt-2">
            Êtes-vous sûre de vouloir rembourser la commande {mockOrderDetail.number} ({mockOrderDetail.total.toLocaleString('fr-MA')} MAD) ?
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setRefundDialog(false)}>Annuler</Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold" onClick={() => { setCurrentStatus('REFUNDED'); setRefundDialog(false); }}>Rembourser</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-700 font-inter">Annuler la commande</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-inter text-[#3D2B1F]/70 mt-2">
            Êtes-vous sûre de vouloir annuler la commande {mockOrderDetail.number} ?
          </p>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setCancelDialog(false)}>Retour</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold" onClick={() => { setCurrentStatus('CANCELLED'); setCancelDialog(false); }}>Annuler la commande</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
