'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Domicile',
    firstName: 'Fatima',
    lastName: 'Zahra',
    line1: '12 Rue Al Amal, Appartement 5',
    city: 'Casablanca',
    postalCode: '20000',
    country: 'Maroc',
    phone: '+212 6 12 34 56 78',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Bureau',
    firstName: 'Fatima',
    lastName: 'Zahra',
    line1: '45 Boulevard Anfa, 3ème étage',
    city: 'Casablanca',
    postalCode: '20050',
    country: 'Maroc',
    phone: '+212 5 22 11 22 33',
    isDefault: false,
  },
];

const addressSchema = z.object({
  label: z.string().min(1, 'Libellé requis'),
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  line1: z.string().min(5, 'Adresse requise'),
  city: z.string().min(2, 'Ville requise'),
  postalCode: z.string().min(4, 'Code postal requis'),
  country: z.string().min(2, 'Pays requis'),
  phone: z.string().optional(),
  isDefault: z.boolean().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

export default function AdressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { country: 'Maroc', isDefault: false },
  });

  const isDefault = watch('isDefault');

  const openNew = () => {
    setEditingId(null);
    reset({ country: 'Maroc', isDefault: false });
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    reset({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      line1: addr.line1,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      isDefault: addr.isDefault,
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: AddressFormData) => {
    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, ...data, isDefault: data.isDefault ?? false }
            : data.isDefault
            ? { ...a, isDefault: false }
            : a
        )
      );
    } else {
      const newAddr: Address = {
        id: `addr-${Date.now()}`,
        ...data,
        phone: data.phone ?? '',
        isDefault: data.isDefault ?? false,
      };
      setAddresses((prev) =>
        data.isDefault ? [...prev.map((a) => ({ ...a, isDefault: false })), newAddr] : [...prev, newAddr]
      );
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[#3D2B1F]"
          style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
        >
          Mes adresses
        </h1>
        {addresses.length < 5 && (
          <Button
            onClick={openNew}
            className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold text-sm gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une adresse
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-[#F5EDE0] rounded-xl border p-5 relative ${
              addr.isDefault ? 'border-[#C9A875]/50' : 'border-[#C9A875]/10'
            }`}
          >
            {addr.isDefault && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 text-xs font-inter font-medium text-[#B8924B] bg-[#C9A875]/15 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Par défaut
                </span>
              </div>
            )}
            <p className="font-inter font-semibold text-[#3D2B1F] text-sm mb-1">{addr.label}</p>
            <p className="font-inter text-sm text-[#3D2B1F]/70">{addr.firstName} {addr.lastName}</p>
            <p className="font-inter text-sm text-[#3D2B1F]/60">{addr.line1}</p>
            <p className="font-inter text-sm text-[#3D2B1F]/60">{addr.postalCode} {addr.city}</p>
            <p className="font-inter text-sm text-[#3D2B1F]/60">{addr.country}</p>
            {addr.phone && (
              <p className="font-inter text-sm text-[#3D2B1F]/60 mt-1">{addr.phone}</p>
            )}

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#C9A875]/15">
              <button
                onClick={() => openEdit(addr)}
                className="flex items-center gap-1 text-xs font-inter text-[#3D2B1F]/60 hover:text-[#3D2B1F] transition-colors"
              >
                <Pencil className="h-3 w-3" />
                Modifier
              </button>
              <span className="text-[#C9A875]/30">|</span>
              <button
                onClick={() => handleDelete(addr.id)}
                className="flex items-center gap-1 text-xs font-inter text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Supprimer
              </button>
              {!addr.isDefault && (
                <>
                  <span className="text-[#C9A875]/30">|</span>
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="flex items-center gap-1 text-xs font-inter text-[#C9A875] hover:text-[#B8924B] transition-colors"
                  >
                    <CheckCircle className="h-3 w-3" />
                    Par défaut
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#FAF6EF] border-[#C9A875]/20 max-w-lg">
          <DialogHeader>
            <DialogTitle
              className="text-[#3D2B1F]"
              style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
            >
              {editingId ? "Modifier l'adresse" : 'Nouvelle adresse'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Libellé</Label>
              <Input
                placeholder="ex: Domicile, Bureau..."
                className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]"
                {...register('label')}
              />
              {errors.label && <p className="text-xs text-red-500 mt-1">{errors.label.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Prénom</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Nom</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Adresse</Label>
              <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('line1')} />
              {errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Ville</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('city')} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Code postal</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('postalCode')} />
                {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Pays</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('country')} />
              </div>
              <div>
                <Label className="text-[#3D2B1F] font-inter text-sm">Téléphone</Label>
                <Input className="mt-1 bg-[#F5EDE0] border-[#C9A875]/30 text-[#1A1410]" {...register('phone')} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isDefault"
                checked={isDefault ?? false}
                onCheckedChange={(v) => setValue('isDefault', v === true)}
                className="border-[#C9A875]/40 data-[state=checked]:bg-[#C9A875]"
              />
              <label htmlFor="isDefault" className="text-sm font-inter text-[#3D2B1F]/70 cursor-pointer">
                Définir comme adresse par défaut
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-[#C9A875]/30 text-[#3D2B1F]"
                onClick={() => setDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-semibold"
              >
                {editingId ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
