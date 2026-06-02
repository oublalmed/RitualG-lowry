'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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
  currentUses: number;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

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
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  const fetchPromos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/promos');
      if (!res.ok) throw new Error('Erreur lors du chargement des codes promo');
      const json = await res.json();
      setPromos(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPromos();
  }, [fetchPromos]);

  const onSubmit = async (data: PromoFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      const body: Record<string, unknown> = {
        code: data.code,
        type: data.type,
        value: data.value,
      };
      if (data.minAmount) body.minAmount = data.minAmount;
      if (data.maxUses) body.maxUses = data.maxUses;
      if (data.startsAt) body.startsAt = new Date(data.startsAt).toISOString();
      if (data.expiresAt) body.expiresAt = new Date(data.expiresAt).toISOString();

      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Erreur lors de la création');
      }
      await fetchPromos();
      setDialogOpen(false);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePromo = async (id: string) => {
    try {
      setDeleteId(id);
      const res = await fetch(`/api/admin/promos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      await fetchPromos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setDeleteId(null);
    }
  };

  const formatValidity = (expiresAt: string | null) => {
    if (!expiresAt) return '—';
    return new Date(expiresAt).toLocaleDateString('fr-MA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
          onClick={() => { reset(); setDialogOpen(true); }}
          className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold gap-2"
        >
          <Plus className="h-4 w-4" />
          Créer un code
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-inter text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 rounded-full border-2 border-[#C9A875] border-t-transparent animate-spin" />
          </div>
        ) : (
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
                      {promo.currentUses}{promo.maxUses ? ` / ${promo.maxUses}` : ''}
                    </td>
                    <td className="px-4 py-3 font-inter text-xs text-[#3D2B1F]/50">
                      {formatValidity(promo.expiresAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-inter font-medium ${
                        promo.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {promo.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deletePromo(promo.id)}
                        disabled={deleteId === promo.id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {promos.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm font-inter text-[#3D2B1F]/40">
                      Aucun code promo
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
              <Button type="submit" disabled={submitting} className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold">
                {submitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
