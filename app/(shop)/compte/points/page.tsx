'use client';

import { useState } from 'react';
import { Trophy, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TIER_THRESHOLDS = { BRONZE: 0, SILVER: 500, GOLD: 1500, PLATINUM: 5000 };
const TIER_LABELS = { BRONZE: 'Bronze', SILVER: 'Silver', GOLD: 'Gold', PLATINUM: 'Platinum' };
const TIER_COLORS = {
  BRONZE: 'bg-[#C9A875]/20 text-[#B8924B]',
  SILVER: 'bg-gray-200 text-gray-600',
  GOLD: 'bg-yellow-100 text-yellow-700',
  PLATINUM: 'bg-[#3D2B1F]/10 text-[#3D2B1F]',
};

type Tier = keyof typeof TIER_THRESHOLDS;

function getNextTier(current: Tier): Tier | null {
  const tiers: Tier[] = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  const idx = tiers.indexOf(current);
  return idx < tiers.length - 1 ? tiers[idx + 1] : null;
}

const mockPoints = 127;
const currentTier: Tier = 'BRONZE';

const tiers: { key: Tier; benefits: string[] }[] = [
  { key: 'BRONZE', benefits: ['Accès aux ventes privées', 'Points sur chaque commande'] },
  { key: 'SILVER', benefits: ['Livraison offerte sur toutes commandes', 'Accès prioritaire aux nouveautés'] },
  { key: 'GOLD', benefits: ['-15% permanent sur tout le site', "Cadeau d'anniversaire personnalise"] },
  { key: 'PLATINUM', benefits: ['Concierge dédié', 'Accès pré-lancement collections', 'Service VIP exclusif'] },
];

const mockTransactions = [
  { id: '1', date: '20 Fév 2025', type: 'EARNED', description: 'Commande #2024-003', points: +29 },
  { id: '2', date: '02 Fév 2025', type: 'EARNED', description: 'Commande #2024-002', points: +19 },
  { id: '3', date: '15 Jan 2025', type: 'SPENT', description: 'Réduction appliquée', points: -50 },
  { id: '4', date: '15 Jan 2025', type: 'EARNED', description: 'Commande #2024-001', points: +38 },
  { id: '5', date: '10 Jan 2025', type: 'REFERRAL', description: 'Parrainage — Meryem B.', points: +100 },
];

const txConfig = {
  EARNED: { label: 'Gagné', className: 'bg-[#C9A875]/20 text-[#B8924B]' },
  SPENT: { label: 'Utilisé', className: 'bg-[#C9A8A0]/30 text-[#3D2B1F]/60' },
  REFERRAL: { label: 'Parrainage', className: 'bg-[#C9A875]/40 text-[#B8924B] font-semibold' },
};

export default function PointsPage() {
  const [copied, setCopied] = useState(false);
  const nextTier = getNextTier(currentTier);
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : TIER_THRESHOLDS.PLATINUM;
  const currentThreshold = TIER_THRESHOLDS[currentTier];
  const progress = Math.round(((mockPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100);
  const missing = nextThreshold - mockPoints;

  const referralLink = 'https://ritualglowry.com/ref/FZAHRA123';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Mes points fidélité
      </h1>

      {/* Points overview */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6">
        <div className="flex items-end gap-4 mb-4">
          <span
            className="text-6xl font-inter font-bold text-[#C9A875]"
          >
            {mockPoints}
          </span>
          <div className="pb-2">
            <span className="text-[#3D2B1F]/60 font-inter text-lg">pts</span>
            <div className="mt-1">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-inter font-medium ${TIER_COLORS[currentTier]}`}>
                {TIER_LABELS[currentTier]}
              </span>
            </div>
          </div>
        </div>

        {nextTier && (
          <>
            <div className="flex justify-between text-xs font-inter text-[#3D2B1F]/50 mb-1.5">
              <span>{TIER_LABELS[currentTier]}</span>
              <span>{TIER_LABELS[nextTier]}</span>
            </div>
            <div className="h-2 bg-[#C9A875]/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A875] rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs font-inter text-[#3D2B1F]/50 mt-2">
              {missing} points manquants pour atteindre {TIER_LABELS[nextTier]}
            </p>
          </>
        )}
      </div>

      {/* Tier benefits */}
      <div>
        <h2
          className="text-lg text-[#3D2B1F] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Avantages par tier
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {tiers.map((tier) => {
            const isActive = tier.key === currentTier;
            return (
              <div
                key={tier.key}
                className={`rounded-xl border p-4 ${
                  isActive
                    ? 'border-[#C9A875]/50 bg-[#C9A875]/10'
                    : 'border-[#C9A875]/10 bg-[#F5EDE0]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className={`h-4 w-4 ${isActive ? 'text-[#C9A875]' : 'text-[#3D2B1F]/30'}`} />
                  <span
                    className={`text-sm font-inter font-semibold ${isActive ? 'text-[#B8924B]' : 'text-[#3D2B1F]/50'}`}
                  >
                    {TIER_LABELS[tier.key]}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-xs text-[#B8924B] font-inter bg-[#C9A875]/20 px-2 py-0.5 rounded-full">
                      Actuel
                    </span>
                  )}
                </div>
                <ul className="space-y-1">
                  {tier.benefits.map((b) => (
                    <li key={b} className={`text-xs font-inter ${isActive ? 'text-[#3D2B1F]/70' : 'text-[#3D2B1F]/40'}`}>
                      • {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <h2
          className="text-lg text-[#3D2B1F] mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Historique des transactions
        </h2>
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A875]/15">
                {['Date', 'Type', 'Description', 'Points'].map((h) => (
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
              {mockTransactions.map((tx) => {
                const cfg = txConfig[tx.type as keyof typeof txConfig] ?? txConfig.EARNED;
                return (
                  <tr key={tx.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-inter text-[#3D2B1F]/50">{tx.date}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-inter ${cfg.className}`}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-inter text-[#3D2B1F]/70">{tx.description}</td>
                    <td
                      className={`px-4 py-3 text-sm font-inter font-semibold ${
                        tx.points > 0 ? 'text-[#B8924B]' : 'text-[#3D2B1F]/50'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Referral */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/15 p-6">
        <h2
          className="text-lg text-[#3D2B1F] mb-1"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Parrainez vos amies
        </h2>
        <p className="text-sm font-inter text-[#3D2B1F]/60 mb-4">
          Gagnez <strong className="text-[#B8924B]">100 pts</strong> pour chaque amie parrainée !
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={referralLink}
            className="flex-1 bg-[#FAF6EF] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#3D2B1F]/70"
          />
          <Button
            onClick={handleCopy}
            className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold gap-2 px-4"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copié !' : 'Copier'}
          </Button>
        </div>
      </div>
    </div>
  );
}
