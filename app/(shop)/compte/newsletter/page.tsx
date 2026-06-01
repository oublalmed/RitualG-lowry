'use client';

import { useState } from 'react';
import { Mail, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const preferences = [
  { id: 'nouveautes', label: 'Nouveautés & collections', description: 'Soyez la première à découvrir nos nouvelles collections' },
  { id: 'promos', label: 'Promotions & ventes privées', description: 'Offres exclusives réservées aux membres' },
  { id: 'conseils', label: 'Conseils beaute & tutoriels', description: "Guides d'entretien, tutoriels coiffure, astuces pro" },
  { id: 'points', label: 'Alertes points fidélité', description: 'Notifications pour vos points et récompenses' },
];

export default function NewsletterPage() {
  const [subscribed, setSubscribed] = useState(true);
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    nouveautes: true,
    promos: true,
    conseils: false,
    points: true,
  });
  const [saved, setSaved] = useState(false);

  const togglePref = (id: string) => {
    setPrefs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Newsletter
      </h1>

      {/* Subscription status */}
      <div className={`rounded-xl border p-6 ${subscribed ? 'bg-[#F5EDE0] border-[#C9A875]/15' : 'bg-red-50/30 border-red-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {subscribed ? (
              <Bell className="h-5 w-5 text-[#C9A875]" />
            ) : (
              <BellOff className="h-5 w-5 text-red-400" />
            )}
            <div>
              <p className="font-inter font-semibold text-[#3D2B1F] text-sm">
                {subscribed ? 'Abonnée à la newsletter' : 'Désabonnée de la newsletter'}
              </p>
              <p className="text-xs font-inter text-[#3D2B1F]/50">
                {subscribed
                  ? 'Vous recevez nos emails selon vos préférences ci-dessous'
                  : 'Vous ne recevez plus nos emails'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setSubscribed(!subscribed)}
            className={`text-sm font-inter font-medium ${
              subscribed
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-[#C9A875]/30 text-[#C9A875] hover:bg-[#F5EDE0]'
            }`}
          >
            {subscribed ? 'Se désabonner' : 'Se réabonner'}
          </Button>
        </div>
      </div>

      {/* Preferences */}
      {subscribed && (
        <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Mail className="h-4 w-4 text-[#C9A875]" />
            <h2 className="font-inter font-semibold text-[#3D2B1F]">Mes préférences</h2>
          </div>
          <div className="space-y-4">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-start gap-3">
                <Checkbox
                  id={pref.id}
                  checked={prefs[pref.id] ?? false}
                  onCheckedChange={() => togglePref(pref.id)}
                  className="mt-0.5 border-[#C9A875]/40 data-[state=checked]:bg-[#C9A875] data-[state=checked]:border-[#C9A875]"
                />
                <label htmlFor={pref.id} className="cursor-pointer">
                  <p className="text-sm font-inter font-medium text-[#3D2B1F]">{pref.label}</p>
                  <p className="text-xs font-inter text-[#3D2B1F]/50 mt-0.5">{pref.description}</p>
                </label>
              </div>
            ))}
          </div>
          <Button
            onClick={handleSave}
            className="mt-6 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold"
          >
            {saved ? '✓ Préférences enregistrées !' : 'Enregistrer mes préférences'}
          </Button>
        </div>
      )}
    </div>
  );
}
