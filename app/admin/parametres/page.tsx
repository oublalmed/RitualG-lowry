'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Settings {
  boutique: { name: string; email: string; phone: string; address: string };
  loyalty: { pointsPerMad: number; bronzeThreshold: number; silverThreshold: number; goldThreshold: number; platinumThreshold: number };
  shipping: { freeThreshold: number; standardPrice: number; expressPrice: number; premiumPrice: number };
  maintenance: { enabled: boolean; message: string };
}

const defaultSettings: Settings = {
  boutique: { name: 'Ritual Glowry', email: 'contact@ritualglowry.ma', phone: '+212 5 22 XX XX XX', address: 'Casablanca, Maroc' },
  loyalty: { pointsPerMad: 1, bronzeThreshold: 0, silverThreshold: 500, goldThreshold: 1500, platinumThreshold: 5000 },
  shipping: { freeThreshold: 900, standardPrice: 49, expressPrice: 99, premiumPrice: 149 },
  maintenance: { enabled: false, message: 'Notre boutique est temporairement en maintenance. Revenez très bientôt !' },
};

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function ParametresPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setSaveState('saving');
      setSaveError(null);
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erreur inconnue');
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const updateBoutique = (key: keyof Settings['boutique'], value: string) =>
    setSettings((prev) => ({ ...prev, boutique: { ...prev.boutique, [key]: value } }));

  const updateLoyalty = (key: keyof Settings['loyalty'], value: number) =>
    setSettings((prev) => ({ ...prev, loyalty: { ...prev.loyalty, [key]: value } }));

  const updateShipping = (key: keyof Settings['shipping'], value: number) =>
    setSettings((prev) => ({ ...prev, shipping: { ...prev.shipping, [key]: value } }));

  const updateMaintenance = (key: keyof Settings['maintenance'], value: boolean | string) =>
    setSettings((prev) => ({ ...prev, maintenance: { ...prev.maintenance, [key]: value } }));

  const saveLabel =
    saveState === 'saving'
      ? 'Enregistrement...'
      : saveState === 'saved'
      ? '✓ Paramètres enregistrés !'
      : saveState === 'error'
      ? 'Erreur — réessayer'
      : 'Enregistrer les paramètres';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Paramètres
      </h1>

      {saveState === 'error' && saveError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-inter text-sm">
          {saveError}
        </div>
      )}

      {saveState === 'saved' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 font-inter text-sm">
          Paramètres enregistrés avec succès. En production, les paramètres de contenu sont gérés via Sanity Studio.
        </div>
      )}

      <Tabs defaultValue="boutique">
        <TabsList className="bg-[#F5EDE0] border border-[#C9A875]/15 p-1">
          {['boutique', 'fidelite', 'livraison', 'maintenance'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-[#C9A875] data-[state=active]:text-[#1A1410] font-inter text-sm capitalize"
            >
              {tab === 'fidelite' ? 'Fidélité' : tab === 'boutique' ? 'Boutique' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Boutique tab */}
        <TabsContent value="boutique" className="mt-4">
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6 space-y-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Informations boutique</h2>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Nom de la boutique</Label>
              <Input
                value={settings.boutique.name}
                onChange={(e) => updateBoutique('name', e.target.value)}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
              />
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Email contact</Label>
              <Input
                type="email"
                value={settings.boutique.email}
                onChange={(e) => updateBoutique('email', e.target.value)}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
              />
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Téléphone</Label>
              <Input
                value={settings.boutique.phone}
                onChange={(e) => updateBoutique('phone', e.target.value)}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
              />
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Adresse</Label>
              <Input
                value={settings.boutique.address}
                onChange={(e) => updateBoutique('address', e.target.value)}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
              />
            </div>
          </div>
        </TabsContent>

        {/* Loyalty tab */}
        <TabsContent value="fidelite" className="mt-4">
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6 space-y-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Programme fidélité</h2>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Points gagnés par € dépensé</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={settings.loyalty.pointsPerMad}
                onChange={(e) => updateLoyalty('pointsPerMad', parseFloat(e.target.value))}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410] w-32"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(['bronzeThreshold', 'silverThreshold', 'goldThreshold', 'platinumThreshold'] as const).map((key) => (
                <div key={key}>
                  <Label className="text-[#3D2B1F] font-inter text-sm capitalize">
                    Seuil {key.replace('Threshold', '').charAt(0).toUpperCase() + key.replace('Threshold', '').slice(1)} (pts)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.loyalty[key]}
                    onChange={(e) => updateLoyalty(key, parseInt(e.target.value))}
                    className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Shipping tab */}
        <TabsContent value="livraison" className="mt-4">
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6 space-y-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Tarifs de livraison</h2>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Seuil livraison gratuite (€)</Label>
              <Input
                type="number"
                min="0"
                value={settings.shipping.freeThreshold}
                onChange={(e) => updateShipping('freeThreshold', parseInt(e.target.value))}
                className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410] w-40"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['standardPrice', 'expressPrice', 'premiumPrice'] as const).map((key) => (
                <div key={key}>
                  <Label className="text-[#3D2B1F] font-inter text-sm">
                    {key === 'standardPrice' ? 'Standard' : key === 'expressPrice' ? 'Express' : 'Premium'} (€)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.shipping[key]}
                    onChange={(e) => updateShipping(key, parseInt(e.target.value))}
                    className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]"
                  />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Maintenance tab */}
        <TabsContent value="maintenance" className="mt-4">
          <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6 space-y-4">
            <h2 className="font-inter font-semibold text-[#3D2B1F] text-sm">Mode maintenance</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateMaintenance('enabled', !settings.maintenance.enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.maintenance.enabled ? 'bg-[#C9A875]' : 'bg-[#3D2B1F]/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="font-inter text-sm text-[#3D2B1F]">
                {settings.maintenance.enabled ? 'Mode maintenance activé' : 'Mode maintenance désactivé'}
              </span>
            </div>
            {settings.maintenance.enabled && (
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Message personnalisé</Label>
                <textarea
                  value={settings.maintenance.message}
                  onChange={(e) => updateMaintenance('message', e.target.value)}
                  rows={3}
                  className="mt-1 w-full bg-[#FAF6EF] border border-[#C9A875]/30 rounded-lg px-3 py-2 text-sm font-inter text-[#1A1410] resize-none outline-none focus:border-[#C9A875]"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleSave}
        disabled={saveState === 'saving'}
        className={`font-inter font-semibold ${
          saveState === 'error'
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410]'
        }`}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
