'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  uses: number;
  maxUses: number | null;
  validUntil: string | null;
  isActive: boolean;
}

const mockPromos: PromoCode[] = [
  { id: '1', code: 'GLOWRY20', type: 'PERCENTAGE', value: 20, uses: 45, maxUses: 100, validUntil: '30 Avr 2025', isActive: true },
  { id: '2', code: 'BIENVENUE', type: 'FIXED', value: 100, uses: 12, maxUses: null, validUntil: null, isActive: true },
  { id: '3', code: 'PRINTEMPS15', type: 'PERCENTAGE', value: 15, uses: 78, maxUses: 200, validUntil: '30 Mar 2025', isActive: false },
  { id: '4', code: 'VIP200', type: 'FIXED', value: 200, uses: 5, maxUses: 50, validUntil: '31 Déc 2025', isActive: true },
];

const promoSchema = z.object({
  code: z.string().min(3, 'Code requis').toUpperCase(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().min(1),
  minAmount: z.number().optional(),
  maxUses: z.number().optional(),
  startsAt: z.string().optional(),
  expiresAt: z.string().optional(),
});
type PromoFormData = z.infer<typeof promoSchema>;

export default function PromosPage() {
  const [promos, setPromos] = useState<PromoCode[]>(mockPromos);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: { type: 'PERCENTAGE' },
  });

  const promoType = watch('type');

  const onSubmit = (data: PromoFormData) => {
    const newPromo: PromoCode = {
      id: `promo-${Date.now()}`,
      code: data.code,
      type: data.type,
      value: data.value,
      uses: 0,
      maxUses: data.maxUses ?? null,
      validUntil: data.expiresAt ?? null,
      isActive: true,
    };
    setPromos((prev) => [newPromo, ...prev]);
    setDialogOpen(false);
    reset();
  };

  const toggleActive = (id: string) => {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !p.isActive } : p));
  };

  const deletePromo = (id: string) => {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Codes Promo
        </h1>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Créer un code
        </Button>
      </div>

      {/* Table */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#C9A875]/10">
                {['Code', 'Type', 'Valeur', 'Utilisations', 'Validité', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-inter font-semibold uppercase tracking-wider text-[#3D2B1F]/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C9A875]/10">
              {promos.map((promo) => (
                <tr key={promo.id} className="hover:bg-[#FAF6EF]/50 transition-colors">
                  <td className="px-4 py-3 font-inter font-mono font-semibold text-sm text-[#3D2B1F]">{promo.code}</td>
                  <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/60">
                    {promo.type === 'PERCENTAGE' ? 'Pourcentage' : 'Montant fixe'}
                  </td>
                  <td className="px-4 py-3 font-inter font-semibold text-sm text-[#1A1410]">
                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${promo.value} MAD`}
                  </td>
                  <td className="px-4 py-3 font-inter text-sm text-[#3D2B1F]/70">
                    {promo.uses}{promo.maxUses ? ` / ${promo.maxUses}` : ''}
                  </td>
                  <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">
                    {promo.validUntil ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(promo.id)}
                      className={`text-xs px-2.5 py-0.5 rounded-full font-inter font-medium transition-colors ${
                        promo.isActive
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {promo.isActive ? 'Actif' : 'Inactif'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-[#C9A875]/10 text-[#B8924B] hover:bg-[#C9A875]/20 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deletePromo(promo.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-lg">
          <DialogHeader>
            <DialogTitle
              className="text-[#3D2B1F]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              Nouveau code promo
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Code (majuscules)</Label>
              <Input
                placeholder="ex: GLOWRY20"
                className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410] uppercase"
                {...register('code')}
                onChange={(e) => setValue('code', e.target.value.toUpperCase())}
              />
              {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
            </div>

            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm mb-2 block">Type</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="PERCENTAGE"
                    {...register('type')}
                    className="accent-[#C9A875]"
                  />
                  <span className="text-sm font-inter text-[#3D2B1F]">Pourcentage (%)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="FIXED"
                    {...register('type')}
                    className="accent-[#C9A875]"
                  />
                  <span className="text-sm font-inter text-[#3D2B1F]">Montant fixe (MAD)</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">
                  Valeur {promoType === 'PERCENTAGE' ? '(%)' : '(MAD)'}
                </Label>
                <Input
                  type="number"
                  min="1"
                  className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
                  {...register('value', { valueAsNumber: true })}
                />
                {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value.message}</p>}
              </div>
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Montant minimum (MAD)</Label>
                <Input
                  type="number"
                  min="0"
                  className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
                  {...register('minAmount', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Date début</Label>
                <Input type="date" className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('startsAt')} />
              </div>
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Date fin</Label>
                <Input type="date" className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('expiresAt')} />
              </div>
            </div>

            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Max utilisations</Label>
              <Input
                type="number"
                min="1"
                placeholder="Illimité"
                className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
                {...register('maxUses', { valueAsNumber: true })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1 border-[#C9A875]/30" onClick={() => setDialogOpen(false)}>Annuler</Button>
              <Button type="submit" className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold">Créer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
