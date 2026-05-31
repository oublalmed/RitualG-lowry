'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') ?? 'LUX-2026-XXXXX';
  const email = searchParams.get('email') ?? '';

  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF6EF] flex flex-col items-center justify-center px-6 py-20">
      {/* Animated checkmark */}
      <div className="mb-8">
        <svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="drop-shadow-sm">
          {/* Circle */}
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            stroke="#C9A875"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
          {/* Check */}
          <motion.path
            d="M28 48L42 62L68 34"
            stroke="#C9A875"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: drawn ? 1 : 0, opacity: drawn ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
          />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center max-w-lg"
      >
        <h1 className="font-playfair italic text-3xl sm:text-4xl text-[#3D2B1F] mb-3">
          Merci pour votre commande&nbsp;!
        </h1>

        {/* Order number badge */}
        <div className="inline-flex items-center gap-2 bg-[#C9A875]/15 border border-[#C9A875]/40 px-5 py-2 mb-5">
          <span className="text-xs font-inter font-semibold text-[#3D2B1F]/60 uppercase tracking-widest">
            Commande
          </span>
          <span className="font-playfair italic text-[#C9A875] font-bold text-lg">
            {orderNumber}
          </span>
        </div>

        {email && (
          <p className="text-sm font-inter text-[#3D2B1F]/60 mb-2">
            Un email de confirmation a été envoyé à&nbsp;:
            <br />
            <span className="font-semibold text-[#3D2B1F]">{email}</span>
          </p>
        )}

        <p className="text-sm font-inter text-[#3D2B1F]/50 mb-8">
          Livraison estimée&nbsp;: <span className="font-semibold text-[#3D2B1F]">3-5 jours ouvrés</span>
        </p>

        {/* Order recap placeholder */}
        <div className="bg-[#F5EDE0] border border-[#3D2B1F]/10 p-6 mb-8 text-left">
          <p className="font-inter text-xs uppercase tracking-widest text-[#3D2B1F]/40 mb-3">
            Récapitulatif
          </p>
          <div className="flex justify-between items-center text-sm font-inter text-[#3D2B1F]/70">
            <span>Voir les détails complets de la commande</span>
          </div>
          <Link
            href="/compte/commandes"
            className="block mt-3 text-xs font-inter text-[#C9A875] hover:text-[#B8924B] transition-colors"
          >
            Accéder à mes commandes →
          </Link>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/compte/commandes"
            className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold uppercase tracking-widest text-sm px-8 py-4 transition-colors duration-300 text-center"
          >
            Voir ma commande
          </Link>
          <Link
            href="/boutique"
            className="border border-[#3D2B1F] text-[#3D2B1F] hover:bg-[#3D2B1F] hover:text-[#FAF6EF] font-inter font-semibold uppercase tracking-widest text-sm px-8 py-4 transition-colors duration-300 text-center"
          >
            Continuer les achats
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EF] flex items-center justify-center">
          <p className="font-inter text-[#3D2B1F]/50">Chargement...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
