'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  birthdate: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function getInitials(name?: string | null) {
  if (!name) return 'C';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export default function InformationsPage() {
  const { data: session } = useSession();
  const [profileSaved, setProfileSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);
  const [deleteConfirmValue, setDeleteConfirmValue] = useState('');

  const nameParts = session?.user?.name?.split(' ') ?? [];
  const firstName = nameParts[0] ?? '';
  const lastName = nameParts.slice(1).join(' ') ?? '';

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName,
      lastName,
      email: session?.user?.email ?? '',
      phone: '',
      birthdate: '',
    },
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const onProfileSubmit = (_data: ProfileFormData) => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const onPwdSubmit = (_data: PasswordFormData) => {
    resetPwd();
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1
        className="text-2xl text-[#3D2B1F]"
        style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic' }}
      >
        Mes informations
      </h1>

      {/* Profile form */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6">
        <h2 className="font-inter font-semibold text-[#3D2B1F] mb-5">Profil</h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-[#3D2B1F] flex items-center justify-center">
              <span className="text-[#FAF6EF] font-inter font-semibold text-xl">
                {getInitials(session?.user?.name)}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 h-6 w-6 bg-[#C9A875] rounded-full flex items-center justify-center hover:bg-[#B8924B] transition-colors">
              <Camera className="h-3 w-3 text-[#1A1410]" />
            </button>
          </div>
          <div>
            <p className="font-inter font-medium text-[#3D2B1F] text-sm">{session?.user?.name}</p>
            <p className="text-xs font-inter text-[#3D2B1F]/50">{session?.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Prénom</Label>
              <Input className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regProfile('firstName')} />
              {profileErrors.firstName && <p className="text-xs text-red-500 mt-1">{profileErrors.firstName.message}</p>}
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Nom</Label>
              <Input className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regProfile('lastName')} />
              {profileErrors.lastName && <p className="text-xs text-red-500 mt-1">{profileErrors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label className="text-[#3D2B1F] font-inter text-sm">Email</Label>
            <Input type="email" className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regProfile('email')} />
            {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Téléphone</Label>
              <Input className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" placeholder="+212 6 ..." {...regProfile('phone')} />
            </div>
            <div>
              <Label className="text-[#3D2B1F] font-inter text-sm">Date de naissance</Label>
              <Input type="date" className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regProfile('birthdate')} />
            </div>
          </div>
          <Button
            type="submit"
            className="bg-[#C9A875] hover:bg-[#B8924B] text-[#1A1410] font-inter font-semibold"
          >
            {profileSaved ? '✓ Enregistré !' : 'Enregistrer'}
          </Button>
        </form>
      </div>

      {/* Password form */}
      <div className="bg-[#F5EDE0] rounded-xl border border-[#C9A875]/10 p-6">
        <h2 className="font-inter font-semibold text-[#3D2B1F] mb-5">Changer le mot de passe</h2>
        <form onSubmit={handlePwd(onPwdSubmit)} className="space-y-4">
          <div>
            <Label className="text-[#3D2B1F] font-inter text-sm">Mot de passe actuel</Label>
            <Input type="password" className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regPwd('currentPassword')} />
            {pwdErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{pwdErrors.currentPassword.message}</p>}
          </div>
          <div>
            <Label className="text-[#3D2B1F] font-inter text-sm">Nouveau mot de passe</Label>
            <Input type="password" className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regPwd('newPassword')} />
            {pwdErrors.newPassword && <p className="text-xs text-red-500 mt-1">{pwdErrors.newPassword.message}</p>}
          </div>
          <div>
            <Label className="text-[#3D2B1F] font-inter text-sm">Confirmer le mot de passe</Label>
            <Input type="password" className="mt-1 bg-[#FAF6EF] border-[#C9A875]/30 text-[#1A1410]" {...regPwd('confirmPassword')} />
            {pwdErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{pwdErrors.confirmPassword.message}</p>}
          </div>
          <Button
            type="submit"
            className="bg-[#3D2B1F] hover:bg-[#1A1410] text-[#FAF6EF] font-inter font-semibold"
          >
            {pwdSaved ? '✓ Modifié !' : 'Changer le mot de passe'}
          </Button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 p-6 bg-red-50/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="font-inter font-semibold text-red-700">Zone dangereuse</h2>
        </div>
        <p className="text-sm font-inter text-red-600/70 mb-4">
          La suppression de votre compte est irréversible. Toutes vos données seront effacées.
        </p>
        <Button
          variant="outline"
          onClick={() => setDeleteStep(1)}
          className="border-red-300 text-red-600 hover:bg-red-50 font-inter text-sm"
        >
          Supprimer mon compte
        </Button>
      </div>

      {/* Delete dialog */}
      <Dialog open={deleteStep > 0} onOpenChange={() => { setDeleteStep(0); setDeleteConfirmValue(''); }}>
        <DialogContent className="bg-[#FAF6EF] border-red-200 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 font-inter font-semibold">
              {deleteStep === 1 ? 'Êtes-vous sûre ?' : 'Confirmation finale'}
            </DialogTitle>
          </DialogHeader>

          {deleteStep === 1 && (
            <div className="space-y-4 mt-2">
              <p className="text-sm font-inter text-[#3D2B1F]/70">
                Cette action supprimera définitivement :
              </p>
              <ul className="text-sm font-inter text-[#3D2B1F]/60 space-y-1 pl-4">
                <li>• Votre profil et vos informations personnelles</li>
                <li>• Vos {127} points fidélité</li>
                <li>• L'historique de vos commandes</li>
                <li>• Vos adresses sauvegardées</li>
              </ul>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#C9A875]/30 text-[#3D2B1F]"
                  onClick={() => setDeleteStep(0)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={() => setDeleteStep(2)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-inter font-semibold"
                >
                  Continuer
                </Button>
              </div>
            </div>
          )}

          {deleteStep === 2 && (
            <div className="space-y-4 mt-2">
              <p className="text-sm font-inter text-[#3D2B1F]/70">
                Tapez <strong className="text-red-600">SUPPRIMER</strong> pour confirmer la suppression de votre compte.
              </p>
              <Input
                value={deleteConfirmValue}
                onChange={(e) => setDeleteConfirmValue(e.target.value)}
                placeholder="SUPPRIMER"
                className="bg-[#FAF6EF] border-red-200 focus:border-red-400 text-[#1A1410]"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-[#C9A875]/30 text-[#3D2B1F]"
                  onClick={() => { setDeleteStep(0); setDeleteConfirmValue(''); }}
                >
                  Annuler
                </Button>
                <Button
                  disabled={deleteConfirmValue !== 'SUPPRIMER'}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-inter font-semibold disabled:opacity-40"
                  onClick={() => { setDeleteStep(0); }}
                >
                  Supprimer définitivement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
