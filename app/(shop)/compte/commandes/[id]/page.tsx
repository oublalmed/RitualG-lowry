'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, ArrowLeft, CheckCircle, Circle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PrintStyles = () => (
  <style>{`
    @media print {
      header, nav, aside, .no-print { display: none !important; }
      body { background: white !important; }
    }
  `}</style>
);

const mockOrderDetails: Record<
  string,
  {
    number: string;
    date: string;
    status: string;
    timeline: { step: string; date: string | null; done: boolean }[];
    address: { name: string; line1: string; city: string; phone: string };
    method: string;
    items: { name: string; variant: string; qty: number; price: number }[];
    subtotal: number;
    shipping: number;
    total: number;
  }
> = {
  'ORD-001': {
    number: '#2024-001',
    date: '15 Jan 2025',
    status: 'DELIVERED',
    timeline: [
      { step: 'Commandée', date: '15 Jan 2025', done: true },
      { step: 'Préparée', date: '16 Jan 2025', done: true },
      { step: 'Expédiée', date: '17 Jan 2025', done: true },
      { step: 'Livrée', date: '20 Jan 2025', done: true },
    ],
    address: { name: 'Fatima Zahra', line1: '12 Rue Al Amal', city: 'Casablanca 20000', phone: '+212 6 12 34 56 78' },
    method: 'Express (2-3 jours)',
    items: [
      { name: 'Extension Lisse Naturelle', variant: '50cm - Noir Naturel', qty: 1, price: 990 },
      { name: 'Serre-tête Satin Glowry', variant: 'Beige', qty: 1, price: 180 },
      { name: 'Extension Bouclée Sublime', variant: '40cm - Noir', qty: 1, price: 950 },
    ],
    subtotal: 2120,
    shipping: 0,
    total: 1890,
  },
  'ORD-002': {
    number: '#2024-002',
    date: '02 Fév 2025',
    status: 'SHIPPED',
    timeline: [
      { step: 'Commandée', date: '02 Fév 2025', done: true },
      { step: 'Préparée', date: '03 Fév 2025', done: true },
      { step: 'Expédiée', date: '04 Fév 2025', done: true },
      { step: 'Livrée', date: null, done: false },
    ],
    address: { name: 'Fatima Zahra', line1: '12 Rue Al Amal', city: 'Casablanca 20000', phone: '+212 6 12 34 56 78' },
    method: 'Standard (4-5 jours)',
    items: [{ name: 'Extension Bouclée Sublime', variant: '40cm - Noir', qty: 1, price: 950 }],
    subtotal: 950,
    shipping: 49,
    total: 950,
  },
  'ORD-003': {
    number: '#2024-003',
    date: '20 Fév 2025',
    status: 'PROCESSING',
    timeline: [
      { step: 'Commandée', date: '20 Fév 2025', done: true },
      { step: 'Préparée', date: null, done: false },
      { step: 'Expédiée', date: null, done: false },
      { step: 'Livrée', date: null, done: false },
    ],
    address: { name: 'Fatima Zahra', line1: '12 Rue Al Amal', city: 'Casablanca 20000', phone: '+212 6 12 34 56 78' },
    method: 'Express (2-3 jours)',
    items: [{ name: 'Perruque Lace Front Premium', variant: '14 pouces - Noir', qty: 1, price: 1450 }],
    subtotal: 1450,
    shipping: 0,
    total: 1450,
  },
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const order = mockOrderDetails[id];

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="font-inter text-[#3D2B1F]/50">Commande introuvable.</p>
        <Link href="/compte/commandes" className="text-[#C9A875] text-sm font-inter mt-4 inline-block">
          ← Retour aux commandes
        </Link>
      </div>
    );
  }

  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <PrintStyles />
      {/* Back */}
      <Link
        href="/compte/commandes"
        className="inline-flex items-center gap-2 text-sm text-[#3D2B1F]/50 hover:text-[#3D2B1F] font-inter transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux commandes
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl text-[#3D2B1F]"
            style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
          >
            Commande {order.number}
          </h1>
          <p className="text-sm text-[#3D2B1F]/50 font-inter mt-0.5">{order.date}</p>
        </div>
        <Button
          variant="outline"
          className="border-[#C9A875]/30 text-[#3D2B1F] font-inter text-sm gap-2 no-print"
          onClick={() => window.print()}
        >
          <Download className="h-4 w-4" />
          Télécharger la facture
        </Button>
      </div>

      {/* Timeline */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6">
        <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-5">Suivi de commande</h2>
        <div className="flex items-start gap-0 relative">
          {order.timeline.map((step, i) => (
            <div key={step.step} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {i < order.timeline.length - 1 && (
                <div
                  className={`absolute top-[11px] left-1/2 w-full h-0.5 ${
                    order.timeline[i + 1].done ? 'bg-[#C9A875]' : 'bg-[#C9A875]/20'
                  }`}
                />
              )}
              {/* Circle */}
              <div className="relative z-10">
                {step.done ? (
                  <CheckCircle className="h-6 w-6 text-[#C9A875]" />
                ) : (
                  <Circle className="h-6 w-6 text-[#C9A875]/30" />
                )}
              </div>
              <p className={`mt-2 text-xs font-inter text-center ${step.done ? 'text-[#3D2B1F]' : 'text-[#3D2B1F]/30'}`}>
                {step.step}
              </p>
              {step.date && (
                <p className="text-xs font-inter text-[#3D2B1F]/40 text-center">{step.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Shipping */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Adresse de livraison</h2>
          <p className="text-sm font-inter text-[#3D2B1F]/70 font-medium">{order.address.name}</p>
          <p className="text-sm font-inter text-[#3D2B1F]/60">{order.address.line1}</p>
          <p className="text-sm font-inter text-[#3D2B1F]/60">{order.address.city}</p>
          <p className="text-sm font-inter text-[#3D2B1F]/60">{order.address.phone}</p>
        </div>
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Méthode de livraison</h2>
          <p className="text-sm font-inter text-[#3D2B1F]/70">{order.method}</p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm px-5 py-4 border-b border-[#C9A875]/10">
          Articles commandés
        </h2>
        <div className="divide-y divide-[#C9A875]/10">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              {/* Placeholder image */}
              <div
                className="h-14 w-14 rounded-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #3D2B1F 0%, #C9A875 100%)' }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-inter font-medium text-sm text-[#3D2B1F] truncate">{item.name}</p>
                <p className="text-xs font-inter text-[#3D2B1F]/50">{item.variant}</p>
              </div>
              <div className="text-right">
                <p className="font-inter text-sm font-semibold text-[#1A1410]">
                  {item.price.toLocaleString('fr-MA')} MAD
                </p>
                <p className="text-xs font-inter text-[#3D2B1F]/50">Qté : {item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-5 py-4 border-t border-[#C9A875]/15 bg-[#FAF6EF]/40 space-y-1.5">
          <div className="flex justify-between text-sm font-inter text-[#3D2B1F]/70">
            <span>Sous-total</span>
            <span>{order.subtotal.toLocaleString('fr-MA')} MAD</span>
          </div>
          <div className="flex justify-between text-sm font-inter text-[#3D2B1F]/70">
            <span>Livraison</span>
            <span>{order.shipping === 0 ? 'Offerte' : `${order.shipping} MAD`}</span>
          </div>
          <div className="flex justify-between font-inter font-bold text-[#1A1410] text-base pt-1 border-t border-[#C9A875]/15">
            <span>Total</span>
            <span>{order.total.toLocaleString('fr-MA')} MAD</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isDelivered && (
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-5">
          <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm mb-3">Laisser un avis</h2>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-inter text-[#3D2B1F]/70">{item.name}</span>
                <button className="inline-flex items-center gap-1.5 text-xs font-inter text-[#C9A875] hover:text-[#B8924B] transition-colors">
                  <Star className="h-3.5 w-3.5" />
                  Laisser un avis
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
